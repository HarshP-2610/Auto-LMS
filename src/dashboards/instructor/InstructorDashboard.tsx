import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Plus,
  Star,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { instructorAnalytics, courses } from '@/data/mockData';

export function InstructorDashboard() {
  const myCourses = courses.slice(0, 4);

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, Instructor! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here is how your courses are performing
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Link to="/instructor/courses">
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={instructorAnalytics.totalStudents.toLocaleString()}
            trend="up"
            trendValue="+12% this month"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Courses"
            value={instructorAnalytics.totalCourses}
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="Total Revenue"
            value={`$${instructorAnalytics.totalRevenue.toLocaleString()}`}
            trend="up"
            trendValue="+8% this month"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Avg. Rating"
            value="4.8"
            description="Based on 1,245 reviews"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Overview
                </h2>
                <Link
                  to="/instructor/analytics"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  View Analytics
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <RevenueChart data={instructorAnalytics.monthlyRevenue} />
            </div>

            {/* My Courses */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Courses
                </h2>
                <Link
                  to="/instructor/courses"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  Manage All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolledStudents?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </span>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/courses/${course.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/instructor/courses">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/instructor/lessons">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add Lessons
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/instructor/quizzes">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Link>
                </Button>
              </div>
            </div>

            {/* Top Performing Course */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Course
              </h2>
              {instructorAnalytics.coursePerformance[0] && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {instructorAnalytics.coursePerformance[0].name}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {instructorAnalytics.coursePerformance[0].students.toLocaleString()} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {instructorAnalytics.coursePerformance[0].rating}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Enrollments
              </h2>
              <div className="space-y-3">
                {instructorAnalytics.studentEnrollment.slice(-5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      +{item.students}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
