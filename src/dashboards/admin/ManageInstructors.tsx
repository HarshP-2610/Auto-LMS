import { useEffect, useState } from 'react';
import { Search, MoreVertical, Ban, CheckCircle, UserCheck, Loader2, UserRoundCheck, Star, BookOpen } from 'lucide-react';
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
    instructorTitle?: string;
    rating?: number;
    taughtCourses?: string[];
}

export function ManageInstructors() {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

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
                // Filter only instructors
                setUsersList(data.filter((u: User) => u.role === 'instructor'));
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
            return <Badge className="bg-green-100 text-green-700">Active Account</Badge>;
        } else {
            return <Badge className="bg-rose-100 text-rose-700">Deactivated</Badge>;
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <UserRoundCheck className="w-8 h-8 text-purple-600" />
                            Manage Instructors
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Oversee and monitor all elite educators on your platform
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Faculty</p>
                            <p className="text-xl font-black text-purple-600">{usersList.filter(u => u.isActive).length}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Staff</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{usersList.length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search instructors by name, title or expertise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-2xl border-gray-200 focus:ring-purple-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Accessing instructor database...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                                    <tr>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Educator
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Performance
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[1rem] flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white leading-tight">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-purple-600 font-bold mt-0.5">
                                                            {user.instructorTitle || 'Academic Instructor'}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                            {user.rating?.toFixed(1) || '5.0'}
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            {user.taughtCourses?.length || 0} Courses
                                                        </div>
                                                    </div>
                                                    <div className="w-24 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">{getStatusBadge(user.isActive)}</td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl hover:bg-purple-50 text-gray-400 hover:text-purple-600">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100">
                                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer font-semibold">
                                                            <UserCheck className="w-4 h-4 mr-2 text-purple-600" />
                                                            Inspect Portfolio
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer font-semibold">
                                                            <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                                                            Manage Curriculum
                                                        </DropdownMenuItem>
                                                        <div className="my-1 border-t border-gray-50"></div>
                                                        {user.isActive ? (
                                                            <DropdownMenuItem
                                                                className="rounded-xl px-3 py-2.5 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            >
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                <span className="font-bold">Suspend Instructor</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="rounded-xl px-3 py-2.5 cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                <span className="font-bold">Reactivate Access</span>
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
                            <div className="text-center py-20 bg-gray-50/30">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50">
                                    <UserRoundCheck className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Instructor Not Found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2">Could not locate any faculty members matching "{searchQuery}". Try a different name or title.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Toggle Confirmation Dialog */}
                <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                    <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">{pendingStatus ? 'Reactivate Educator' : 'Suspend Educator'}</DialogTitle>
                            <DialogDescription className="text-gray-500 pt-4 text-base leading-relaxed">
                                {pendingStatus
                                    ? 'Are you certain you want to restore full access for this instructor? They will be able to manage their courses and communicate with students immediately.'
                                    : 'Warning: Suspending this instructor will hide their published courses from the marketplace and prevent them from accessing the faculty portal. Ongoing students will lose access to their instructor.'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-4 pt-8">
                            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="flex-1 h-12 rounded-2xl border-2 border-gray-100 font-bold hover:bg-gray-50">
                                Abort Action
                            </Button>
                            <Button
                                variant={pendingStatus ? 'default' : 'destructive'}
                                onClick={confirmToggleStatus}
                                className={`flex-1 h-12 rounded-2xl font-black shadow-lg ${pendingStatus ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25' : 'shadow-rose-500/25'}`}
                            >
                                {pendingStatus ? 'Confirm Reactivation' : 'Execute Suspension'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
