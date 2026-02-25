import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  BookOpen,
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
import { toast } from 'sonner';

export function ApproveCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const fetchPendingCourses = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/admin/pending-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending courses', error);
      toast.error('Failed to load pending courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleAction = (
    course: any,
    actionType: 'approve' | 'reject'
  ) => {
    setSelectedCourse(course);
    setAction(actionType);
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedCourse || !action) return;

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/admin/pending-courses/${selectedCourse._id}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success(`Course ${action}d successfully`);
        fetchPendingCourses();
        setActionDialogOpen(false);
        setSelectedCourse(null);
        setAction(null);
      } else {
        const err = await res.json();
        toast.error(err.message || `Failed to ${action} course`);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleView = (course: any) => {
    setSelectedCourse(course);
    setViewDialogOpen(true);
  };

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

        {/* Pending Courses */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Course Approvals
            </h2>
            <Badge variant="secondary">{courses.length}</Badge>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending courses found.</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center overflow-hidden">
                      {course.thumbnail && course.thumbnail !== 'no-image.jpg' ? (
                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {course.instructor?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span>{course.lessonsCount || 0} lessons</span>
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
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleAction(course, 'reject')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
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
                  <p className="font-medium">{selectedCourse?.instructor?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium">{selectedCourse?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <p className="font-medium">{selectedCourse?.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium">{selectedCourse?.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                  <p className="font-medium">{selectedCourse?.lessonsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium">${selectedCourse?.price}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-sm mt-1">{selectedCourse?.description}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
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
                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
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
