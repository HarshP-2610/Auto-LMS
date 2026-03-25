import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
                                                        {course.enrolledStudents?.toLocaleString() || 0} students
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
            </div>
        </DashboardLayout>
    );
}
