import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    BookOpen,
    CheckCircle,
    XCircle,
    GraduationCap,
    TrendingUp,
    ClipboardList,
    Clock,
    Loader2,
    Calendar,
    ChevronRight,
    Search,
    Download,
    CreditCard,
    DollarSign,
    Hash,
    BadgeCheck,
    PlayCircle,
    Award,
    Eye
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

export function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/instructor/students/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.ok) {
                    const res = await response.json();
                    setData(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch student details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout userRole="instructor">
                <div className="h-[80vh] flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-blue-600/20 rounded-full animate-ping absolute" />
                        <Loader2 className="w-24 h-24 text-blue-600 animate-spin relative" />
                    </div>
                    <p className="mt-8 text-gray-500 font-bold font-outfit text-xl animate-pulse">
                        Retrieving student portfolio...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout userRole="instructor">
                <div className="text-center py-24">
                    <h2 className="text-2xl font-bold">Student not found</h2>
                    <Button onClick={() => navigate('/instructor/students')} className="mt-4">
                        Back to Students
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const { student, courses, payments, extraQuizzes, certificates } = data;

    // Calculate overall stats
    const totalQuizzes = courses.reduce((acc: number, c: any) => acc + c.completedQuizzes.length, 0);
    const passedQuizzes = courses.reduce((acc: number, c: any) => 
        acc + c.completedQuizzes.filter((q: any) => q.passed).length, 0);
    const avgProgress = Math.round(courses.reduce((acc: number, c: any) => acc + c.percentComplete, 0) / (courses.length || 1));

    return (
        <DashboardLayout userRole="instructor">
            <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Navigation & Header */}
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate('/instructor/students')}
                        className="rounded-full hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Students</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-blue-600">Profile Details</span>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/5">
                    {/* Background Pattern/Gradient */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-900/5 pointer-events-none" />
                    
                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src={student.avatar?.startsWith('http') ? student.avatar : `http://localhost:5000/uploads/${student.avatar || 'no-photo.jpg'}`}
                                    alt={student.name}
                                    className="w-full h-full rounded-[2.2rem] object-cover bg-white"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + student.name + '&size=256&background=0284c7&color=fff';
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white dark:border-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <BadgeCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-outfit mb-3 tracking-tight">
                                    {student.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{student.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                        <GraduationCap className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Student ID: {student.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Enrolled</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{courses.length} Courses</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Avg. Progress</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{avgProgress}%</p>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Quizzes</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{totalQuizzes}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Pass Rate</p>
                                    <p className="text-2xl font-black text-green-600 font-outfit">
                                        {totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                Send Message
                            </Button>
                            <Button variant="outline" className="h-12 px-8 rounded-2xl border-gray-200 dark:border-gray-800 font-bold flex items-center gap-3">
                                <Download className="w-5 h-5" />
                                Export Report
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="courses" className="space-y-8">
                    <TabsList className="bg-white dark:bg-gray-900 p-1.5 rounded-[2rem] border border-gray-100 dark:border-gray-800 h-16 shadow-xl shadow-gray-500/5">
                        <TabsTrigger value="courses" className="rounded-[1.6rem] px-8 h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 font-bold transition-all">
                            Course Progress
                        </TabsTrigger>
                        <TabsTrigger value="assessments" className="rounded-[1.6rem] px-8 h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 font-bold transition-all">
                            Assessments
                        </TabsTrigger>
                        <TabsTrigger value="quizzes" className="rounded-[1.6rem] px-8 h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 font-bold transition-all">
                            Quizzes
                        </TabsTrigger>
                        <TabsTrigger value="certificates" className="rounded-[1.6rem] px-8 h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 font-bold transition-all">
                            Certificates
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="rounded-[1.6rem] px-8 h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 font-bold transition-all">
                            Purchase History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {courses.map((course: any) => (
                                <div key={course.id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                                    <div className="flex flex-col lg:flex-row gap-10">
                                        {/* Course Info */}
                                        <div className="lg:w-1/3 space-y-6">
                                            <div className="aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner group/thumb">
                                                <img 
                                                    src={course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail || 'no-image.jpg'}`}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg px-3 uppercase tracking-widest text-[10px] font-black border-none">
                                                    {course.category}
                                                </Badge>
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white font-outfit mb-2 line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        Enrolled: {new Date().toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-center justify-between mb-3 text-sm font-bold">
                                                    <span className="text-gray-500 uppercase tracking-widest text-xs">Completion Progress</span>
                                                    <span className="text-blue-600 font-black text-lg">{course.percentComplete}%</span>
                                                </div>
                                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-1000 ease-out"
                                                        style={{ width: `${course.percentComplete}%` }}
                                                    />
                                                </div>
                                                <p className="mt-4 text-xs font-bold text-gray-400 text-center tracking-wide">
                                                    {course.isCompleted ? '🎊 Student has finished this course!' : '📚 Course currently in progress'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Curriculum Tracking */}
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black font-outfit text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                                    <PlayCircle className="w-5 h-5" />
                                                </div>
                                                Curriculum Tracking
                                            </h4>
                                            
                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {course.curriculum.map((lesson: any, lIdx: number) => (
                                                    <div key={lesson.id} className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-500">
                                                                {lIdx + 1}
                                                            </span>
                                                            <h5 className="font-bold text-gray-900 dark:text-white">{lesson.title}</h5>
                                                        </div>
                                                        <div className="grid gap-2 pl-11">
                                                            {lesson.topics.map((topic: any) => (
                                                                <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-50 dark:border-gray-800 group/topic">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-2 h-2 rounded-full ${topic.isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
                                                                        <span className={`text-sm font-medium ${topic.isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{topic.topicTitle || topic.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {topic.duration || '5m'}
                                                                        </span>
                                                                        {topic.isCompleted ? (
                                                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 border-none rounded-lg text-[10px] font-black tracking-widest h-6">DONE</Badge>
                                                                        ) : (
                                                                            <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-400 rounded-lg text-[10px] font-bold tracking-widest h-6">PENDING</Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="assessments" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.flatMap((c: any) => c.completedQuizzes).length === 0 ? (
                                <div className="col-span-full py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-800 text-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <ClipboardList className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit">No assessments yet</h3>
                                    <p className="text-gray-500 font-medium">This student hasn't completed any quizzes or exams.</p>
                                </div>
                            ) : (
                                courses.flatMap((c: any) => c.completedQuizzes.map((q: any) => ({ ...q, courseTitle: c.title }))).map((quiz: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 ${quiz.passed ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500'} rounded-2xl flex items-center justify-center shadow-inner`}>
                                                {quiz.passed ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-3xl font-black font-outfit ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>{quiz.score}%</p>
                                                <Badge className={`${quiz.passed ? 'bg-green-500' : 'bg-red-500'} text-white border-none rounded-lg text-[10px] font-black tracking-widest`}>
                                                    {quiz.passed ? 'PASSED' : 'FAILED'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Module / Topic</p>
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {quiz.quizTitle || 'Self Assessment'}
                                                </h4>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Course Content</p>
                                                <p className="text-sm font-medium text-gray-500 line-clamp-1">{quiz.courseTitle}</p>
                                            </div>
                                            
                                            <div className="pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(quiz.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Badge variant="outline" className="text-[10px] rounded-lg">{quiz.correctAnswers}/{quiz.totalQuestions} Hits</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="quizzes" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {extraQuizzes?.length === 0 ? (
                                <div className="col-span-full py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-800 text-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Hash className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit">No extra quizzes</h3>
                                    <p className="text-gray-500 font-medium">This student hasn't completed any extra quizzes yet.</p>
                                </div>
                            ) : (
                                extraQuizzes?.map((quiz: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 ${quiz.passed ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-500' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500'} rounded-2xl flex items-center justify-center shadow-inner`}>
                                                {quiz.passed ? <BadgeCheck className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-3xl font-black font-outfit ${quiz.passed ? 'text-indigo-600' : 'text-red-600'}`}>{quiz.score}%</p>
                                                <Badge className={`${quiz.passed ? 'bg-indigo-500' : 'bg-red-500'} text-white border-none rounded-lg text-[10px] font-black tracking-widest`}>
                                                    {quiz.passed ? 'PASSED' : 'FAILED'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Extra Quiz Title</p>
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                    {quiz.quizTitle || 'Extra Challenge'}
                                                </h4>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Rewards</p>
                                                <p className="text-sm font-black text-indigo-600 flex items-center gap-1">
                                                    +{quiz.extraXPAwarded} XP Earned
                                                </p>
                                            </div>
                                            
                                            <div className="pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(quiz.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Badge variant="outline" className="text-[10px] rounded-lg">{quiz.correctAnswers}/{quiz.totalQuestions} Hits</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="certificates" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certificates?.length === 0 ? (
                                <div className="col-span-full py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-gray-800 text-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Award className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit">No certificates yet</h3>
                                    <p className="text-gray-500 font-medium">This student hasn't completed any courses to earn certificates.</p>
                                </div>
                            ) : (
                                certificates?.map((cert: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all group">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-gray-100 dark:border-gray-800 group-hover:scale-[1.02] transition-transform duration-500">
                                             <img 
                                                src={cert.thumbnail?.startsWith('http') ? cert.thumbnail : `http://localhost:5000/uploads/${cert.thumbnail || 'no-image.jpg'}`}
                                                alt={cert.courseTitle}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full font-bold">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Certificate
                                                </Button>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-green-500 text-white border-none rounded-lg shadow-lg">VERIFIED</Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <Badge variant="secondary" className="mb-2 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-500 rounded-lg px-2 uppercase tracking-widest text-[10px] font-black border-none">
                                                    {cert.category}
                                                </Badge>
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-green-600 transition-colors">
                                                    {cert.courseTitle}
                                                </h4>
                                            </div>
                                            
                                            <div className="pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Completed: {cert.completionDate}
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl shadow-gray-500/5">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h4 className="text-lg font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    Transaction History
                                </h4>
                                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 dark:border-gray-800 font-bold">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoices
                                </Button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">Course / Product</th>
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">Transaction ID</th>
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">Method</th>
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">Status</th>
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">Amount</th>
                                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                                                    No transaction records found for this student.
                                                </td>
                                            </tr>
                                        ) : (
                                            payments.map((payment: any) => (
                                                <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{payment.courseTitle || 'Course Enrollment'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                                            {payment.transactionId}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 font-bold text-sm text-gray-500">
                                                            <CreditCard className="w-4 h-4" />
                                                            {payment.paymentMethod === 'card' ? 'Visa/MasterCard' : 'UPI Transfer'}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <Badge className={`${payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} border-none rounded-lg text-[10px] font-black tracking-widest`}>
                                                            {payment.status.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="font-black text-gray-900 dark:text-white font-outfit text-lg">${payment.amount}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                                                            {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
