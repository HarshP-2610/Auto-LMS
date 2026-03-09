import { Link } from 'react-router-dom';
import { Star, Clock, PlayCircle, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: {
    id: string;
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
  const isProgressVariant = variant === 'progress' || showProgress;
  const isPremium = variant === 'premium';

  if (isPremium) {
    return (
      <div className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* Top Image Section */}
        <div className="relative aspect-[16/11] overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Floating Category Badge */}
          <div className="absolute top-5 left-5 z-20">
            <Badge className="bg-white/90 dark:bg-neutral-950/80 backdrop-blur-md text-neutral-900 dark:text-neutral-100 border-0 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">
              {course.category || 'Featured'}
            </Badge>
          </div>

          {/* Price Pillar */}
          {course.price !== undefined && (
            <div className="absolute top-5 right-5 z-20">
              <div className="bg-neutral-900 dark:bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                ${course.price}
              </div>
            </div>
          )}

          {/* Rating Hover Reveal */}
          <div className="absolute bottom-5 left-5 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <div className="flex items-center gap-1.5 bg-yellow-400 py-1.5 px-3 rounded-xl shadow-lg">
              <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
              <span className="text-[11px] font-black text-neutral-900">{course.rating || '4.9'}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6">

          <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 leading-[1.2] mb-6 line-clamp-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          {/* Instructor & Action */}
          <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-xs font-black text-neutral-600 dark:text-neutral-300 shadow-inner group-hover:shadow-none group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {(typeof course.instructor === 'string' ? course.instructor[0] : course.instructor?.name?.[0] || 'I')}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1 text-blue-600/0 group-hover:text-blue-600 transition-all">Verified Tutor</span>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 tracking-wide">
                  {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructor'}
                </span>
              </div>
            </div>

            <Link
              to={isProgressVariant ? `/student/knowledge/${course.id}` : `/courses/${course.id}`}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-all duration-300 group/btn"
            >
              {isProgressVariant ? (
                <PlayCircle className="w-6 h-6" />
              ) : (
                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-0.5 transition-transform" />
              )}
            </Link>
          </div>
        </div>

        {/* Bottom Reveal Details Strip */}
        <div className="px-8 pb-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <div className="flex items-center gap-5 text-neutral-400">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {course.duration || '12h Access'}
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              Certification
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {course.category && (
          <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white border-0 py-1.5 px-3 shadow-sm rounded-full text-xs font-semibold uppercase tracking-wider">
            {course.category}
          </Badge>
        )}
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
              (typeof course.instructor === 'string' ? course.instructor[0] : course.instructor?.name?.[0] || 'I')
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructor'}
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
            <Link to={isProgressVariant ? `/student/knowledge/${course.id}` : `/courses/${course.id}`} className="flex items-center gap-2 font-semibold">
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
    </div>
  );
}
