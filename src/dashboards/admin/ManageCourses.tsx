import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search,
    MoreVertical,
    Trash2,
    Eye,
    Loader2,
    Library,
    Star,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Layers,
    Video,
    FileQuestion,
    FileText,
    CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Course {
    _id: string;
    title: string;
    thumbnail?: string;
    category: string;
    status: string;
    price: number;
    rating?: number;
    enrolledStudents?: number;
    lessonsCount?: number;
    instructor: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export function ManageCourses() {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [courseDetails, setCourseDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    const fetchAllCourses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/courses-all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCoursesList(data);
            } else {
                toast.error(data.message || 'Failed to fetch courses');
            }
        } catch (error) {
            toast.error('An error occurred while fetching courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const filteredCourses = coursesList.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (courseId: string) => {
        setSelectedCourseId(courseId);
        setDeleteDialogOpen(true);
    };

    const fetchFullCourseDetails = async (courseId: string) => {
        setDetailsLoading(true);
        setDetailsDialogOpen(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}/full-details`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCourseDetails(data);
            } else {
                toast.error(data.message || 'Failed to fetch course details');
                setDetailsDialogOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred');
            setDetailsDialogOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedCourseId) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/courses/${selectedCourseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Course deleted successfully');
                setCoursesList(coursesList.filter(c => c._id !== selectedCourseId));
            } else {
                toast.error(data.message || 'Failed to delete course');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedCourseId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Published
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Library className="w-8 h-8 text-blue-600" />
                            Manage Courses
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View and manage all courses on the platform
                        </p>
                    </div>
                    <Badge variant="outline" className="w-fit h-fit px-4 py-1.5 rounded-full border-blue-200 text-blue-600 bg-blue-50">
                        {filteredCourses.length} Courses Total
                    </Badge>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search courses by title, category, or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Courses Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Fetching course records...</p>
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Course
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Instructor
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Stats
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredCourses.map((course) => (
                                        <tr key={course._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={course.thumbnail === 'no-image.jpg'
                                                            ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                                                            : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                                        alt={course.title}
                                                        className="w-12 h-8 object-cover rounded shadow-sm"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]" title={course.title}>
                                                            {course.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {course.lessonsCount || 0} lessons &bull; ${course.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                                                        {course.instructor?.name || 'Unknown Instructor'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                        {course.instructor?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="whitespace-nowrap">{course.category}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {course.enrolledStudents?.length || 0} students
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-gray-700 dark:text-gray-300">{course.rating || '5.0'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(course.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-2xl shadow-xl border-gray-100">
                                                        <DropdownMenuItem 
                                                            className="rounded-xl px-3 py-2 cursor-pointer"
                                                            onClick={() => fetchFullCourseDetails(course._id)}
                                                        >
                                                            <Layers className="w-4 h-4 mr-2 text-purple-500" />
                                                            <span className="text-sm font-medium">View Details</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer">
                                                            <Link to={course.status === 'published' ? `/courses/${course._id}` : '#'}>
                                                                <Eye className="w-4 h-4 mr-2 text-blue-500" />
                                                                <span className="text-sm font-medium">Preview Course</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl px-3 py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => handleDelete(course._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            <span className="text-sm font-bold">Delete Course</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Library className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No courses found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-1">We couldn't find any courses matching your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-red-600">Delete Course</DialogTitle>
                            <DialogDescription className="text-gray-500 pt-2">
                                Are you sure you want to delete this course? This action cannot be undone and will permanently remove all associated lessons and quiz data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3 pt-6">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-xl h-11 px-6 border-gray-200">
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                className="rounded-xl h-11 px-8 font-bold"
                            >
                                Delete Course
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Course Details Dialog */}
                <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
                        {detailsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Loading course intelligence...</p>
                            </div>
                        ) : courseDetails ? (
                            <>
                                <DialogHeader className="p-8 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-100 dark:border-gray-800">
                                    <div className="flex gap-6 items-start">
                                        <img
                                            src={courseDetails.course.thumbnail === 'no-image.jpg'
                                                ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                                                : (courseDetails.course.thumbnail?.startsWith('http') ? courseDetails.course.thumbnail : `http://localhost:5000/uploads/${courseDetails.course.thumbnail}`)}
                                            alt={courseDetails.course.title}
                                            className="w-32 h-20 object-cover rounded-2xl shadow-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="bg-blue-600 hover:bg-blue-600">{courseDetails.course.category}</Badge>
                                                <Badge variant="outline" className="border-blue-200 text-blue-600 bg-white">{courseDetails.course.difficulty}</Badge>
                                            </div>
                                            <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                                {courseDetails.course.title}
                                            </DialogTitle>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Instructed by <span className="font-bold text-gray-900 dark:text-white">{courseDetails.course.instructor?.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                                    <div className="space-y-8">
                                        {/* Description */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" />
                                                Executive Summary
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                {courseDetails.course.description}
                                            </p>
                                        </div>

                                        {/* Curriculum */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Layers className="w-3.5 h-3.5" />
                                                Course Curriculum ({courseDetails.curriculum?.length || 0} Modules)
                                            </h4>
                                            <div className="space-y-4">
                                                {courseDetails.curriculum?.map((lesson: any, lIdx: number) => (
                                                    <div key={lesson._id} className="bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div>
                                                                <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] flex items-center justify-center rounded-lg font-black">
                                                                        {lIdx + 1}
                                                                    </span>
                                                                    {lesson.title}
                                                                </h5>
                                                                <p className="text-xs text-gray-500 mt-0.5 ml-8">{lesson.description}</p>
                                                            </div>
                                                            <Badge variant="secondary" className="bg-white dark:bg-gray-800 text-[10px] font-bold">
                                                                {lesson.topics?.length || 0} Topics
                                                            </Badge>
                                                        </div>

                                                        <div className="ml-8 space-y-2.5">
                                                            {lesson.topics?.map((topic: any) => (
                                                                <div key={topic._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-50 dark:border-gray-700/50 group hover:border-blue-200 transition-colors">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                                                            <Video className="w-4 h-4 text-indigo-500" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                                                {topic.title}
                                                                            </p>
                                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                                                Duration: {topic.duration}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <CheckCircle2 className="w-4 h-4 text-gray-200 group-hover:text-green-500 transition-colors" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quizzes / Assessments */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileQuestion className="w-3.5 h-3.5" />
                                                Assessments & Quizzes
                                            </h4>
                                            {courseDetails.quizzes && courseDetails.quizzes.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {courseDetails.quizzes.map((quiz: any) => (
                                                        <div key={quiz._id} className="flex items-center gap-4 bg-emerald-50/30 dark:bg-emerald-900/5 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
                                                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-center">
                                                                <FileQuestion className="w-6 h-6 text-emerald-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                    {quiz.title}
                                                                    {quiz.isFinalAssessment && (
                                                                        <span className="ml-2 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Final</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500 font-medium">
                                                                    {quiz.questions?.length || 0} Questions &bull; {quiz.passingMarks}% to Pass
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                                    <p className="text-sm text-gray-400 font-medium">No active assessments registered for this course.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                                    <Button onClick={() => setDetailsDialogOpen(false)} className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all">
                                        Dismiss Overview
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
