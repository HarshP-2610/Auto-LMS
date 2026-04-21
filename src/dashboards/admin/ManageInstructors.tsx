import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Ban, CheckCircle, UserCheck, Loader2, UserRoundCheck, Star, BookOpen, Trash2, Mail, Phone, Calendar, Wallet, Award, Fingerprint, Eye, TrendingUp, Users, DollarSign, Award as AwardIcon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    avatar?: string;
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

    const handleInspectPortfolio = (userId: string) => {
        navigate(`/admin/instructors/${userId}/portfolio`);
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
            return (
                <Badge className="bg-purple-500/10 text-purple-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    Verified Faculty
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-rose-500/10 text-rose-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Access Suspended
                </Badge>
            );
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, delay, trend }: any) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex items-center gap-6 group hover:border-purple-500/30 transition-all duration-500"
        >
            <div className={`p-5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
                    {trend && <span className="text-[10px] font-black text-emerald-500">{trend}</span>}
                </div>
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout userRole="admin">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Elite Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
                >
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-600 rounded-3xl shadow-2xl shadow-purple-500/30">
                                <UserRoundCheck className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    Educator Suite
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-1">
                                    Faculty Governance & Academic Performance
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none">
                        <div className="px-6 py-2 text-right border-r border-gray-100 dark:border-gray-800">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Faculty Health</p>
                            <p className="text-xl font-black text-emerald-500">OPTIMAL</p>
                        </div>
                        <div className="px-6 py-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Revenue Share</p>
                            <p className="text-xl font-black text-purple-600">70/30</p>
                        </div>
                    </div>
                </motion.div>

                {/* Faculty Pulse Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard 
                        icon={Users} 
                        label="Active Faculty" 
                        value={usersList.filter(u => u.isActive).length} 
                        color="bg-purple-600"
                        delay={0.1}
                        trend="Live"
                    />
                    <StatCard 
                        icon={DollarSign} 
                        label="Faculty Payouts" 
                        value={`$${(usersList.reduce((acc, u) => acc + (u.earnings || 0), 0) / 1000).toFixed(1)}K`} 
                        color="bg-emerald-600"
                        delay={0.2}
                        trend="+8.4%"
                    />
                    <StatCard 
                        icon={Star} 
                        label="Avg Satisfaction" 
                        value="4.9" 
                        color="bg-amber-500"
                        delay={0.3}
                        trend="Elite"
                    />
                    <StatCard 
                        icon={ShieldCheck} 
                        label="Vetting Rate" 
                        value="92%" 
                        color="bg-blue-600"
                        delay={0.4}
                    />
                </div>

                {/* Strategic Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-8"
                >
                    <div className="relative flex-1 max-w-3xl group">
                        <div className="absolute inset-0 bg-purple-600/5 blur-2xl group-focus-within:bg-purple-600/10 transition-all duration-500 rounded-[2rem]"></div>
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Identify educator by name, specialization or UID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-16 h-20 rounded-[2.5rem] border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl focus:ring-purple-500 text-xl font-bold shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                        />
                    </div>
                    <Button variant="outline" className="h-20 px-10 rounded-[2rem] border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all shadow-xl">
                        Tax Ledger
                    </Button>
                </motion.div>

                {/* Educator Master Ledger */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-900 rounded-[4rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] dark:shadow-none"
                >
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-48">
                                <div className="relative w-24 h-24 mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin"></div>
                                    <div className="absolute inset-4 rounded-full border-4 border-purple-50 border-b-purple-400 animate-spin-reverse"></div>
                                </div>
                                <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs">Decrypting Faculty Records...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                                    <tr>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Educator Profile
                                        </th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Performance Index
                                        </th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Matriculation
                                        </th>
                                        <th className="px-10 py-10 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Ops Directives
                                        </th>
                                    </tr>
                                </thead>
                                <motion.tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    <AnimatePresence mode="popLayout">
                                        {filteredUsers.map((user, idx) => (
                                            <motion.tr 
                                                key={user._id} 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * (idx % 15) }}
                                                className="hover:bg-purple-50/30 dark:hover:bg-purple-900/5 transition-all duration-300 group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative">
                                                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                                                            <img 
                                                                src={user.avatar && user.avatar !== 'no-photo.jpg' 
                                                                    ? `http://localhost:5000/uploads/${user.avatar}` 
                                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=256`} 
                                                                alt={user.name}
                                                                className="relative w-20 h-20 rounded-[1.8rem] object-cover ring-4 ring-white dark:ring-gray-800 shadow-2xl transition-all duration-500 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff`;
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors tracking-tight">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-purple-600 font-black uppercase tracking-widest text-[10px]">
                                                                {user.instructorTitle || 'Executive Educator'}
                                                            </p>
                                                            <div className="flex items-center gap-2 pt-1">
                                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                                <p className="text-xs text-gray-400 font-bold tracking-tight">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5 text-sm font-black text-gray-900 dark:text-white">
                                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                                {user.rating?.toFixed(1) || '5.0'}
                                                            </div>
                                                            <div className="h-4 w-px bg-gray-200"></div>
                                                            <div className="flex items-center gap-1.5 text-sm font-black text-gray-500 uppercase tracking-tighter">
                                                                <BookOpen className="w-5 h-5 text-purple-500" />
                                                                {user.taughtCourses?.length || 0}
                                                            </div>
                                                        </div>
                                                        <div className="w-40 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.min(100, (user.rating || 5) * 20)}%` }}
                                                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                                                            ></motion.div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center sm:text-left">
                                                    {getStatusBadge(user.isActive)}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-all duration-300">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100 shadow-sm"
                                                            onClick={() => handleInspectPortfolio(user._id)}
                                                            title="Inspect Identity"
                                                        >
                                                            <Fingerprint className="w-7 h-7" />
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                                            onClick={() => navigate(`/admin/instructors/${user._id}/courses`)}
                                                            title="View Portfolio"
                                                        >
                                                            <Eye className="w-7 h-7" />
                                                        </Button>
                                
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className={`h-14 w-14 p-0 rounded-2xl transition-all border border-transparent shadow-sm ${
                                                                user.isActive 
                                                                    ? 'hover:bg-amber-50 text-gray-400 hover:text-amber-600 hover:border-amber-100' 
                                                                    : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 hover:border-emerald-100'
                                                            }`}
                                                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            title={user.isActive ? "Suspend Protocol" : "Authorize Access"}
                                                        >
                                                            {user.isActive ? <Ban className="w-7 h-7" /> : <CheckCircle className="w-7 h-7" />}
                                                        </Button>
                                
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 shadow-sm"
                                                            onClick={() => handleDeleteInstructor(user._id)}
                                                            title="Execute Termination"
                                                        >
                                                            <Trash2 className="w-7 h-7" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </motion.tbody>
                            </table>
                        ) : (
                            <div className="text-center py-48 bg-gray-50/5">
                                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                    <UserRoundCheck className="w-16 h-16 text-gray-200" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">Instructor Ledger Empty</h3>
                                <p className="text-gray-500 font-bold max-w-sm mx-auto mt-4 px-6 leading-relaxed italic">No faculty entities found matching your current query "{searchQuery}". Initialize a new search or verify staff records.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Strategic Intervention Modals */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="rounded-[4rem] border-none shadow-2xl p-12 max-w-xl">
                    <DialogHeader>
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${pendingStatus ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/20' : 'bg-amber-100 text-amber-600 shadow-amber-500/20'}`}>
                            {pendingStatus ? <CheckCircle className="w-10 h-10" /> : <Ban className="w-10 h-10" />}
                        </div>
                        <DialogTitle className="text-4xl font-black tracking-tighter">{pendingStatus ? 'Authorize Faculty' : 'Suspend Protocols'}</DialogTitle>
                        <DialogDescription className="text-gray-500 pt-6 text-lg font-medium leading-relaxed italic">
                            {pendingStatus
                                ? "Reinstate full systemic privileges for this educator? All published curriculum and instructional environments will be Reactivated immediately."
                                : "Warning: Suspension will hide this educator's storefront and curriculum from the global marketplace. Instructor dashboard access will be Terminated."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-6 pt-12">
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="flex-1 h-20 rounded-[2rem] border-4 border-gray-100 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50">
                            Abort Directive
                        </Button>
                        <Button
                            variant={pendingStatus ? 'default' : 'destructive'}
                            onClick={confirmToggleStatus}
                            className={`flex-1 h-20 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl ${pendingStatus ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : 'shadow-rose-500/30'}`}
                        >
                            {pendingStatus ? 'Confirm Authorization' : 'Execute Suspension'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="rounded-[4rem] border-none shadow-2xl p-12 max-w-xl">
                    <DialogHeader>
                        <div className="w-20 h-20 rounded-[2rem] bg-rose-100 text-rose-600 flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/20">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <DialogTitle className="text-4xl font-black tracking-tighter text-rose-600">Terminate Entity</DialogTitle>
                        <DialogDescription className="text-gray-500 pt-6 text-lg font-medium leading-relaxed italic">
                            Are you absolutely certain? This directive initiates irreversible data erasure for this faculty account. 
                            <span className="block mt-4 font-black text-rose-600 uppercase text-[10px] tracking-widest opacity-80">ALL REVENUE HISTORY AND CURRICULUM DATA WILL BE LOST.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-6 pt-12">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1 h-20 rounded-[2rem] border-4 border-gray-100 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50">
                            Cancel Erasure
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="flex-1 h-20 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] bg-rose-600 hover:bg-rose-700 shadow-2xl shadow-rose-500/30 border-none transition-all"
                        >
                            Execute Termination
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
