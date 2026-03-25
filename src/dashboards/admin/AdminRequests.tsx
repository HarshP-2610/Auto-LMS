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
    FileText
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
                                            <Button variant="outline" className="flex-1 lg:flex-none h-12 rounded-2xl px-6 font-bold hover:bg-gray-50" onClick={() => { setSelectedCourse(course); setViewDialogOpen(true); }}>
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
                    <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl">
                        <div className="h-48 bg-gray-900 relative">
                            {selectedCourse?.thumbnail && (
                                <img src={selectedCourse.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                            )}
                            <div className="absolute inset-x-8 -bottom-10 flex items-center gap-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-gray-950 p-2 shadow-2xl">
                                    <div className="w-full h-full rounded-[1.5rem] bg-blue-100 flex items-center justify-center">
                                        <BookOpen className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="pb-1">
                                    <Badge className="bg-blue-600 text-white border-none font-bold uppercase text-[9px] mb-2 px-3">Curriculum Submission</Badge>
                                    <h2 className="text-2xl font-black text-white drop-shadow-lg">{selectedCourse?.title}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 pt-16 pb-10 space-y-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructor</p>
                                    <p className="font-bold text-gray-900">{selectedCourse?.instructor?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</p>
                                    <p className="font-bold text-gray-900">{selectedCourse?.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</p>
                                    <p className="font-bold text-blue-600">{selectedCourse?.difficulty}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>
                                    <p className="font-bold text-emerald-600">${selectedCourse?.price}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Executive Summary</p>
                                <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
                                    {selectedCourse?.description}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-gray-100 font-bold" onClick={() => setViewDialogOpen(false)}>
                                    Discard Review
                                </Button>
                                <Button className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 font-black text-lg" onClick={() => { setViewDialogOpen(false); handleCourseAction(selectedCourse, 'approve'); }}>
                                    Approve Launch <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
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
