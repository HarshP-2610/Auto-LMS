import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Ban, CheckCircle, UserCheck, Loader2, UserRoundCheck, Star, BookOpen, Trash2, Mail, Phone, Calendar, Wallet, Award, Fingerprint } from 'lucide-react';
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
    instructorBio?: string;
    rating?: number;
    numReviews?: number;
    taughtCourses?: string[];
    expertise?: string[];
    phone?: string;
    earnings?: number;
}

export function ManageInstructors() {
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserIdToDelete, setSelectedUserIdToDelete] = useState<string | null>(null);
    const [inspectDialogOpen, setInspectDialogOpen] = useState(false);
    const [selectedInstructorForInspect, setSelectedInstructorForInspect] = useState<User | null>(null);

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

    const handleDeleteInstructor = (userId: string) => {
        setSelectedUserIdToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleInspectPortfolio = (user: User) => {
        setSelectedInstructorForInspect(user);
        setInspectDialogOpen(true);
    };

    const handleManageCurriculum = (userName: string) => {
        // Redirect to Manage Courses page with instructor name as query
        navigate(`/admin/courses?search=${encodeURIComponent(userName)}`);
    };

    const confirmDelete = async () => {
        if (!selectedUserIdToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUserIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Instructor deleted successfully');
                setUsersList(usersList.filter(u => u._id !== selectedUserIdToDelete));
            } else {
                toast.error(data.message || 'Failed to delete instructor');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedUserIdToDelete(null);
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
                                                        <DropdownMenuItem 
                                                            className="rounded-xl px-3 py-2.5 cursor-pointer font-semibold"
                                                            onClick={() => handleInspectPortfolio(user)}
                                                        >
                                                            <UserCheck className="w-4 h-4 mr-2 text-purple-600" />
                                                            Inspect Portfolio
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-xl px-3 py-2.5 cursor-pointer font-semibold"
                                                            onClick={() => handleManageCurriculum(user.name)}
                                                        >
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
                                                        <div className="my-1 border-t border-gray-50"></div>
                                                        <DropdownMenuItem
                                                            className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => handleDeleteInstructor(user._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            <span className="font-bold">Delete Instructor</span>
                                                        </DropdownMenuItem>
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

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-red-600">Delete Educator</DialogTitle>
                            <DialogDescription className="text-gray-500 pt-4 text-base leading-relaxed">
                                Are you certain you want to permanently delete this instructor? This action cannot be undone and will permanently remove their access and data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-4 pt-8">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1 h-12 rounded-2xl border-2 border-gray-100 font-bold hover:bg-gray-50">
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                className="flex-1 h-12 rounded-2xl font-black shadow-lg shadow-red-500/25 bg-red-600 hover:bg-red-700"
                            >
                                Confirm Deletion
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Portfolio Inspection Dialog */}
                <Dialog open={inspectDialogOpen} onOpenChange={setInspectDialogOpen}>
                    <DialogContent className="sm:max-w-[650px] w-[95vw] h-[85vh] rounded-[3rem] border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] p-0 overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
                        {selectedInstructorForInspect && (
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Atmospheric Header */}
                                <div className="p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative flex-shrink-0 overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex-shrink-0">
                                            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 shadow-inner">
                                                {selectedInstructorForInspect.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="text-white">
                                            <h2 className="text-3xl font-black drop-shadow-xl tracking-tight mb-3">
                                                {selectedInstructorForInspect.name}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 shadow-sm">
                                                    {selectedInstructorForInspect.instructorTitle || 'Elite Faculty'}
                                                </Badge>
                                                <Badge className={`bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 shadow-sm`}>
                                                    {selectedInstructorForInspect.isActive ? 'Active Status' : 'Account Suspended'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar scroll-smooth">
                                    <div className="space-y-7 pb-4">
                                        {/* Performance Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-3xl border border-amber-100 dark:border-amber-900/30 text-center group hover:scale-[1.02] transition-transform">
                                                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-500" /> Professional Rating
                                                </p>
                                                <p className="text-xl font-black text-amber-700 dark:text-amber-300">
                                                    {selectedInstructorForInspect.rating?.toFixed(1) || '5.0'}
                                                </p>
                                            </div>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 text-center group hover:scale-[1.02] transition-transform">
                                                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                                    <BookOpen className="w-3 h-3" /> Active Courses
                                                </p>
                                                <p className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                                                    {selectedInstructorForInspect.taughtCourses?.length || 0}
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/30 text-center group hover:scale-[1.02] transition-transform">
                                                <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Career Start
                                                </p>
                                                <p className="text-sm font-black text-purple-700 dark:text-purple-300 py-1">
                                                    {selectedInstructorForInspect.createdAt ? new Date(selectedInstructorForInspect.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Biography Section */}
                                        <div className="relative group">
                                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Award className="w-4 h-4 text-purple-500" />
                                                Professional Biography
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner">
                                                "{selectedInstructorForInspect.instructorBio || 'This instructor has not provided a professional biography yet.'}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Expertise */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Fingerprint className="w-4 h-4 text-indigo-500" />
                                                    Core Expertise
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedInstructorForInspect.expertise && selectedInstructorForInspect.expertise.length > 0 ? (
                                                        selectedInstructorForInspect.expertise.map((skill, index) => (
                                                            <span key={index} className="px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-black rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-purple-300 transition-colors uppercase tracking-wider">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] text-gray-400 font-bold italic">No domain expertise specified.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Financials */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Wallet className="w-4 h-4 text-emerald-500" />
                                                    Revenue Metrics
                                                </h4>
                                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-[2rem] shadow-lg shadow-emerald-500/20 text-white">
                                                    <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1 opacity-80">Accumulated Earnings</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black">${selectedInstructorForInspect.earnings?.toLocaleString() || '0'}</span>
                                                        <span className="text-[10px] font-bold text-emerald-100">USD</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Footer */}
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Corporate Email</p>
                                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{selectedInstructorForInspect.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Mobile Contact</p>
                                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{selectedInstructorForInspect.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
                                    <Button 
                                        variant="outline"
                                        className="h-12 rounded-2xl flex-1 border-2 border-gray-100 hover:bg-gray-50 font-bold uppercase tracking-widest text-[10px] transition-all"
                                        onClick={() => setInspectDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        className="h-12 rounded-2xl flex-[1.5] bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-gray-900/10 transition-all active:scale-95"
                                        onClick={() => handleManageCurriculum(selectedInstructorForInspect.name)}
                                    >
                                        Explore Curriculum
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
