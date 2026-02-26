import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  BookOpen,
  AlertCircle,
  Trash2,
  Search,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

export function ApproveCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/admin/courses-all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const pendingCourses = courses.filter(c => c.status === 'pending');
  const existingCourses = courses.filter(c => c.status === 'published' || c.status === 'rejected');

  const filteredExisting = existingCourses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instructor?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        fetchAllCourses();
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

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/admin/courses/${selectedCourse._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success('Course deleted successfully');
        fetchAllCourses();
        setDeleteDialogOpen(false);
        setSelectedCourse(null);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to delete course');
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Manage Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review pending approvals and manage existing courses
            </p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-gray-800 border-none p-1">
            <TabsTrigger value="pending" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              Pending Approvals
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                {pendingCourses.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="existing" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              Platform Courses
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {existingCourses.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading courses...</p>
                ) : pendingCourses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending courses found.</p>
                ) : (
                  pendingCourses.map((course) => (
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
                            <Badge variant="secondary" className="text-xs capitalize">
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
          </TabsContent>

          <TabsContent value="existing">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search courses or instructors..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading courses...</p>
                ) : filteredExisting.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No courses found.</p>
                ) : (
                  filteredExisting.map((course) => (
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                            <Badge className={
                              course.status === 'published'
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }>
                              {course.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {course.instructor?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(course)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-200 dark:border-red-900/50"
                          onClick={() => {
                            setSelectedCourse(course);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                Delete Course
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{selectedCourse?.title}&quot;?
                This action cannot be undone and will remove the course and all its content from the platform.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCourse}
              >
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
