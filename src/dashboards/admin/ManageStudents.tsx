import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Users, CheckCircle2, History, TrendingUp, BookOpen, GraduationCap, Trophy, Lock, Unlock, Trash2, Eye } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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
    const navigate = useNavigate();
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

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


    const confirmDeleteStudent = async () => {
        if (!studentToDelete) return;
        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${studentToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            if (response.ok) {
                toast.success('Student deleted successfully');
                setUsersList(usersList.filter(u => u._id !== studentToDelete));
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete student');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setStudentToDelete(null);
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
        <>
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                                                            onClick={() => navigate(`/admin/students/${user._id}`)}
                                                            title="View Full Details"
                                                        >
                                                            <Eye className="w-4.5 h-4.5" />
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className={`h-9 w-9 p-0 rounded-xl transition-colors ${
                                                                user.isActive 
                                                                    ? 'hover:bg-amber-50 text-amber-600 hover:text-amber-700' 
                                                                    : 'hover:bg-green-50 text-green-600 hover:text-green-700'
                                                            }`}
                                                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            title={user.isActive ? "Block Student" : "Unblock Student"}
                                                        >
                                                            {user.isActive ? <Lock className="w-4.5 h-4.5" /> : <Unlock className="w-4.5 h-4.5" />}
                                                        </Button>

                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                                                            onClick={() => {
                                                                setStudentToDelete(user._id);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            title="Delete Student"
                                                        >
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </Button>
                                                    </div>
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
                </div>
            </DashboardLayout>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 pt-2 text-base">
                            This action cannot be undone. This will permanently delete the student account 
                            and remove their data from our servers, including course enrollments and certificates.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-6">
                        <AlertDialogCancel className="rounded-xl h-11 px-6 border-gray-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDeleteStudent}
                            disabled={deleting}
                            className="rounded-xl h-11 px-8 font-bold bg-red-600 hover:bg-red-700 text-white border-none transition-all"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete Permanently'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
