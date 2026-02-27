import { Link } from 'react-router-dom';
import { Star, Clock, Users, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    thumbnail: string;
    instructor: string | { name: string };
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
  variant?: 'default' | 'progress' | 'compact';
  showProgress?: boolean;
}

export function CourseCard({ course, variant = 'default', showProgress = false }: CourseCardProps) {
  const isProgressVariant = variant === 'progress' || showProgress;

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
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 font-medium">
          By <span className="text-gray-700 dark:text-gray-300">{typeof course.instructor === 'string' ? course.instructor : course.instructor.name}</span>
        </p>

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
          {course.enrolledStudents && (
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-gray-400" />
              {course.enrolledStudents.toLocaleString()}
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
            <Link to={`/courses/${course.id}`} className="flex items-center gap-2 font-semibold">
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
