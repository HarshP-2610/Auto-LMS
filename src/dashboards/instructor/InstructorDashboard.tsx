import { useState, useEffect } from 'react';
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
  Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { instructorAnalytics } from '@/data/mockData';
import { CreateCourseModal } from './CreateCourseModal';

export function InstructorDashboard() {
  const [userName, setUserName] = useState('');
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInstructorData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      // Fetch Profile
      const profileRes = await fetch('http://localhost:5000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const data = await profileRes.json();
        setUserName(data.name || '');
      }

      // Fetch My Courses
      const coursesRes = await fetch('http://localhost:5000/api/courses/my-courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setMyDocs(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch instructor data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const totalStudentsCount = myDocs.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName || 'Instructor'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here is how your courses are performing
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Create Course Modal */}
        <CreateCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchInstructorData}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={totalStudentsCount.toLocaleString()}
            trend="up"
            trendValue="+12% this month"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Courses"
            value={myDocs.filter(c => c.status === 'published').length || 0}
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
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading courses...</p>
                ) : myDocs.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">You haven't created any courses yet.</p>
                    <Button variant="link" onClick={() => setIsModalOpen(true)}>Create your first course</Button>
                  </div>
                ) : (
                  myDocs.slice(0, 5).map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                    >
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={course.thumbnail === 'no-image.jpg'
                            ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                            : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {course.title}
                          </h3>
                          <Badge
                            variant={course.status === 'published' ? 'default' : course.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-[10px] py-0 px-2 h-5"
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.enrolledStudents?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <Badge variant="secondary" className="bg-transparent border-gray-200 dark:border-gray-700">{course.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/courses/${course._id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )))}
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
                <Button className="w-full justify-start" onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
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
