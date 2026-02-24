import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { PieChart } from '@/components/charts/PieChart';
import { instructorAnalytics } from '@/data/mockData';
import { Users, TrendingUp, DollarSign, Star } from 'lucide-react';

export function InstructorAnalytics() {
  const enrollmentData = instructorAnalytics.studentEnrollment.map((item) => ({
    day: item.month,
    progress: item.students,
  }));

  const courseDistribution = instructorAnalytics.coursePerformance.map((course) => ({
    name: course.name,
    value: course.students,
  }));

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your performance and earnings
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {instructorAnalytics.totalStudents.toLocaleString()}
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
                  ${instructorAnalytics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-600">+12.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Revenue Overview
            </h2>
            <RevenueChart data={instructorAnalytics.monthlyRevenue} />
          </div>

          {/* Student Enrollment */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Student Enrollment
            </h2>
            <ProgressChart data={enrollmentData} type="line" />
          </div>
        </div>

        {/* Course Performance & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Performance Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Course Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Course
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Students
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {instructorAnalytics.coursePerformance.map((course, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-900 dark:text-white">{course.name}</td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {course.students.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          {course.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Student Distribution
            </h2>
            <PieChart data={courseDistribution} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
