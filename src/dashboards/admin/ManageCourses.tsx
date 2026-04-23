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
    TrendingUp,
    Layout,
    DollarSign,
    Zap,
    Briefcase
} from 'lucide-react';
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
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live on Market
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Rejected
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                        Awaiting Audit
                    </Badge>
                );
            default:
                return <Badge variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] uppercase tracking-widest">{status}</Badge>;
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, delay, secondary }: any) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex items-center gap-6 group hover:border-blue-500/30 transition-all duration-500"
        >
            <div className={`p-5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
                    {secondary && <span className="text-[10px] font-black text-blue-500">{secondary}</span>}
                </div>
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout userRole="admin">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Cinematic Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
                >
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/30">
                                <Library className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    Knowledge Vault
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-1">
                                    Global Curriculum Oversight & Content Governance
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none">
                        <div className="px-6 py-2 text-right border-r border-gray-100 dark:border-gray-800">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Inventory Cap</p>
                            <p className="text-xl font-black text-blue-600">UNLIMITED</p>
                        </div>
                        <div className="px-6 py-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Market Status</p>
                            <p className="text-xl font-black text-emerald-500 uppercase">Fluctuating</p>
                        </div>
                    </div>
                </motion.div>

                {/* Course Analytics Suite */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard 
                        icon={Layout} 
                        label="Total Curriculum" 
                        value={coursesList.length} 
                        color="bg-blue-600"
                        delay={0.1}
                        secondary="Active"
                    />
                    <StatCard 
                        icon={Users} 
                        label="Global Enrollment" 
                        value={coursesList.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0)} 
                        color="bg-emerald-600"
                        delay={0.2}
                        secondary="+14% MoM"
                    />
                    <StatCard 
                        icon={Zap} 
                        label="Content Velocity" 
                        value="8.4" 
                        color="bg-amber-500"
                        delay={0.3}
                        secondary="High"
                    />
                    <StatCard 
                        icon={DollarSign} 
                        label="Projected ARR" 
                        value={`$${(coursesList.reduce((acc, c) => acc + (c.price * (c.enrolledStudents?.length || 0)), 0) / 1000).toFixed(1)}K`} 
                        color="bg-purple-600"
                        delay={0.4}
                        secondary="Gross"
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
                        <div className="absolute inset-0 bg-blue-600/5 blur-2xl group-focus-within:bg-blue-600/10 transition-all duration-500 rounded-[2rem]"></div>
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Identify curriculum by title, category or academic lead..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-16 h-20 rounded-[2.5rem] border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl focus:ring-blue-500 text-xl font-bold shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="h-20 px-10 rounded-[2rem] border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all shadow-xl">
                            Export Manifest
                        </Button>
                    </div>
                </motion.div>

                {/* Master Course Ledger */}
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
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                    <div className="absolute inset-4 rounded-full border-4 border-blue-50 border-b-blue-400 animate-spin-reverse"></div>
                                </div>
                                <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs font-outfit">Decrypting Content Network...</p>
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/30">
                                    <tr>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Curriculum Entity
                                        </th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Academic Lead
                                        </th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Price Value
                                        </th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Market Status
                                        </th>
                                        <th className="px-10 py-10 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                            Ops Directives
                                        </th>
                                    </tr>
                                </thead>
                                <motion.tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    <AnimatePresence mode="popLayout">
                                        {filteredCourses.map((course, idx) => (
                                            <motion.tr 
                                                key={course._id} 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * (idx % 15) }}
                                                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all duration-300 group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative shrink-0">
                                                            <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-20 transition duration-700"></div>
                                                            <div className="relative w-36 h-24 rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white dark:border-gray-800 transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:scale-[1.02]">
                                                                <img
                                                                    src={course.thumbnail === 'no-image.jpg'
                                                                        ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                                                                        : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                                                    alt={course.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
                                                                    <div className="flex items-center gap-1.5 text-white">
                                                                        <Layers className="w-3 h-3" />
                                                                        <span className="text-[8px] font-black uppercase tracking-widest">Preview Asset</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-xl text-[9px] font-black shadow-lg shadow-blue-500/40 uppercase tracking-tighter border-2 border-white dark:border-gray-900 z-20">
                                                                ${course.price}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight leading-none" title={course.title}>
                                                                {course.title}
                                                            </p>
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-none px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
                                                                    {course.category}
                                                                </Badge>
                                                                <div className="h-3 w-px bg-gray-200"></div>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                                                    {course.lessonsCount || 0} Modules
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">
                                                            {course.instructor?.name || 'Academic Enigma'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-bold tracking-tight lowercase">
                                                            {course.instructor?.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 leading-none">
                                                            ${course.price?.toFixed(2)}
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                                            USD Currency
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-3">
                                                        {getStatusBadge(course.status)}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                                                {course.enrolledStudents?.length || 0} SEATS
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                                {course.rating || '5.0'} INDEX
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 lg:opacity-40 lg:group-hover:opacity-100 transition-all duration-300">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100 shadow-sm"
                                                            onClick={() => fetchFullCourseDetails(course._id)}
                                                            title="Inspect Curriculum"
                                                        >
                                                            <Layers className="w-7 h-7" />
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                                            asChild
                                                            title="Preview Storefront"
                                                        >
                                                            <Link to={course.status === 'published' ? `/courses/${course._id}` : '#'}>
                                                                <Eye className="w-7 h-7" />
                                                            </Link>
                                                        </Button>
                                
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-14 w-14 p-0 rounded-2xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 shadow-sm"
                                                            onClick={() => handleDelete(course._id)}
                                                            title="Execute Deprecation"
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
                                    <Library className="w-16 h-16 text-gray-200" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">Repository Is Empty</h3>
                                <p className="text-gray-500 font-bold max-w-sm mx-auto mt-4 px-6 leading-relaxed italic">No curriculum assets found matching your current search parameters "{searchQuery}". Initialize a new harvest.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Premium Operational Dialogs */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="rounded-[4rem] border-none shadow-2xl p-12 max-w-xl">
                    <DialogHeader>
                        <div className="w-20 h-20 rounded-[2rem] bg-rose-100 text-rose-600 flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/20">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <DialogTitle className="text-4xl font-black tracking-tighter text-rose-600">Deprecate Asset</DialogTitle>
                        <DialogDescription className="text-gray-500 pt-6 text-lg font-medium leading-relaxed italic">
                            Are you absolutely certain? This directive initiates irreversible data erasure for this curriculum entity. 
                            <span className="block mt-4 font-black text-rose-600 uppercase text-[10px] tracking-widest opacity-80">ALL ENROLLMENTS AND LESSON DATA WILL BE LOST PERMANENTLY.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-6 pt-12">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1 h-20 rounded-[2rem] border-4 border-gray-100 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50">
                            Cancel Directive
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="flex-1 h-20 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] bg-rose-600 hover:bg-rose-700 shadow-2xl shadow-rose-500/30 border-none transition-all"
                        >
                            Execute Erasure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Advanced Course Intelligence Overlay */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[85vh] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col bg-white dark:bg-gray-950">
                    {detailsLoading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="relative w-20 h-20 mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                <div className="absolute inset-4 rounded-full border-4 border-blue-50 border-b-blue-400 animate-spin-reverse"></div>
                            </div>
                            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Curriculum Core...</p>
                        </div>
                    ) : courseDetails ? (
                        <>
                            <div className="relative shrink-0 p-8 pb-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-1 bg-blue-600/10 rounded-2xl blur group-hover:opacity-100 transition duration-500"></div>
                                        <img
                                            src={courseDetails.course.thumbnail === 'no-image.jpg'
                                                ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
                                                : (courseDetails.course.thumbnail?.startsWith('http') ? courseDetails.course.thumbnail : `http://localhost:5000/uploads/${courseDetails.course.thumbnail}`)}
                                            alt={courseDetails.course.title}
                                            className="relative w-40 h-24 object-cover rounded-xl shadow-xl border border-white/50"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-blue-600 font-black uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-md">
                                                {courseDetails.course.category}
                                            </Badge>
                                            <Badge variant="outline" className="border-blue-200 text-blue-600 bg-white/50 backdrop-blur font-black uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-md">
                                                {courseDetails.course.difficulty}
                                            </Badge>
                                        </div>
                                        <DialogTitle className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                            {courseDetails.course.title}
                                        </DialogTitle>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-black text-[9px] text-white">
                                                {courseDetails.course.instructor?.name?.charAt(0)}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                Academic Lead: <span className="text-gray-900 dark:text-gray-300">{courseDetails.course.instructor?.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10 min-h-0">
                                {/* Academic Summary */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        Executive Curriculum Summary
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 italic font-medium">
                                        "{courseDetails.course.description}"
                                    </div>
                                </div>

                                {/* Structural Curriculum */}
                                <div className="space-y-5">
                                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Layers className="w-3.5 h-3.5" />
                                        Structural Blueprint ({courseDetails.curriculum?.length || 0} Directives)
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        {courseDetails.curriculum?.map((lesson: any, lIdx: number) => (
                                            <div key={lesson._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-200 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-500/20">
                                                            {lIdx + 1}
                                                        </div>
                                                        <div>
                                                            <h5 className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                                                {lesson.title}
                                                            </h5>
                                                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">{lesson.topics?.length || 0} Knowledge Nodes</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {lesson.topics?.map((topic: any) => (
                                                        <div key={topic._id} className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/50 group transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-md">
                                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                                                                <Video className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-black text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors truncate">
                                                                    {topic.title}
                                                                </p>
                                                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none mt-0.5">
                                                                    NODE: {topic.duration}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Examination Registry */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <FileQuestion className="w-3.5 h-3.5" />
                                        Examination Registry
                                    </h4>
                                    {courseDetails.quizzes && courseDetails.quizzes.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {courseDetails.quizzes.map((quiz: any) => (
                                                <div key={quiz._id} className="flex items-center gap-4 bg-emerald-500/5 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-500/10 dark:border-emerald-800/30 group hover:border-emerald-500/30 transition-all">
                                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
                                                        <FileQuestion className="w-6 h-6 text-emerald-500" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                                            {quiz.title}
                                                            {quiz.isFinalAssessment && (
                                                                <Badge className="bg-emerald-500 text-[7px] h-3.5 px-1 font-black">MASTER</Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.1em] opacity-80">
                                                            Threshold: {quiz.passingMarks}%
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Examination Protocols Active</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                                <Button onClick={() => setDetailsDialogOpen(false)} className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all">
                                    Dissolve Interface
                                </Button>
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
