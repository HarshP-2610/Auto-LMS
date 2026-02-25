import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { UserGrowthChart } from '@/components/charts/UserGrowthChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminAnalytics } from '@/data/mockData';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [pendingInstructors, setPendingInstructors] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      // Fetch pending instructors
      const pendingResponse = await fetch('http://localhost:5000/api/admin/pending-instructors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (pendingResponse.ok) {
        setPendingInstructors(await pendingResponse.json());
      }

      // Fetch pending courses
      const coursesResponse = await fetch('http://localhost:5000/api/admin/pending-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (coursesResponse.ok) {
        setPendingCourses(await coursesResponse.json());
      }

      // Fetch profile
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setUserName(data.name || '');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCourseAction = async (courseId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/admin/pending-courses/${courseId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success(`Course ${action}d successfully`);
        fetchData(); // Refresh
      } else {
        const err = await res.json();
        toast.error(err.message || `Failed to ${action} course`);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {userName || 'Administrator'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={adminAnalytics.totalUsers.toLocaleString()}
            trend="up"
            trendValue="+5% this month"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Courses"
            value={adminAnalytics.totalCourses}
            trend="up"
            trendValue="+12 new this week"
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(adminAnalytics.totalRevenue / 1000000).toFixed(2)}M`}
            trend="up"
            trendValue="+8% this month"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingInstructors.length + pendingCourses.length}
            icon={AlertCircle}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Growth Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Growth
                </h2>
                <Link
                  to="/admin/analytics"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  View Analytics
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <UserGrowthChart data={adminAnalytics.userGrowth} />
            </div>

            {/* Pending Approvals */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pending Approvals
                </h2>
                <Badge variant="secondary">{pendingInstructors.length + pendingCourses.length}</Badge>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Loading approvals...</p>
                ) : (pendingInstructors.length === 0 && pendingCourses.length === 0) ? (
                  <p className="text-center text-gray-500 py-4">No pending approvals at the moment.</p>
                ) : (
                  <>
                    {/* Pending Instructors */}
                    {pendingInstructors.slice(0, 3).map((instructor) => (
                      <div
                        key={instructor._id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {instructor.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Instructor Application
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/admin/pending-instructors">View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Pending Courses */}
                    {pendingCourses.slice(0, 3).map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              by {course.instructor?.name || 'Instructor'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 h-8" onClick={() => handleCourseAction(course._id, 'approve')}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-8" onClick={() => handleCourseAction(course._id, 'reject')}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {(pendingInstructors.length > 3 || pendingCourses.length > 3) && (
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/admin/courses">View All Pending</Link>
                </Button>
              )}
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
                  <Link to="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/courses">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Approve Courses
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/analytics">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Courses
              </h2>
              <div className="space-y-4">
                {adminAnalytics.topCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {course.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.enrollments.toLocaleString()} enrollments
                      </p>
                    </div>
                    <span className="text-green-600 font-medium text-sm">
                      ${course.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Server Status</span>
                  <Badge className="bg-green-100 text-green-700">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Database</span>
                  <Badge className="bg-green-100 text-green-700">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="text-sm text-gray-900 dark:text-white">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
