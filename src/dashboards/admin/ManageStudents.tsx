import { useEffect, useState } from 'react';
import { Search, MoreVertical, Ban, CheckCircle, Loader2, Users, GraduationCap, Trophy, TrendingUp, Clock, BookOpen, CheckCircle2, History } from 'lucide-react';
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

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'instructor';
    isActive: boolean;
    createdAt: string;
}

export function ManageStudents() {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [studentProgress, setStudentProgress] = useState<any>(null);
    const [progressLoading, setProgressLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Filter only students
                setUsersList(data.filter((u: User) => u.role === 'student'));
            } else {
                toast.error(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            toast.error('An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = usersList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleStatus = (userId: string, currentStatus: boolean) => {
        setSelectedUserId(userId);
        setPendingStatus(!currentStatus);
        setStatusDialogOpen(true);
    };

    const fetchStudentProgress = async (studentId: string) => {
        setProgressLoading(true);
        setProgressDialogOpen(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${studentId}/progress`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStudentProgress(data);
            } else {
                toast.error(data.message || 'Failed to fetch student progress');
                setProgressDialogOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred');
            setProgressDialogOpen(false);
        } finally {
            setProgressLoading(false);
        }
    };

    const confirmToggleStatus = async () => {
        if (!selectedUserId) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUserId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setUsersList(usersList.map(u => u._id === selectedUserId ? { ...u, isActive: !u.isActive } : u));
            } else {
                toast.error(data.message || 'Action failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setStatusDialogOpen(false);
            setSelectedUserId(null);
            setPendingStatus(null);
        }
    };

    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return <Badge className="bg-green-100 text-green-700">Active</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-700">Blocked</Badge>;
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-600" />
                            Manage Students
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View and manage all registered students on the platform
                        </p>
                    </div>
                    <Badge variant="outline" className="w-fit h-fit px-4 py-1.5 rounded-full border-blue-200 text-blue-600 bg-blue-50">
                        {filteredUsers.length} Students Total
                    </Badge>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search students by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Fetching student records...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
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
                                                            onClick={() => fetchStudentProgress(user._id)}
                                                        >
                                                            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                                                            <span className="text-sm font-medium">View Progress</span>
                                                        </DropdownMenuItem>
                                                        {user.isActive ? (
                                                            <DropdownMenuItem
                                                                className="rounded-xl px-3 py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            >
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                <span className="text-sm font-bold">Restrict Access</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="rounded-xl px-3 py-2 cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
                                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                <span className="text-sm font-bold">Restore Access</span>
                                                            </DropdownMenuItem>
                                                        )}
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
                                    <Users className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No students found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-1">We couldn't find any students matching your current search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Toggle Confirmation Dialog */}
                <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                    <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{pendingStatus ? 'Restore Student Access' : 'Restrict Student Access'}</DialogTitle>
                            <DialogDescription className="text-gray-500 pt-2">
                                Are you sure you want to {pendingStatus ? 'unblock' : 'block'} this student?
                                {pendingStatus
                                    ? ' They will immediately regain access to their enrolled courses and certificates.'
                                    : ' They will lose access to all course materials and the student dashboard until unblocked.'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3 pt-6">
                            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="rounded-xl h-11 px-6 border-gray-200">
                                Cancel
                            </Button>
                            <Button
                                variant={pendingStatus ? 'default' : 'destructive'}
                                onClick={confirmToggleStatus}
                                className={`rounded-xl h-11 px-8 font-bold ${pendingStatus ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                            >
                                {pendingStatus ? 'Restore Access' : 'Restrict User'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Student Progress Dialog */}
                <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
                        {progressLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Analyzing learning metrics...</p>
                            </div>
                        ) : studentProgress ? (
                            <>
                                <DialogHeader className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">
                                            {studentProgress.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-2xl font-black">{studentProgress.student.name}'s Academic Report</DialogTitle>
                                            <DialogDescription className="text-blue-100 font-medium">
                                                Enrolled in {studentProgress.progress?.length || 0} Professional Courses
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                    <div className="space-y-8">
                                        {studentProgress.progress && studentProgress.progress.length > 0 ? (
                                            studentProgress.progress.map((course: any) => (
                                                <div key={course.courseId} className="space-y-4">
                                                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                                        <div>
                                                            <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                                {course.courseTitle}
                                                            </h4>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                                                Instructor: {course.instructorName}
                                                            </p>
                                                        </div>
                                                        <Badge className={`${course.isCompleted ? 'bg-green-500' : 'bg-blue-500'} font-bold`}>
                                                            {course.percentComplete}% Complete
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Progress Meter */}
                                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3" />
                                                                Curriculum Coverage
                                                            </p>
                                                            <div className="w-full h-3 bg-white dark:bg-gray-900 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                                                                <div 
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" 
                                                                    style={{ width: `${course.percentComplete}%` }}
                                                                ></div>
                                                            </div>
                                                            {course.isCompleted && course.completionDate && (
                                                                <p className="text-[10px] text-green-600 font-black mt-2 flex items-center gap-1">
                                                                    <Trophy className="w-3 h-3" />
                                                                    CERTIFICATE EARNED ON {new Date(course.completionDate).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Quiz Stats */}
                                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                                                <History className="w-3 h-3" />
                                                                Assessment History
                                                            </p>
                                                            <div className="space-y-2">
                                                                {course.quizzes && course.quizzes.length > 0 ? (
                                                                    course.quizzes.map((quiz: any) => (
                                                                        <div key={quiz.quizId} className="flex items-center justify-between text-xs">
                                                                            <span className="font-bold text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                                                                                {quiz.quizTitle}
                                                                            </span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`font-black ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                                                    {quiz.score}%
                                                                                </span>
                                                                                {quiz.passed ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3 text-red-400" />}
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-[10px] text-gray-400 font-bold italic py-1">No assessments completed yet.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                                <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-500 font-bold italic">Student has not started any learning modules yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                    <Button onClick={() => setProgressDialogOpen(false)} className="h-12 px-10 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold transition-all">
                                        Close Intelligence Report
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
