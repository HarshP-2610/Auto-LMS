import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  TrendingUp,
  PlayCircle,
  ChevronRight,
  FileQuestion,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import {
  studentStats,
  certificates,
} from '@/data/mockData';
import { Loader2 } from 'lucide-react';

export function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificatesEarned: 0,
    averageProgress: 0,
    weeklyProgress: [
      { day: 'Mon', progress: 0 },
      { day: 'Tue', progress: 0 },
      { day: 'Wed', progress: 0 },
      { day: 'Thu', progress: 0 },
      { day: 'Fri', progress: 0 },
      { day: 'Sat', progress: 0 },
      { day: 'Sun', progress: 0 },
    ]
  });
  const [recentQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            setUserName(data.name || '');

            // Map enrolled courses with their progress
            const mappedCourses = (data.enrolledCourses || []).map((course: any) => {
              const progressEntry = (data.progress || []).find((p: any) =>
                (p.course._id || p.course) === course._id
              );
              return {
                id: course._id,
                courseId: course._id,
                title: course.title,
                instructor: course.instructor?.name || 'Instructor',
                thumbnail: course.thumbnail === 'no-image.jpg'
                  ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                  : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`),
                progress: progressEntry ? progressEntry.percentComplete : 0,
                completed: progressEntry ? progressEntry.percentComplete === 100 : false
              };
            });

            setCourses(mappedCourses);

            // Update stats
            const completedCount = mappedCourses.filter((c: any) => c.completed).length;
            const inProgressCount = mappedCourses.length - completedCount;
            const avgProg = mappedCourses.length > 0
              ? Math.round(mappedCourses.reduce((acc: number, c: any) => acc + c.progress, 0) / mappedCourses.length)
              : 0;

            setStats(prev => ({
              ...prev,
              totalEnrolled: mappedCourses.length,
              completedCourses: completedCount,
              inProgressCourses: inProgressCount,
              certificatesEarned: (data.certificates || []).length,
              averageProgress: avgProg
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium tracking-tight">Synchronizing your classroom...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here is what is happening with your learning journey
            </p>
          </div>
          <Button asChild>
            <Link to="/student/courses">
              <PlayCircle className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Enrolled Courses"
            value={stats.totalEnrolled}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={stats.completedCourses}
            description={`${stats.inProgressCourses} in progress`}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Certificates"
            value={stats.certificatesEarned}
            icon={Award}
            color="purple"
          />
          <StatCard
            title="Avg. Progress"
            value={`${stats.averageProgress}%`}
            trend="up"
            trendValue="+5% this week"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weekly Learning Progress
                </h2>
                <Link
                  to="/student/courses"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <ProgressChart data={stats.weeklyProgress} />
            </div>

            {/* Continue Learning */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Continue Learning
                </h2>
                <Link
                  to="/student/courses"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {courses.filter(c => !c.completed).slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {course.instructor}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/student/knowledge/${course.courseId}`}>
                        <PlayCircle className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {courses.filter(c => !c.completed).length === 0 && (
                  <p className="text-center text-gray-500 py-8">You don't have any courses in progress.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quiz Results */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Quizzes
                </h2>
                <Link
                  to="/student/quizzes"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${result.passed
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                          }`}
                      >
                        <FileQuestion
                          className={`w-5 h-5 ${result.passed
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {result.quizTitle}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {result.courseTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${result.passed
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                          {result.score}%
                        </span>
                        <p className="text-xs text-gray-500">
                          {result.passed ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No quizzes taken yet
                  </p>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Certificates
                </h2>
                <Link
                  to="/student/certificates"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View All
                </Link>
              </div>

              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {cert.certificateId}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Issued on {new Date(cert.issuedDate).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Complete courses to earn certificates
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quiz Performance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Attempts</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {studentStats.quizAttempts}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Passed</span>
                  <span className="font-medium text-green-600">
                    {studentStats.quizPassed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Failed</span>
                  <span className="font-medium text-red-600">{studentStats.quizFailed}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Success Rate
                    </span>
                    <span className="font-bold text-blue-600">
                      {Math.round((studentStats.quizPassed / studentStats.quizAttempts) * 100)}%
                    </span>
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
