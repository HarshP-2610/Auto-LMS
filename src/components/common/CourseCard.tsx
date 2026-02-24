import { Link } from 'react-router-dom';
import { Star, Clock, Users, PlayCircle, CheckCircle } from 'lucide-react';
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
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white">
            {course.category}
          </Badge>
        )}
        {course.completed && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
        </p>

        {/* Rating */}
        {course.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {course.rating}
              </span>
            </div>
            {course.reviewCount && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({course.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {course.level && <span>{course.level}</span>}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
          )}
          {course.enrolledStudents && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrolledStudents.toLocaleString()}
            </div>
          )}
        </div>

        {/* Progress */}
        {isProgressVariant && course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            {course.completedLessons !== undefined && course.totalLessons && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            )}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          {course.price !== undefined ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${course.price}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${course.originalPrice}
                </span>
              )}
            </div>
          ) : (
            <div />
          )}
          <Button
            asChild
            variant={isProgressVariant ? 'default' : 'outline'}
            size="sm"
            className={
              isProgressVariant
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : ''
            }
          >
            <Link to={`/courses/${course.id}`}>
              {isProgressVariant ? (
                <>
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Continue
                </>
              ) : (
                'View Details'
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
