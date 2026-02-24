import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Edit2, Save, X, Award, Users, BookOpen } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function InstructorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    expertise: 'Web Development, JavaScript, React',
    bio: 'Senior Full Stack Developer with 10+ years of experience. Passionate about teaching and helping others learn to code. I have taught over 10,000 students worldwide.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Instructor Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your instructor profile and settings
            </p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-12 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-900">
                  <AvatarImage src="https://i.pravatar.cc/150?u=101" alt={formData.name} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 md:mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formData.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Senior Instructor</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">12.5K</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">15</p>
                <p className="text-xs text-gray-500">Courses</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Award className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">4.8</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {!isEditing && (
                  <div className="flex gap-2 mt-2">
                    {formData.expertise.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payout Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payout Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 dark:text-gray-400">Payment Method</Label>
              <p className="font-medium text-gray-900 dark:text-white">PayPal</p>
            </div>
            <div>
              <Label className="text-gray-500 dark:text-gray-400">Payout Schedule</Label>
              <p className="font-medium text-gray-900 dark:text-white">Monthly</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            Update Payout Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
