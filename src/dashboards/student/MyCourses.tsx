import { Link } from 'react-router-dom';
import { Clock, Search, BookOpen, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
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
            setUser(data);

            const mappedCourses = (data.enrolledCourses || [])
              .filter((c: any) => c !== null)
              .map((course: any) => {
                const progressEntry = (data.progress || [])
                  .filter((p: any) => p && p.course)
                  .find((p: any) => (p.course._id || p.course) === course._id);
                return {
                  id: course._id,
                  _id: course._id,
                  title: course.title,
                  instructor: course.instructor?.name || 'Instructor',
                  thumbnail: !course.thumbnail || course.thumbnail === 'no-image.jpg'
                    ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                    : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`),
                  category: course.category,
                  difficulty: course.difficulty,
                  duration: course.duration,
                  lessonsCount: course.lessonsCount || 0,
                  progress: progressEntry ? progressEntry.percentComplete : 0,
                  completed: progressEntry ? progressEntry.percentComplete === 100 : false
                };
              });

            setCourses(mappedCourses);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgressCourses = filteredCourses.filter((c) => !c.completed);
  const completedCourses = filteredCourses.filter((c) => c.completed);

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-neutral-500 font-medium tracking-tight">Loading your learning dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* Simple & Professional Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">My Learning</h1>
            <p className="text-neutral-500 font-medium">
              Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}. You have {courses.length} courses in your library.
            </p>
          </div>
          <Button asChild className="rounded-lg h-11 px-6 font-semibold">
            <Link to="/courses" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Find New Courses
            </Link>
          </Button>
        </div>

        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 leading-tight">{inProgressCourses.length}</p>
              <p className="text-sm font-medium text-neutral-500">Courses in Progress</p>
            </div>
          </div>
          
          <div className="bg-white border border-neutral-200 p-6 rounded-xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 leading-tight">{completedCourses.length}</p>
              <p className="text-sm font-medium text-neutral-500">Completed Courses</p>
            </div>
          </div>
        </div>

        {/* Navigation & Search */}
        <div className="space-y-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <TabsList className="bg-neutral-100 p-1 rounded-lg">
                <TabsTrigger value="all" className="rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm">
                  Completed
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full lg:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 h-11 rounded-lg border-neutral-200 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium py-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8">
              <TabsContent value="all" className="mt-0 outline-none">
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id || course._id}
                        course={{ ...course, id: course.id || course._id }}
                        variant="premium"
                        showProgress={true}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No courses found." subtext="Try adjusting your search terms." />
                )}
              </TabsContent>

              <TabsContent value="in-progress" className="mt-0 outline-none">
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {inProgressCourses.map((course) => (
                      <CourseCard
                        key={course.id || course._id}
                        course={{ ...course, id: course.id || course._id }}
                        variant="premium"
                        showProgress={true}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Clock className="w-8 h-8" />} text="No active courses." subtext="Check the library to start a new track." />
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0 outline-none">
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completedCourses.map((course) => (
                      <CourseCard
                        key={course.id || course._id}
                        course={{ ...course, id: course.id || course._id }}
                        variant="premium"
                        showProgress={true}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Trophy className="w-8 h-8" />} text="No completed courses." subtext="Finish a track to see it here." />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ icon = <Search className="w-8 h-8" />, text, subtext }: { icon?: React.ReactNode, text: string, subtext: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-center space-y-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
      <div className="text-neutral-300">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-neutral-900">{text}</h3>
        <p className="text-neutral-500 text-sm font-medium">{subtext}</p>
      </div>
    </div>
  );
}
