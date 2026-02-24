import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  PlayCircle,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { courses } from '@/data/mockData';

export function ManageLessons() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons =
    selectedCourse?.lessons?.filter((lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Manage Lessons
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize and manage your course content
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        {/* Course Selector */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse?.id}
            onChange={(e) => {
              const course = courses.find((c) => c.id === e.target.value);
              if (course) setSelectedCourse(course);
            }}
            className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lessons */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCourse?.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredLessons.length} lessons • {selectedCourse?.duration} total
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLessons.map((lesson, index) => (
              <div key={lesson.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 w-8">{index + 1}</span>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {lesson.duration}
                    </p>
                  </div>
                  <Badge variant="secondary">Video</Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <button
                      onClick={() =>
                        setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
                      }
                    >
                      {expandedLesson === lesson.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedLesson === lesson.id && (
                  <div className="px-4 pb-4 pl-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Lesson content and settings would appear here. You can edit the video
                        URL, add descriptions, and manage resources.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm">Edit Content</Button>
                        <Button size="sm" variant="outline">
                          Manage Resources
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
