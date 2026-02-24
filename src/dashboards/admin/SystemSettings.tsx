import { useState } from 'react';
import { Save, Bell, Shield, Globe, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'AutoLMS',
    siteDescription: 'Empowering learners worldwide with quality education',
    contactEmail: 'support@autolms.com',
    maintenanceMode: false,
    userRegistration: true,
    instructorApproval: true,
    emailNotifications: true,
    courseReviews: true,
    certificateVerification: true,
  });

  const handleChange = (key: string, value: string | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    // In a real app, save settings here
    alert('Settings saved successfully!');
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure platform settings and preferences
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              General Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Disable access to the platform for maintenance
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">User Registration</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={settings.userRegistration}
                onCheckedChange={(checked) => handleChange('userRegistration', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Instructor Approval Required
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Require admin approval for new instructors
                </p>
              </div>
              <Switch
                checked={settings.instructorApproval}
                onCheckedChange={(checked) => handleChange('instructorApproval', checked)}
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Feature Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send email notifications to users
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Course Reviews</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow students to review courses
                </p>
              </div>
              <Switch
                checked={settings.courseReviews}
                onCheckedChange={(checked) => handleChange('courseReviews', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Certificate Verification
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable public certificate verification
                </p>
              </div>
              <Switch
                checked={settings.certificateVerification}
                onCheckedChange={(checked) => handleChange('certificateVerification', checked)}
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <select
                id="currency"
                className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Platform Commission (%)</Label>
              <Input id="commission" type="number" defaultValue={30} />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Clear Cache</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Clear all cached data and rebuild
                </p>
              </div>
              <Button variant="outline" className="text-orange-600">
                Clear Cache
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Reset Platform</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reset all settings to default (cannot be undone)
                </p>
              </div>
              <Button variant="destructive">Reset Platform</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
