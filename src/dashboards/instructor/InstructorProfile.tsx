import { useState, useEffect } from 'react';
import {
  Camera, Mail, Phone, MapPin, Edit2, Save, X,
  Award, Users, Globe, Briefcase,
  CreditCard, Calendar, CheckCircle2, Loader2,
  Sparkles, ShieldCheck, Github, Linkedin, Twitter
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function InstructorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    students: '0',
    courses: '0',
    rating: '0.0'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    instructorTitle: '',
    expertise: '',
    instructorBio: '',
    avatar: '',
    payoutMethod: 'PayPal',
    payoutSchedule: 'Monthly'
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
          location: data.location || '',
          instructorTitle: data.instructorTitle || 'Instructor',
          expertise: Array.isArray(data.expertise) ? data.expertise.join(', ') : '',
          instructorBio: data.instructorBio || '',
          avatar: data.avatar || '',
          payoutMethod: data.payoutSettings?.method || 'PayPal',
          payoutSchedule: data.payoutSettings?.schedule || 'Monthly'
        });
        setStats({
          students: data.numReviews > 0 ? '12.5K' : '0',
          courses: (data.taughtCourses?.length || 0).toString(),
          rating: (data.rating || 0).toFixed(1)
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        location: formData.location,
        instructorTitle: formData.instructorTitle,
        instructorBio: formData.instructorBio,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s !== ''),
        avatar: formData.avatar,
        payoutSettings: {
          method: formData.payoutMethod,
          schedule: formData.payoutSchedule
        }
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
        toast.success('Profile updated successfully');
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
        toast.success('Image uploaded! Click Push Updates to save.');
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
      <DashboardLayout userRole="instructor">
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full animate-spin border-t-blue-600"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Designing your universe...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="instructor">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 rounded-3xl border border-white dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile Control Center</h1>
              <p className="text-xs text-gray-500 font-medium">Verified Instructor Account</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button variant="outline" className="flex-1 sm:flex-none h-11 px-6 rounded-xl" onClick={() => setIsEditing(false)} disabled={saving}>
                  <X className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Push Updates
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto h-11 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-105 transition-transform">
                <Edit2 className="w-4 h-4 mr-2" />
                Customize Profile
              </Button>
            )}
          </div>
        </div>

        {/* Hero Profile Section */}
        <div className="relative group">
          <div className="h-64 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute top-8 right-8 flex gap-3">
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all text-white border border-white/20">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all text-white border border-white/20">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all text-white border border-white/20">
                <Github className="w-5 h-5" />
              </button>
            </div>
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
                    src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                    alt={formData.name}
                    className="w-full h-full rounded-[2.2rem] object-cover bg-blue-50 dark:bg-gray-900"
                  />
                  {isEditing && (
                    <label className="absolute inset-1.5 bg-black/60 rounded-[2.2rem] flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer z-10">
                      <input type="file" className="hidden" accept="image/*" onChange={uploadFileHandler} />
                      <Camera className="w-8 h-8" />
                    </label>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white dark:border-gray-950 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
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
                      placeholder="Your Full Name"
                    />
                  ) : (
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                      {formData.name}
                    </h2>
                  )}
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <Input
                        name="instructorTitle"
                        value={formData.instructorTitle}
                        onChange={handleChange}
                        className="max-w-[300px] h-9 bg-white/50 dark:bg-gray-800/50 rounded-xl"
                        placeholder="Your Title (e.g. Senior Instructor)"
                      />
                    ) : (
                      <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20">
                        {formData.instructorTitle}
                      </Badge>
                    )}
                    {!isEditing && (
                      <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        {formData.location || 'Remote'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-2">
                <div className="px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-white dark:border-gray-800 shadow-xl text-center min-w-[120px]">
                  <p className="text-2xl font-black text-blue-600">{stats.students}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Fans</p>
                </div>
                <div className="px-6 py-4 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-500/30 text-center min-w-[120px]">
                  <p className="text-2xl font-black text-white">{stats.rating}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-blue-200">Star Power</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">The Curriculum Vitae</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Communication</Label>
                  <div className="space-y-4">
                    <div className="relative group/field">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div className="relative group/field">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Presence</Label>
                  <div className="space-y-4">
                    <div className="relative group/field">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div className="relative group/field">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <Input
                        value="www.portfolio.me"
                        disabled
                        className="pl-12 h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium cursor-not-allowed opacity-60"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Weaponry of Expert (Skills)</Label>
                  <Input
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. JavaScript, React, UI Design (use commas)"
                    className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  {!isEditing && (
                    <div className="flex flex-wrap gap-2">
                      {formData.expertise.split(',').map((skill, i) => (
                        <Badge key={i} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">The Legend (Biography)</Label>
                  <textarea
                    name="instructorBio"
                    rows={6}
                    value={formData.instructorBio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-5 rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm font-medium min-h-[180px] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none disabled:opacity-80"
                    placeholder="Tell your life story..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financials & Extras */}
          <div className="space-y-8">
            {/* Payout Center */}
            <div className="p-8 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/payout">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold">Treasury Hub</h3>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Current Earnings</Label>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-3xl font-black font-mono tracking-tighter">$14,240.00</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      Payout Route
                    </Label>
                    {isEditing ? (
                      <select
                        name="payoutMethod"
                        value={formData.payoutMethod}
                        onChange={handleChange}
                        className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option className="bg-gray-900" value="PayPal">PayPal (Direct)</option>
                        <option className="bg-gray-900" value="Stripe">Stripe Connect</option>
                        <option className="bg-gray-900" value="Bank Transfer">Bank SWIFT</option>
                      </select>
                    ) : (
                      <p className="text-sm font-bold flex items-center gap-2">
                        {formData.payoutMethod}
                        <Badge className="bg-green-500/20 text-green-400 border-none text-[8px] h-4">Active</Badge>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      Frequency
                    </Label>
                    {isEditing ? (
                      <select
                        name="payoutSchedule"
                        value={formData.payoutSchedule}
                        onChange={handleChange}
                        className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option className="bg-gray-900" value="Monthly">Monthly Cycle</option>
                        <option className="bg-gray-900" value="Weekly">Weekly Burst</option>
                        <option className="bg-gray-900" value="Quarterly">Quarterly Vault</option>
                      </select>
                    ) : (
                      <p className="text-sm font-bold">{formData.payoutSchedule} Settlement</p>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-xs font-bold transition-all">
                  Configure Banking Secrets
                </Button>
              </div>
            </div>

            {/* Quick Achievements */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hall of Fame</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Top 1% Mentor</p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase">Gold Tier Badge</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Global Community</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase">10k+ Strong</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
