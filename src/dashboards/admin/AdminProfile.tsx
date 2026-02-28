import { useState, useEffect } from 'react';
import {
    Camera, Mail, Phone, MapPin, Edit2, Save, X,
    Shield, Loader2, Sparkles, ShieldCheck,
    Lock, Key, User
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        adminLevel: 1,
        permissions: [] as string[],
        avatar: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    adminLevel: data.adminLevel || 1,
                    permissions: data.permissions || [],
                    avatar: data.avatar || '',
                });
            }
        } catch (error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('userToken');
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                avatar: formData.avatar,
            };

            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Admin profile updated successfully');
                setIsEditing(false);
                const stored = localStorage.getItem('userData');
                if (stored) {
                    const userData = JSON.parse(stored);
                    localStorage.setItem('userData', JSON.stringify({ ...userData, name: formData.name }));
                }
            } else {
                const error = await response.json();
                toast.error(error.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setSaving(false);
        }
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });

            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, avatar: `http://localhost:5000${data.imagePath}` }));
                toast.success('Image uploaded! Save profile to keep changes.');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            toast.error('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout userRole="admin">
                <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full animate-spin border-t-blue-600"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    <p className="text-gray-500 font-medium">Accessing secure protocols...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 rounded-3xl border border-white dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Profile Center</h1>
                            <p className="text-xs text-gray-500 font-medium">Full Access Privileges (Level {formData.adminLevel})</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        {isEditing ? (
                            <>
                                <Button variant="outline" className="flex-1 sm:flex-none h-11 px-6 rounded-xl" onClick={() => setIsEditing(false)} disabled={saving}>
                                    <X className="w-4 h-4 mr-2" />
                                    Discard
                                </Button>
                                <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25">
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto h-11 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-105 transition-transform">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Admin Identity
                            </Button>
                        )}
                    </div>
                </div>

                {/* Hero Profile Section */}
                <div className="relative group">
                    <div className="h-64 rounded-[2.5rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    </div>

                    <div className="px-8 pb-8 -mt-20 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-[2.5rem] p-1.5 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden group/avatar relative">
                                    {uploading && (
                                        <div className="absolute inset-1.5 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2.2rem]">
                                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                                        </div>
                                    )}
                                    <img
                                        src={formData.avatar && formData.avatar !== 'no-photo.jpg' ? formData.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                        alt={formData.name}
                                        className="w-full h-full rounded-[2.2rem] object-cover bg-red-50 dark:bg-gray-900"
                                    />
                                    {isEditing && (
                                        <label className="absolute inset-1.5 bg-black/60 rounded-[2.2rem] flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer z-10">
                                            <input type="file" className="hidden" accept="image/*" onChange={uploadFileHandler} />
                                            <Camera className="w-8 h-8" />
                                        </label>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 border-4 border-white dark:border-gray-950 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 mb-2">
                                <div className="flex flex-col gap-1">
                                    {isEditing ? (
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-3xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-gray-900 dark:text-white"
                                            placeholder="Admin Name"
                                        />
                                    ) : (
                                        <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                                            {formData.name}
                                        </h2>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-red-600 text-white border-none px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/20">
                                            System Administrator
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold">
                                            <Lock className="w-3.5 h-3.5" />
                                            Level {formData.adminLevel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                                <User className="w-6 h-6 text-red-600" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Identity</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Security Credentials</Label>
                                    <div className="space-y-4">
                                        <div className="relative group/field">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-red-500 transition-colors" />
                                            <Input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-red-500/10 transition-all"
                                            />
                                        </div>
                                        <div className="relative group/field">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-red-500 transition-colors" />
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-red-500/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">HQ Location</Label>
                                    <div className="space-y-4">
                                        <div className="relative group/field">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-red-500 transition-colors" />
                                            <Input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-red-500/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/payout">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Key className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="font-bold">Security Clearance</h3>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Active Permissions</Label>
                                    <div className="flex flex-wrap gap-2 text-white">
                                        {formData.permissions.length > 0 ? (
                                            formData.permissions.map((perm, i) => (
                                                <Badge key={i} className="bg-white/10 border-white/20 text-[10px] font-bold py-1 px-3">
                                                    {perm.replace('_', ' ')}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">No specific permissions assigned</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">Admin Hierarchy</p>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full"
                                            style={{ width: `${(formData.adminLevel / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-right text-gray-500 font-bold">LVL {formData.adminLevel} / 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
