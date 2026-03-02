import { useState, useEffect } from 'react';
import {
  Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X,
  User, Shield, Zap, Award, BookOpen, Clock,
  Settings, ExternalLink, Verified, Loader2
} from 'lucide-react';
import { useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [joinedDate, setJoinedDate] = useState<string | null>(null);
  const [avatar, setAvatar] = useState('/no-photo.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.address || '',
            bio: data.bio || '',
          });
          if (data.createdAt) setJoinedDate(data.createdAt);
          if (data.avatar) setAvatar(data.avatar);

          // Update local storage if name changed
          const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (storedData.name !== data.name || storedData.avatar !== data.avatar) {
            localStorage.setItem('userData', JSON.stringify({ ...storedData, ...data }));
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.location,
          bio: formData.bio,
          avatar: avatar
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await fetchProfile(); // Refresh profile data
        setIsEditing(false);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (res.ok) {
        const data = await res.json();
        const serverUrl = 'http://localhost:5000';
        const fullAvatarPath = data.imagePath.startsWith('http') ? data.imagePath : `${serverUrl}${data.imagePath}`;
        setAvatar(fullAvatarPath);
        setMessage({ type: 'success', text: 'Avatar uploaded! Click "Synchronize" to save.' });
      } else {
        setMessage({ type: 'error', text: 'Upload failed' });
      }
    } catch (error) {
      console.error("Upload error", error);
      setMessage({ type: 'error', text: 'Error uploading image' });
    }
  };

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-6xl mx-auto space-y-10 relative">
        {/* Dynamic Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header / Hero Section */}
        <div className="relative group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-blue-500/5 transition-all duration-500">
          <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#ffffff33_0%,transparent_50%)]" />
              <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-16 gap-6">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-neutral-900 shadow-2xl bg-white dark:bg-neutral-800">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={avatar} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-neutral-800 dark:to-neutral-700">
                      {formData.name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition-transform text-blue-600 z-10"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute -top-3 -left-3">
                  <Badge className="bg-blue-600 hover:bg-blue-600 border-none px-3 py-1 shadow-lg ring-4 ring-white dark:ring-neutral-900">
                    <Verified className="w-3.5 h-3.5 mr-1" />
                    PRO
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-2 mb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                    {formData.name || 'Set Your Name'}
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    Student ID: {localStorage.getItem('userToken')?.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 dark:bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {formData.location || 'Add location'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Joined {joinedDate ? new Date(joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '---'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl px-6 border-neutral-200 dark:border-neutral-700">
                      <X className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-xl shadow-blue-500/20">
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Synchronize
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="rounded-xl px-8 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:scale-105 transition-all">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'
                }`}>
                {message.type === 'success' ? <Verified className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Summary & Navigation */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Quick Stats
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">Profile Completion</span>
                    <span className="text-blue-600 font-bold font-mono">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                    <BookOpen className="w-5 h-5 text-indigo-500 mb-2" />
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">12</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Courses</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                    <Award className="w-5 h-5 text-emerald-500 mb-2" />
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">5</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Certificates</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors" />
              <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Refer your friends and earn premium features for your AutoLMS profile.
              </p>
              <Button className="w-full rounded-xl bg-white text-indigo-600 font-bold hover:bg-neutral-50">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>

          {/* Right Column: Detailed Form Sections */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Personal Details</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400/80">Basic identification and contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Full Display Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter full name"
                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-blue-500/20 disabled:opacity-80"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Primary Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="email@example.com"
                      className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white disabled:opacity-80"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Contact Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 group-focus-within:text-blue-500" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white disabled:opacity-80"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Residence / Location</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 group-focus-within:text-blue-500" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white disabled:opacity-80"
                    />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Professional Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself, your goals, and interests..."
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-80 resize-none min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Security & Privacy</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage account access and preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      <Clock className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">Profile Visibility</p>
                      <p className="text-xs text-neutral-500">Your profile is currently public to all students.</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-blue-600 font-bold">Change</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-red-50 dark:border-red-900/10 bg-red-50/20 dark:bg-red-950/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
                      <Settings className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-bold text-red-600">Danger Zone</p>
                      <p className="text-xs text-neutral-500">Once deleted, your data is gone forever.</p>
                    </div>
                  </div>
                  <Button variant="destructive" className="rounded-xl px-6 bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/20">Deactivate</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
