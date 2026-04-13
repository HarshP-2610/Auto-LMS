import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Play,
    FileText,
    CheckCircle,
    ChevronLeft,
    HelpCircle,
    Layout,
    Trophy,
    Award,
    Maximize2,
    MessageSquare,
    BookOpen,
    Clock,
    ChevronRight,
    ChevronDown,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { cn } from '@/lib/utils';

export function CourseLearning() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [activeTopic, setActiveTopic] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [finalAssessment, setFinalAssessment] = useState<any>(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const courseRes = await fetch(`http://localhost:5000/api/courses/${id}`);
                const courseData = await courseRes.json();
                const lessonsRes = await fetch(`http://localhost:5000/api/lessons/course/${id}`);
                const lessonsData = await lessonsRes.json();
                const progressRes = await fetch(`http://localhost:5000/api/progress/course/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const progressData = await progressRes.json();
                const profileRes = await fetch('http://localhost:5000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const profileData = await profileRes.json();
                if (profileRes.ok) setUserProfile(profileData);

                if (courseRes.ok && lessonsRes.ok) {
                    setCourse(courseData.data);
                    const allLessons = lessonsData.data;
                    const lessonsWithContent = await Promise.all(allLessons.map(async (lesson: any) => {
                        const topicRes = await fetch(`http://localhost:5000/api/topics/lesson/${lesson._id}`);
                        const topicData = await topicRes.json();
                        const quizRes = await fetch(`http://localhost:5000/api/quizzes?lessonId=${lesson._id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const quizData = await quizRes.json();
                        return {
                            ...lesson,
                            topics: topicData.data || [],
                            quizzes: Array.isArray(quizData) ? quizData : []
                        };
                    }));

                    setLessons(lessonsWithContent);
                    if (progressRes.ok) setProgress(progressData.data);

                    const finalRes = await fetch(`http://localhost:5000/api/final-assessments?courseId=${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const finalData = await finalRes.json();
                    if (finalRes.ok && finalData) setFinalAssessment(finalData);

                    let defaultTopic = null;
                    let activeLessonId = '';
                    if (progressData.data?.lastTopic) {
                        for (const l of lessonsWithContent) {
                            const found = l.topics.find((t: any) => t._id === progressData.data.lastTopic);
                            if (found) { 
                                defaultTopic = found; 
                                activeLessonId = l._id;
                                break; 
                            }
                        }
                    }
                    if (!defaultTopic && lessonsWithContent.length > 0 && lessonsWithContent[0].topics.length > 0) {
                        defaultTopic = lessonsWithContent[0].topics[0];
                        activeLessonId = lessonsWithContent[0]._id;
                    }
                    setActiveTopic(defaultTopic);
                    if (activeLessonId) {
                        setExpandedLessons({ [activeLessonId]: true });
                    }
                }
            } catch (error) { console.error("Failed to load course content", error); } finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    const toggleLesson = (lessonId: string) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const handleMarkComplete = async (topicId: string, autoNext = false) => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://localhost:5000/api/progress/mark-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ courseId: id, topicId })
            });
            if (res.ok) {
                const updated = await res.json();
                setProgress(updated.data);
                toast.success('Topic completed!');
                if (autoNext) goToNextTopic();
            }
        } catch (error) { console.error("Error updating progress:", error); }
    };

    const goToNextTopic = () => {
        if (!activeTopic) return;
        let foundCurrent = false;
        for (const lesson of lessons) {
            for (const topic of lesson.topics) {
                if (foundCurrent) { 
                    setActiveTopic(topic); 
                    setExpandedLessons(prev => ({ ...prev, [lesson._id]: true }));
                    return; 
                }
                if (topic._id === activeTopic._id) foundCurrent = true;
            }
        }
    };

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('watch?v=')[1].split('&')[0];
            const remain = url.includes('&') ? '?' + url.split('&').slice(1).join('&') : '';
            return `https://www.youtube.com/embed/${videoId}${remain}`;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            const remain = url.includes('?') ? '?' + url.split('?').slice(1).join('&') : '';
            return `https://www.youtube.com/embed/${videoId}${remain}`;
        }
        return url.replace('watch?v=', 'embed/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-xl font-black text-white uppercase tracking-tighter">Preparing Your Session</p>
                    <p className="text-neutral-500 text-sm font-medium">Syncing curriculum and progress...</p>
                </div>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Course not found</div>;

    const percentComplete = progress?.percentComplete || 0;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-400">
            {/* Ultra-Premium Glass Header */}
            <header className="h-16 bg-neutral-950/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 z-50 sticky top-0">
                <div className="flex items-center gap-6">
                    <Link to="/student/courses" className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-all">
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Exit</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="space-y-0.5 max-w-sm">
                        <h1 className="text-sm font-black text-white truncate leading-tight uppercase tracking-tight">{course.title}</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${percentComplete}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{percentComplete}% Complete</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full">
                        <Trophy className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Diamond Path</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white hover:bg-white/5 rounded-full">
                        <HelpCircle className="w-5 h-5" />
                    </Button>
                    <div className="lg:hidden">
                         <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-500">
                            <Layout className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Cinema Mode Content Area */}
                <main className={cn(
                    "flex-1 overflow-y-auto bg-black transition-all duration-500 ease-in-out relative",
                    !sidebarOpen && "w-full"
                )}>
                    {activeTopic ? (
                        <div className="flex flex-col">
                            {/* Video Theater Section */}
                            <div className="relative w-full bg-[#080808] group/video">
                                <div className="max-w-[1600px] mx-auto">
                                    <div className="aspect-video relative shadow-[0_0_100px_rgba(37,99,235,0.05)] overflow-hidden">
                                        {activeTopic.videoUrl ? (
                                            activeTopic.videoUrl.startsWith('http') ? (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={getYouTubeEmbedUrl(activeTopic.videoUrl)}
                                                    title={activeTopic.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <video
                                                    className="w-full h-full"
                                                    controls
                                                    autoPlay
                                                    onEnded={() => handleMarkComplete(activeTopic._id, true)}
                                                    src={`http://localhost:5000/uploads/${activeTopic.videoUrl}`}
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-gradient-to-b from-neutral-900 to-black">
                                                <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-600/20 shadow-2xl animate-pulse">
                                                    <BookOpen className="w-10 h-10 text-blue-500" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="text-xl font-black uppercase tracking-tighter">Reading Module</p>
                                                    <p className="text-neutral-500 text-sm font-medium">Please review the module content below</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dynamic Focus Overlay */}
                                        <div className="absolute top-8 left-8 z-20 pointer-events-none transition-all duration-500 group-hover/video:translate-x-2">
                                            <Badge className="bg-blue-600/90 text-white border-0 px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-xl backdrop-blur-md">
                                                Live Session
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deep Content Details */}
                            <div className="px-6 lg:px-12 py-12 max-w-7xl mx-auto w-full">
                                <div className="flex flex-col lg:flex-row gap-16">
                                    <div className="flex-1 space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <span className="h-px w-8 bg-blue-600" />
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Now Exploring</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-top justify-between gap-6">
                                                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9] uppercase max-w-2xl">
                                                    {activeTopic.title}
                                                </h2>
                                                <Button
                                                    onClick={() => handleMarkComplete(activeTopic._id, true)}
                                                    disabled={progress?.completedTopics?.includes(activeTopic._id)}
                                                    className={cn(
                                                        "rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg",
                                                        progress?.completedTopics?.includes(activeTopic._id)
                                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                            : "bg-white text-black hover:bg-blue-600 hover:text-white"
                                                    )}
                                                >
                                                    {progress?.completedTopics?.includes(activeTopic._id) ? (
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5 fill-current" />
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        "Complete Module"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <Tabs defaultValue="overview" className="w-full">
                                            <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/5 w-fit mb-10">
                                                {['overview', 'resources', 'discussion'].map((tab) => (
                                                    <TabsTrigger
                                                        key={tab}
                                                        value={tab}
                                                        className="rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                                                    >
                                                        {tab}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            <TabsContent value="overview" className="mt-0 animate-in fade-in duration-700">
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                    <div className="lg:col-span-8 space-y-8">
                                                        <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                                                            {activeTopic.content || "Experience deep-dive learning with high-impact video content. Join our industry experts as they dismantle complex concepts into actionable visual intelligence for your creative journey."}
                                                        </p>
                                                        <div className="p-8 bg-neutral-900 ring-1 ring-white/5 rounded-[2.5rem] space-y-6">
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-white/50">Core Objectives</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {[1, 2, 3, 4].map((i) => (
                                                                    <div key={i} className="flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                                                                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                                                        <span className="text-sm font-bold text-neutral-300">Phase 0{i} Execution Protocol</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                                            <h4 className="font-black text-[10px] uppercase tracking-widest text-blue-500 mb-6 font-sans flex items-center gap-2">
                                                                <Layout className="w-3.5 h-3.5" /> Module Intel
                                                            </h4>
                                                            <div className="space-y-6">
                                                                {[
                                                                    { label: 'Duration', value: activeTopic.duration || '08:22' },
                                                                    { label: 'Complexity', value: 'Advanced' },
                                                                    { label: 'Language', value: 'English (US)' },
                                                                    { label: 'Subtitle', value: 'Enabled' }
                                                                ].map((item) => (
                                                                    <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{item.label}</span>
                                                                        <span className="text-sm font-black text-white">{item.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="resources" className="py-20 text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                                    <FileText className="w-8 h-8 text-neutral-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xl font-black uppercase tracking-tight">Resource Vault Locked</p>
                                                    <p className="text-neutral-500 text-sm font-medium">Complete this module to unlock premium assessment assets</p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center animate-bounce">
                                <Layout className="w-10 h-10 text-neutral-700" />
                            </div>
                            <p className="text-neutral-500 font-black uppercase tracking-widest text-sm italic">Initialize learning path from sidebar</p>
                        </div>
                    )}
                </main>

                {/* Vertical Control Center (Sidebar) */}
                <aside
                    className={cn(
                        "bg-[#0a0a0a] border-l border-white/5 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-40 fixed lg:relative right-0 h-full",
                        sidebarOpen ? 'w-full md:w-[420px]' : 'w-0'
                    )}
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between min-w-[320px]">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Curriculum Flow</h2>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-neutral-600 h-8 w-8 p-0 hover:bg-white/5 rounded-full lg:hidden">
                            <Layout className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 min-w-[320px]">
                        <div className="p-4 space-y-4">
                            {lessons.map((lesson, lessonIdx) => {
                                const isExpanded = expandedLessons[lesson._id];
                                return (
                                    <div key={lesson._id} className="space-y-2">
                                        <button 
                                            onClick={() => toggleLesson(lesson._id)}
                                            className="w-full flex items-center justify-between px-3 py-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group"
                                        >
                                            <div className="flex flex-col text-left">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-1">Section 0{lessonIdx + 1}</span>
                                                <h3 className="text-sm font-black text-white uppercase tracking-tight">{lesson.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] py-0.5 border-white/10 text-neutral-500 font-black uppercase tracking-[0.1em] rounded-md leading-none h-5">
                                                    {lesson.topics?.length || 0} Modules
                                                </Badge>
                                                {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" /> : <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="space-y-2 mt-2 animate-in slide-in-from-top-2 duration-300">
                                                {lesson.topics?.map((topic: any) => {
                                                    const isActive = activeTopic?._id === topic._id;
                                                    const isCompleted = progress?.completedTopics?.includes(topic._id);

                                                    return (
                                                        <button
                                                            key={topic._id}
                                                            onClick={() => {
                                                                setActiveTopic(topic);
                                                                if (window.innerWidth < 1024) setSidebarOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full group/item relative flex flex-col p-4 rounded-2xl transition-all duration-500 border overflow-hidden",
                                                                isActive
                                                                    ? "bg-blue-600 border-blue-500 shadow-[0_15px_30px_rgba(37,99,235,0.2)] scale-[1.02] z-10"
                                                                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                                                            )}
                                                        >
                                                            {isActive && (
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                            )}
                                                            <div className="flex items-start gap-4">
                                                                <div className={cn(
                                                                    "mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                                                                    isActive
                                                                        ? "bg-white border-white text-blue-600 rotate-6 shadow-xl"
                                                                        : cn(
                                                                            "border-white/5 bg-black/40 text-neutral-600 group-hover/item:border-white/20",
                                                                            isCompleted && "border-emerald-500/20 text-emerald-500"
                                                                        )
                                                                )}>
                                                                    {topic.videoUrl ? <Play className="w-4 h-4 fill-current" /> : <FileText className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1 space-y-1.5 overflow-hidden">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <p className={cn(
                                                                            "text-sm font-black leading-tight uppercase tracking-tight",
                                                                            isActive ? "text-white" : "text-neutral-300"
                                                                        )}>
                                                                            {topic.title}
                                                                        </p>
                                                                        {isCompleted && (
                                                                            <div className={cn(
                                                                                "w-5 h-5 rounded-full flex items-center justify-center",
                                                                                isActive ? "bg-white text-blue-600" : "bg-emerald-500/20 text-emerald-500"
                                                                            )}>
                                                                                <CheckCircle className="w-3.5 h-3.5 fill-current" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className={cn("w-3 h-3", isActive ? "text-blue-200" : "text-neutral-600")} />
                                                                        <span className={cn(
                                                                            "text-[10px] font-black uppercase tracking-widest",
                                                                            isActive ? "text-blue-100" : "text-neutral-600"
                                                                        )}>
                                                                            {topic.duration || '08:22'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                {lesson.quizzes?.map((quiz: any) => (
                                                    <Link
                                                        key={quiz._id}
                                                        to={`/student/quiz/${quiz._id}`}
                                                        className="block group/quiz relative p-4 rounded-2xl bg-purple-600/10 border border-purple-600/20 hover:bg-purple-600/20 transition-all duration-300"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-0.5 w-10 h-10 rounded-2xl bg-purple-600 border border-purple-400/50 flex items-center justify-center text-white shadow-[0_5px_15px_rgba(147,51,234,0.3)]">
                                                                <Trophy className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                     <p className="text-xs font-black text-purple-400 uppercase tracking-widest leading-none">Assessment</p>
                                                                     <ChevronRight className="w-4 h-4 text-purple-600 group-hover/quiz:translate-x-1 transition-transform" />
                                                                </div>
                                                                <p className="text-sm font-black text-white uppercase tracking-tight">{quiz.title}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Final Mastery Step */}
                            {finalAssessment && (
                                <div className="mt-12 space-y-4 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-2 px-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Ultimate Goal</span>
                                    </div>
                                    <Link
                                        to={percentComplete >= 100 ? `/student/quiz/${finalAssessment._id}?type=final` : '#'}
                                        onClick={(e) => {
                                            if (percentComplete < 100) { e.preventDefault(); toast.error("Attain 100% path progress to unlock."); }
                                        }}
                                        className={cn(
                                            "block p-6 rounded-[2.5rem] border-2 transition-all duration-500",
                                            percentComplete >= 100
                                                ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-white/20 shadow-2xl relative overflow-hidden group/final"
                                                : "bg-[#111] border-white/5 opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {percentComplete >= 100 && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover/final:scale-150 transition-transform duration-1000" />
                                        )}
                                        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                            <div className={cn(
                                                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-white/20 shadow-xl transition-transform duration-500",
                                                percentComplete >= 100 ? "bg-white text-blue-600 rotate-12 group-hover/final:rotate-0" : "bg-neutral-800 text-neutral-600"
                                            )}>
                                                <Award className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className={cn("text-lg font-black uppercase tracking-tight", percentComplete >= 100 ? "text-white" : "text-neutral-500")}>
                                                    Final Certification
                                                </h4>
                                                <p className={cn("text-[10px] font-bold uppercase tracking-widest", percentComplete >= 100 ? "text-blue-200" : "text-neutral-700")}>
                                                    {percentComplete >= 100 ? "Path Unlocked • Ready for Exam" : `${100 - percentComplete}% Remaining`}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>

                                    {progress?.isCompleted && (
                                        <Button
                                            onClick={() => setShowCertificate(true)}
                                            className="w-full bg-white hover:bg-blue-600 text-black hover:text-white font-black uppercase text-xs tracking-widest py-8 rounded-[2rem] shadow-2xl transition-all active:scale-95 group"
                                        >
                                            <Trophy className="w-5 h-5 mr-3 transition-transform group-hover:scale-125" />
                                            Generate Certificate
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </aside>
            </div>

            {userProfile && (
                <CertificateModal
                    isOpen={showCertificate}
                    onClose={() => setShowCertificate(false)}
                    data={{
                        studentName: userProfile.name,
                        courseTitle: course?.title,
                        instructorName: course?.instructor?.name || 'Auto-LMS Academy',
                        completionDate: progress?.completionDate
                            ? new Date(progress.completionDate).toLocaleDateString()
                            : new Date().toLocaleDateString(),
                        certificateId: `ALMS-${id?.slice(-8).toUpperCase()}-${userProfile._id.slice(-4).toUpperCase()}`
                    }}
                />
            )}

            {/* Float Command Center Button */}
            {!sidebarOpen && (
                <Button
                    className="absolute right-8 bottom-8 w-16 h-16 bg-white text-black hover:bg-blue-600 hover:text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] z-50 transition-all active:scale-90 animate-in fade-in zoom-in"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Layout className="w-6 h-6" />
                </Button>
            )}
        </div>
    );
}
