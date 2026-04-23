import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Users, CheckCircle2, History, TrendingUp, BookOpen, GraduationCap, Trophy, Lock, Unlock, Trash2, Eye, Calendar, ArrowUpRight } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';


interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'instructor';
    isActive: boolean;
    avatar?: string;
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
            return (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Scholar
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-rose-500/10 text-rose-600 border-none px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Restricted
                </Badge>
            );
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex items-center gap-5 group hover:border-blue-500/30 transition-all duration-500"
        >
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            </div>
        </motion.div>
    );

    return (
        <>
            <DashboardLayout userRole="admin">
                <div className="max-w-7xl mx-auto space-y-10 pb-12">
                    {/* Premium Header */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                                        Manage Students
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        Global Student Repository & Academic Oversight
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-2 rounded-2xl shadow-lg">
                            <div className="px-4 py-2 text-right border-r border-gray-100 dark:border-gray-800">
                                <p className="text-[9px] font-black text-gray-400 uppercase">Growth</p>
                                <p className="text-sm font-black text-emerald-500">+12%</p>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase">Capacity</p>
                                <p className="text-sm font-black text-blue-600">89% Used</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Analytics Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            icon={GraduationCap} 
                            label="Active Scholars" 
                            value={usersList.filter(u => u.isActive).length} 
                            color="bg-blue-600"
                            delay={0.1}
                        />
                        <StatCard 
                            icon={TrendingUp} 
                            label="New This Month" 
                            value={Math.floor(usersList.length * 0.15)} 
                            color="bg-emerald-600"
                            delay={0.2}
                        />
                        <StatCard 
                            icon={Trophy} 
                            label="Avg Progress" 
                            value="76%" 
                            color="bg-amber-500"
                            delay={0.3}
                        />
                        <StatCard 
                            icon={History} 
                            label="Dormant" 
                            value={usersList.filter(u => !u.isActive).length} 
                            color="bg-rose-600"
                            delay={0.4}
                        />
                    </div>

                    {/* Operational Filters */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="relative flex-1 max-w-2xl group">
                            <div className="absolute inset-0 bg-blue-600/5 blur-xl group-focus-within:bg-blue-600/10 transition-all duration-500 rounded-[2rem]"></div>
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, email or enrollment ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 h-16 rounded-[2rem] border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl focus:ring-blue-500 text-lg font-medium shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-14 px-8 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all">
                                Export Ledger
                            </Button>
                        </div>
                    </motion.div>

                    {/* Master Student Ledger */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl shadow-gray-200/20 dark:shadow-none"
                    >
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-40">
                                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
                                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Syncing Academic Network...</p>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <tr>
                                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                Academic Identity
                                            </th>
                                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                Operational Status
                                            </th>
                                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                Matriculation Date
                                            </th>
                                            <th className="px-8 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                Directives
                                            </th>
                                        </tr>
                                    </thead>
                                    <motion.tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        <AnimatePresence mode="popLayout">
                                            {filteredUsers.map((user, idx) => (
                                                <motion.tr 
                                                    key={user._id} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * (idx % 10) }}
                                                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors group"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="relative">
                                                                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                                                                <img 
                                                                    src={user.avatar && user.avatar !== 'no-photo.jpg' 
                                                                        ? `http://localhost:5000/uploads/${user.avatar}` 
                                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128`} 
                                                                    alt={user.name}
                                                                    className="relative w-16 h-16 rounded-[1.5rem] object-cover ring-2 ring-white dark:ring-gray-800 shadow-xl transition-transform duration-500 group-hover:scale-105"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`;
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 font-bold mt-0.5">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {getStatusBadge(user.isActive)}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-black text-xs">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }).toUpperCase()}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-12 w-12 p-0 rounded-2xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                                                onClick={() => navigate(`/admin/students/${user._id}`)}
                                                            >
                                                                <Eye className="w-6 h-6" />
                                                            </Button>
                                                            
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className={`h-12 w-12 p-0 rounded-2xl transition-all border border-transparent ${
                                                                    user.isActive 
                                                                        ? 'hover:bg-amber-50 text-gray-400 hover:text-amber-600 hover:border-amber-100' 
                                                                        : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 hover:border-emerald-100'
                                                                }`}
                                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            >
                                                                {user.isActive ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                                                            </Button>
                                    
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-12 w-12 p-0 rounded-2xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                                                                onClick={() => {
                                                                    setStudentToDelete(user._id);
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </motion.tbody>
                                </table>
                            ) : (
                                <div className="text-center py-40">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <Users className="w-12 h-12 text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Scholar Record Not Found</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto mt-2">The academic registry contains no intelligence matching "{searchQuery}". Cross-reference your search and initiate again.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>

            {/* Premium Dialogs */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-10 max-w-md">
                    <DialogHeader>
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${pendingStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {pendingStatus ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight">{pendingStatus ? 'Reinstate Scholar' : 'Restrict Access'}</DialogTitle>
                        <DialogDescription className="text-gray-500 pt-4 text-base font-medium leading-relaxed italic">
                            {pendingStatus
                                ? "Restore full systemic privileges to this academic entity? All enrolled curriculum and credentials will be Reactivated immediately."
                                : "Warning: Restricting this entity will terminate their access to the learning environment. They will be prohibited from curriculum consumption."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-4 pt-10">
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="flex-1 h-16 rounded-2xl border-2 border-gray-100 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50">
                            Abort Directive
                        </Button>
                        <Button
                            variant={pendingStatus ? 'default' : 'destructive'}
                            onClick={confirmToggleStatus}
                            className={`flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl ${pendingStatus ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25' : 'shadow-rose-500/25'}`}
                        >
                            {pendingStatus ? 'Authorize Reinstatement' : 'Confirm Restriction'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-[3rem] border-none shadow-2xl p-10 max-w-md">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 shadow-xl">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <AlertDialogTitle className="text-3xl font-black tracking-tight text-rose-600">Delete Scholar</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 pt-4 text-base font-medium leading-relaxed italic">
                            Are you absolutely certain? This directive will initiate permanent data destruction for this academic account.
                             <span className="block mt-2 font-black text-rose-600/60 uppercase text-[10px] tracking-widest">Enrollments, progress, and certificates will be lost.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-4 pt-10">
                        <AlertDialogCancel className="flex-1 h-16 rounded-2xl border-2 border-gray-100 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDeleteStudent}
                            disabled={deleting}
                            className="flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-rose-600 hover:bg-rose-700 text-white border-none shadow-xl shadow-rose-500/30 transition-all"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Purging...
                                </>
                            ) : 'Execute Erasure'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
