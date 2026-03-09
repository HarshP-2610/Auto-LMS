import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Search, Loader2, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
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

            // Map enrolled courses with their progress
            const mappedCourses = (data.enrolledCourses || [])
              .filter((c: any) => c !== null)
              .map((course: any) => {
                const progressEntry = (data.progress || [])
                  .filter((p: any) => p && p.course)
                  .find((p: any) =>
                    (p.course._id || p.course) === course._id
                  );
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
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
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
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium tracking-tight">Accessing your learning vault...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Modern Glass Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-1 font-sans shadow-2xl shadow-indigo-500/20">
          <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-14 overflow-hidden border border-white/10">
            {/* Decorative Orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Active Learning Hub</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.9]">
                  Inspire Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Future Success.</span>
                </h1>
                <p className="text-indigo-100/70 text-lg font-medium max-w-lg leading-relaxed">
                  Continue your transformative journey. You have <span className="text-white font-bold">{courses.length} excellence badges</span> in your vault.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-950 hover:bg-indigo-50 rounded-2xl font-black px-8 h-16 shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
                >
                  <Link to="/courses" className="flex items-center gap-3">
                    <PlayCircle className="w-6 h-6" />
                    Expand Your Knowledge
                  </Link>
                </Button>
                <div className="flex items-center gap-6 px-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white leading-none">{completedCourses.length}</p>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest mt-1">Mastered</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-white leading-none">{inProgressCourses.length}</p>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest mt-1">In Pulse</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation, Search & Content Showcase */}
        <div className="space-y-12">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              <TabsList className="h-16 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <TabsTrigger
                  value="all"
                  className="rounded-xl px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-neutral-950 shadow-none data-[state=active]:shadow-xl"
                >
                  All Access
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="rounded-xl px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-lg"
                >
                  In Progress ({inProgressCourses.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-xl px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-green-600 data-[state=active]:text-white shadow-none data-[state=active]:shadow-lg"
                >
                  Mastered ({completedCourses.length})
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full lg:w-96 group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <Input
                  type="text"
                  placeholder="Search your library..."
                  className="w-full h-16 pl-12 pr-6 rounded-2xl bg-white dark:bg-white/5 border-neutral-200 dark:border-white/10 font-bold text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <TabsContent value="all" className="mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id || course._id}
                      course={{
                        ...course,
                        id: course.id || course._id,
                        instructor: course.instructor,
                        lessonsCount: course.lessonsCount,
                      }}
                      variant="premium"
                      showProgress={true}
                    />
                  ))}
                </div>
                {filteredCourses.length === 0 && (
                  <div className="py-32 flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center animate-bounce">
                      <Search className="w-10 h-10 text-neutral-300" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-neutral-900 dark:text-white">No matches found</h3>
                      <p className="text-neutral-500 font-medium">Try refining your search keyword or browse categories.</p>
                    </div>
                    <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-xl h-12 px-6 font-bold">Clear All Filters</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="in-progress" className="mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {inProgressCourses.map((course) => (
                    <CourseCard
                      key={course.id || course._id}
                      course={{
                        ...course,
                        id: course.id || course._id,
                        instructor: course.instructor,
                        lessonsCount: course.lessonsCount,
                      }}
                      variant="premium"
                      showProgress={true}
                    />
                  ))}
                </div>
                {inProgressCourses.length === 0 && (
                  <div className="py-32 text-center space-y-4">
                    <Clock className="w-16 h-16 text-neutral-200 mx-auto" />
                    <h3 className="text-xl font-bold">No active courses</h3>
                    <p className="text-neutral-500">Pick up where you left off from the library.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0 focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {completedCourses.map((course) => (
                    <CourseCard
                      key={course.id || course._id}
                      course={{
                        ...course,
                        id: course.id || course._id,
                        instructor: course.instructor,
                        lessonsCount: course.lessonsCount,
                      }}
                      variant="premium"
                      showProgress={true}
                    />
                  ))}
                </div>
                {completedCourses.length === 0 && (
                  <div className="py-32 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-neutral-200 mx-auto" />
                    <h3 className="text-xl font-bold">No completed courses</h3>
                    <p className="text-neutral-500">Complete all lessons to earn your certification.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
