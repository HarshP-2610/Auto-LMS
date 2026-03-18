import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, PlayCircle, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: {
    id: string;
    _id?: string; // Add _id support
    title: string;
    thumbnail: string;
    instructor: string | { name: string; avatar?: string };
    rating?: number;
    reviewCount?: number;
    price?: number;
    originalPrice?: number;
    level?: string;
    duration?: string;
    lessonsCount?: number;
    enrolledStudents?: number;
    category?: string;
    progress?: number;
    completedLessons?: number;
    totalLessons?: number;
    completed?: boolean;
  };
  variant?: 'default' | 'progress' | 'compact' | 'premium';
  showProgress?: boolean;
}

export function CourseCard({ course, variant = 'default', showProgress = false }: CourseCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const courseId = course.id || course._id;

  useEffect(() => {
    const checkWishlist = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.wishlist) {
          // wishlist might be array of strings (IDs) or array of objects
          const isInWishlist = user.wishlist.some((item: any) => 
            (typeof item === 'string' ? item === courseId : item._id === courseId)
          );
          setIsWishlisted(isInWishlist);
        }
      }
    };
    checkWishlist();
  }, [courseId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    setIsToggling(true);
    try {
      if (isWishlisted) {
        const res = await fetch(`http://localhost:5000/api/users/wishlist/remove/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setIsWishlisted(false);
          updateLocalStorageWishlist(courseId, 'remove');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/users/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courseId })
        });
        if (res.ok) {
          setIsWishlisted(true);
          updateLocalStorageWishlist(courseId, 'add');
        }
      }
    } catch (error) {
      console.error("Wishlist toggle failed", error);
    } finally {
      setIsToggling(false);
    }
  };

  const updateLocalStorageWishlist = (id: string, action: 'add' | 'remove') => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.wishlist) user.wishlist = [];
      
      if (action === 'add') {
        if (!user.wishlist.includes(id)) {
          user.wishlist.push(id);
        }
      } else {
        user.wishlist = user.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item !== id : item._id !== id)
        );
      }
      localStorage.setItem('userData', JSON.stringify(user));
    }
  };

  const isProgressVariant = variant === 'progress' || showProgress;
  const isPremium = variant === 'premium';

  if (isPremium) {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {/* Simple Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-white/90 text-neutral-900 border border-neutral-200 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {course.category || 'Featured'}
            </Badge>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            disabled={isToggling}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 shadow-sm border border-neutral-200 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Professional Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Progress Bar (Always visible if exists) */}
          {course.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200">
                {(typeof course.instructor === 'string' ? course.instructor[0] : course.instructor?.name?.[0] || 'I')}
              </div>
              <span className="text-sm font-semibold text-neutral-700">
                {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructor'}
              </span>
            </div>

            <Link
              to={isProgressVariant ? `/student/knowledge/${courseId}` : `/courses/${courseId}`}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-md hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {course.category && (
            <Badge className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white border-0 py-1.5 px-3 shadow-sm rounded-full text-xs font-semibold uppercase tracking-wider">
              {course.category}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={isToggling}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-red-500 transition-all active:scale-90"
        >
          <motion.div
            animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </motion.div>
        </button>

        {course.completed && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transform scale-100 animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        {course.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500">
                {course.rating}
              </span>
            </div>
            {course.reviewCount && (
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                ({course.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 overflow-hidden shadow-sm">
            {typeof course.instructor !== 'string' && course.instructor?.avatar ? (
              <img src={course.instructor.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (typeof course.instructor === 'string' ? course.instructor[0] : (course.instructor as any)?.name?.[0] || 'I')
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {typeof course.instructor === 'string' ? course.instructor : (course.instructor as any)?.name || 'Instructor'}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
          {course.level && (
            <div className="flex items-center font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              {course.level}
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-gray-400" />
              {course.duration}
            </div>
          )}
        </div>

        {/* Progress */}
        {isProgressVariant && course.progress !== undefined && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Course Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2.5 bg-gray-200 dark:bg-gray-700" />
            {course.completedLessons !== undefined && course.totalLessons && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            )}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {course.price !== undefined ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-sm font-medium text-gray-400 line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div />
          )}
          <Button
            asChild
            variant={isProgressVariant ? 'default' : 'outline'}
            className={
              isProgressVariant
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all h-11 px-6'
                : 'rounded-xl h-11 px-6 group/btn border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            }
          >
            <Link to={isProgressVariant ? `/student/knowledge/${courseId}` : `/courses/${courseId}`} className="flex items-center gap-2 font-semibold">
              {isProgressVariant ? (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Continue
                </>
              ) : (
                <>
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
