import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { UserGrowthChart } from '@/components/charts/UserGrowthChart';
import { PieChart } from '@/components/charts/PieChart';
import { adminAnalytics } from '@/data/mockData';
import { Users, BookOpen, DollarSign, TrendingUp, Star } from 'lucide-react';

export function PlatformAnalytics() {
  const categoryData = [
    { name: 'Development', value: 245 },
    { name: 'Data Science', value: 128 },
    { name: 'Design', value: 156 },
    { name: 'Business', value: 94 },
    { name: 'Marketing', value: 71 },
  ];

  const userRoleData = [
    { name: 'Students', value: adminAnalytics.totalStudents },
    { name: 'Instructors', value: adminAnalytics.totalInstructors },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Platform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into platform performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminAnalytics.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {adminAnalytics.totalCourses}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${(adminAnalytics.totalRevenue / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">+15.3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Revenue Overview
            </h2>
            <RevenueChart data={adminAnalytics.monthlyRevenue} />
          </div>

          {/* User Growth */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              User Growth
            </h2>
            <UserGrowthChart data={adminAnalytics.userGrowth} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Categories */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Course Distribution by Category
            </h2>
            <PieChart data={categoryData} />
          </div>

          {/* User Roles */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              User Distribution
            </h2>
            <PieChart data={userRoleData} colors={['#3b82f6', '#10b981']} />
          </div>
        </div>

        {/* Top Courses Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Performing Courses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Course
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Enrollments
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Revenue
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminAnalytics.topCourses.map((course, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 text-gray-900 dark:text-white font-medium">
                      {course.name}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {course.enrollments.toLocaleString()}
                    </td>
                    <td className="py-3 text-green-600 font-medium">
                      ${course.revenue.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        4.8
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
