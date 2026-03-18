import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function WishlistPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
          // setUser(data); // Removed as it was unused besides this line
          const data = await res.json();

          const mappedCourses = (data.wishlist || [])
            .filter((c: any) => c !== null)
            .map((course: any) => {
              // Check if enrolled to show proper links/progress
              const enrollment = (data.enrolledCourses || []).find((ec: any) => ec._id === course._id);
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
                price: course.price,
                progress: progressEntry ? progressEntry.percentComplete : (enrollment ? 0 : undefined),
                completed: progressEntry ? progressEntry.percentComplete === 100 : false
              };
            });

          setCourses(mappedCourses);
        }
      }
    } catch (error) {
      console.error("Failed to fetch wishlist data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Listen for storage changes to sync wishlist across tabs/components
    const handleStorageChange = () => {
        fetchUserData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-blue-600/20 border-t-blue-600 rounded-full" 
          />
          <p className="text-neutral-500 font-medium tracking-tight">Curating your wishlist...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-neutral-500 font-medium">
              You have {courses.length} courses saved for later.
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search your wishlist..."
              className="pl-10 h-11 rounded-xl border-neutral-200 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Wishlist Grid */}
        <div>
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    variant="premium"
                    showProgress={course.progress !== undefined}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <EmptyState 
                  icon={<Heart className="w-12 h-12 text-neutral-200" />} 
                  text="Your wishlist is empty" 
                  subtext="Browse our courses and save your favorites here!" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ icon, text, subtext }: { icon: React.ReactNode, text: string, subtext: string }) {
  return (
    <div className="py-24 flex flex-col items-center text-center space-y-6 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-neutral-200 dark:border-gray-800 shadow-sm">
      <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-2xl">{icon}</div>
      <div className="space-y-2 max-w-xs">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{text}</h3>
        <p className="text-neutral-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{subtext}</p>
      </div>
      <Button asChild className="rounded-xl h-11 px-8 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
        <Link to="/courses" className="flex items-center gap-2">
          Explore Courses
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
