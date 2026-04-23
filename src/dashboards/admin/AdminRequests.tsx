import { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    BookOpen,
    ClipboardList,
    UserCheck,
    Check,
    X,
    Loader2,
    ArrowRight,
    Star,
    Mail,
    Phone,
    Briefcase,
    GraduationCap,
    FileText,
    Library,
    Layers,
    Video,
    FileQuestion,
    DollarSign,
    Zap,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function AdminRequests() {
    const [courses, setCourses] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Course modal states
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [courseDetails, setCourseDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);

    // App modal states
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [appViewDialogOpen, setAppViewDialogOpen] = useState(false);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');

            // Fetch courses (pending only for main view, though we can fetch all)
            const courseRes = await fetch('http://localhost:5000/api/admin/courses-all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Fetch pending instructors
            const appRes = await fetch('http://localhost:5000/api/admin/pending-instructors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (courseRes.ok) {
                const courseData = await courseRes.json();
                setCourses(courseData);
            }

            if (appRes.ok) {
                const appData = await appRes.json();
                setApplications(appData);
            }
        } catch (error) {
            toast.error('Failed to sync requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchFullCourseDetails = async (courseId: string) => {
        setDetailsLoading(true);
        setViewDialogOpen(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}/full-details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCourseDetails(data);
            } else {
                toast.error(data.message || 'Failed to fetch course details');
                setViewDialogOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred');
            setViewDialogOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const pendingCourses = courses.filter(c => c.status === 'pending');

    const handleCourseAction = (course: any, actionType: 'approve' | 'reject') => {
        setSelectedCourse(course);
        setAction(actionType);
        setActionDialogOpen(true);
    };

    const confirmCourseAction = async () => {
        if (!selectedCourse || !action) return;
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch(`http://localhost:5000/api/admin/pending-courses/${selectedCourse._id}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success(`Course ${action}d!`);
                fetchAllData();
                setActionDialogOpen(false);
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleAppApprove = async (id: string) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:5000/api/admin/pending-instructors/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Instructor approved!');
                fetchAllData();
            }
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleAppReject = async (id: string) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:5000/api/admin/pending-instructors/${id}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.error('Application rejected');
                fetchAllData();
            }
        } catch (error) {
            toast.error('Action failed');
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 dark:border-gray-800 shadow-xl shadow-gray-200/20">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <ClipboardList className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Central Requests</h1>
                            <p className="text-gray-500 font-medium">Unified command for course and faculty approvals</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="text-[10px] font-black uppercase text-gray-400">Total Pending</p>
                            <p className="text-xl font-black text-blue-600">{pendingCourses.length + applications.length}</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="courses" className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border-none p-1.5 rounded-[1.5rem] h-auto">
                            <TabsTrigger value="courses" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg font-bold transition-all gap-2">
                                <BookOpen className="w-4 h-4" />
                                Course Content
                                <Badge className="bg-blue-100 text-blue-700 ml-2">{pendingCourses.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="instructors" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg font-bold transition-all gap-2">
                                <UserCheck className="w-4 h-4" />
                                Faculty Apps
                                <Badge className="bg-purple-100 text-purple-700 ml-2">{applications.length}</Badge>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="courses" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {loading ? (
                                <div className="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Scanning Curriculum database...</p>
                                </div>
                            ) : pendingCourses.length === 0 ? (
                                <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Curriculum Cleared</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">No new course submissions require your immediate review. Great job staying on top of quality!</p>
                                </div>
                            ) : (
                                pendingCourses.map((course) => (
                                    <div key={course._id} className="group flex flex-col lg:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/10 hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-500">
                                        <div className="w-full lg:w-48 h-32 rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                            {course.thumbnail && course.thumbnail !== 'no-image.jpg' ? (
                                                <img src={course.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-10 h-10 text-blue-600/30" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-white/90 backdrop-blur-sm text-blue-600 border-none font-bold text-[10px] uppercase px-3">Pending</Badge>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-gray-500">
                                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">
                                                        {course.instructor?.name?.charAt(0) || 'I'}
                                                    </div>
                                                    <span className="text-xs font-bold">{course.instructor?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                                    <Badge variant="secondary" className="rounded-lg text-[10px] uppercase font-black tracking-widest">{course.category}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                            <Button variant="outline" className="flex-1 lg:flex-none h-12 rounded-2xl px-6 font-bold hover:bg-gray-50" onClick={() => fetchFullCourseDetails(course._id)}>
                                                <Eye className="w-4 h-4 mr-2" /> Inspect
                                            </Button>
                                            <Button className="flex-1 lg:flex-none h-12 rounded-2xl px-8 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 font-black" onClick={() => handleCourseAction(course, 'approve')}>
                                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                            </Button>
                                            <Button variant="ghost" className="h-12 w-12 rounded-2xl p-0 hover:bg-rose-50 text-rose-500" onClick={() => handleCourseAction(course, 'reject')}>
                                                <XCircle className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="instructors" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                <p className="text-center col-span-2 py-20 text-gray-500 font-bold">Retrieving career history records...</p>
                            ) : applications.length === 0 ? (
                                <div className="col-span-2 text-center py-24 bg-purple-50/30 rounded-[3rem] border border-purple-100">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
                                        <Star className="w-10 h-10 text-purple-600 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-purple-900 uppercase">Inbox Empty</h3>
                                    <p className="text-purple-600/70 max-w-sm mx-auto mt-2 font-medium italic">All potential candidates have been processed. The elite circle is complete for now.</p>
                                </div>
                            ) : (
                                applications.map((app) => (
                                    <div key={app._id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group hover:ring-2 hover:ring-purple-500/20 transition-all duration-500">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                        <div className="flex items-start justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                                    {app.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 leading-tight">{app.name}</h3>
                                                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">{app.areaOfExpertise}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Exp.</p>
                                                <p className="text-sm font-black text-gray-900">{app.workExperience} Years</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Mission Statement</p>
                                                <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">"{app.bio}"</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button variant="outline" className="flex-1 h-11 rounded-xl border-gray-100 font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100" onClick={() => { setSelectedApp(app); setAppViewDialogOpen(true); }}>
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </Button>
                                                <Button className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 font-bold" onClick={() => handleAppApprove(app._id)}>
                                                    <Check className="w-4 h-4 mr-2" /> Enroll Faculty
                                                </Button>
                                                <Button variant="outline" className="flex-1 h-11 rounded-xl border-gray-100 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100" onClick={() => handleAppReject(app._id)}>
                                                    <X className="w-4 h-4 mr-2" /> Refuse
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Existing Course Modal Integration */}
                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
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

                                <div className="shrink-0 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                                    <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1 h-14 rounded-2xl border-2 border-gray-200 font-bold hover:bg-gray-100">
                                        Back to Inbox
                                    </Button>
                                    <Button className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/30 font-black text-lg text-white" onClick={() => { setViewDialogOpen(false); handleCourseAction(courseDetails.course, 'approve'); }}>
                                        Approve Launch <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </DialogContent>
                </Dialog>

                {/* Action Confirmation */}
                <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                    <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">
                                {action === 'approve' ? 'Confirm Approval' : 'Submit Rejection'}
                            </DialogTitle>
                            <DialogDescription className="text-base text-gray-500 pt-2 leading-relaxed">
                                {action === 'approve'
                                    ? `Are you sure you want to approve "${selectedCourse?.title}"? This will make the course immediately visible to all students on the platform.`
                                    : `Please confirm you want to reject this submission. The instructor will have to revise and resubmit their content.`}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-4 pt-8">
                            <Button variant="outline" onClick={() => setActionDialogOpen(false)} className="flex-1 h-12 rounded-2xl border-gray-200 font-bold">
                                Back to Inbox
                            </Button>
                            <Button
                                className={`flex-1 h-12 rounded-2xl text-white font-black shadow-lg ${action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'}`}
                                onClick={confirmCourseAction}
                            >
                                {action === 'approve' ? 'Seal & Publish' : 'Confirm Rejection'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Faculty App Modal Integration */}
                <Dialog open={appViewDialogOpen} onOpenChange={setAppViewDialogOpen}>
                    <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl bg-white dark:bg-gray-900 flex flex-col max-h-[90vh]">
                        <div className="h-32 bg-gradient-to-r from-purple-800 to-indigo-900 relative shrink-0">
                            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                                <div className="w-28 h-28 rounded-[2rem] bg-white dark:bg-gray-900 p-2 shadow-2xl relative z-10">
                                    <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-black text-4xl text-white shadow-inner">
                                        {selectedApp?.name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pt-16 pb-8 overflow-y-auto no-scrollbar space-y-8 flex-1">
                            <div>
                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 border-none font-bold uppercase text-[10px] mb-3 px-3 py-1">Faculty Application</Badge>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedApp?.name}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{selectedApp?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Number</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{selectedApp?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{selectedApp?.workExperience} Years</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                        <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expertise</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">{selectedApp?.areaOfExpertise}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-purple-500" /> Educational Details
                                </h3>
                                <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedApp?.educationalDetails || 'No educational details provided.'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-500" /> Mission Statement
                                </h3>
                                <div className="p-6 rounded-[2rem] bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/30 text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                    "{selectedApp?.bio}"
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 shrink-0">
                            <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/20" onClick={() => { setAppViewDialogOpen(false); handleAppReject(selectedApp?._id); }}>
                                <X className="w-5 h-5 mr-2" /> Refuse Provider
                            </Button>
                            <Button className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/30 font-black text-lg text-white" onClick={() => { setAppViewDialogOpen(false); handleAppApprove(selectedApp?._id); }}>
                                Enroll Faculty <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
