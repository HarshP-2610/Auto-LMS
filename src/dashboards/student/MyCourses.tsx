import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enrolledCourses } from '@/data/mockData';

export function MyCourses() {
  const inProgressCourses = enrolledCourses.filter((c) => !c.completed);
  const completedCourses = enrolledCourses.filter((c) => c.completed);

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              My Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and continue your learning journey
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input type="text" placeholder="Search your courses..." className="pl-10" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="in-progress">
              In Progress
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                {inProgressCourses.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                {completedCourses.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress">
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={{
                      ...course,
                      instructor: course.instructor,
                      lessonsCount: course.totalLessons,
                    }}
                    showProgress
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No courses in progress
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start learning by enrolling in a course
                </p>
                <Button asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={{
                      ...course,
                      instructor: course.instructor,
                      lessonsCount: course.totalLessons,
                    }}
                    showProgress
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No completed courses yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Keep learning to complete your first course
                </p>
                <Button asChild>
                  <Link to="/student/courses">Continue Learning</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    instructor: course.instructor,
                    lessonsCount: course.totalLessons,
                  }}
                  showProgress
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
