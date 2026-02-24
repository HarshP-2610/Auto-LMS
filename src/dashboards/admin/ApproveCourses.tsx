import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  BookOpen,
  User,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { pendingCourses, users } from '@/data/mockData';

export function ApproveCourses() {
  const [selectedCourse, setSelectedCourse] = useState<(typeof pendingCourses)[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleAction = (
    course: (typeof pendingCourses)[0],
    actionType: 'approve' | 'reject'
  ) => {
    setSelectedCourse(course);
    setAction(actionType);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In a real app, perform the action here
    setActionDialogOpen(false);
    setSelectedCourse(null);
    setAction(null);
  };

  const handleView = (course: (typeof pendingCourses)[0]) => {
    setSelectedCourse(course);
    setViewDialogOpen(true);
  };

  const pendingInstructors = users.filter((u) => u.role === 'instructor' && u.status === 'pending');

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Approve Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve pending courses and instructors
          </p>
        </div>

        {/* Pending Instructors */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Instructor Applications
            </h2>
            <Badge variant="secondary">{pendingInstructors.length}</Badge>
          </div>

          <div className="space-y-4">
            {pendingInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {instructor.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {instructor.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {}}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Courses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Course Approvals
            </h2>
            <Badge variant="secondary">{pendingCourses.length}</Badge>
          </div>

          <div className="space-y-4">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                      <span>{course.lessonsCount} lessons</span>
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleView(course)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(course, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleAction(course, 'reject')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Course Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedCourse?.title}</DialogTitle>
              <DialogDescription>Course preview and details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                  <p className="font-medium">{selectedCourse?.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium">{selectedCourse?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <p className="font-medium">{selectedCourse?.level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium">{selectedCourse?.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                  <p className="font-medium">{selectedCourse?.lessonsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
                  <p className="font-medium">
                    {selectedCourse && new Date(selectedCourse.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setViewDialogOpen(false);
                  if (selectedCourse) handleAction(selectedCourse, 'approve');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {action === 'approve' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                {action === 'approve' ? 'Approve Course' : 'Reject Course'}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {action} &quot;{selectedCourse?.title}&quot;?
                {action === 'reject' && ' This action cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                onClick={confirmAction}
              >
                {action === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
