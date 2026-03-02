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
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CourseLearning() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [activeTopic, setActiveTopic] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                // Fetch Course Details
                const courseRes = await fetch(`http://localhost:5000/api/courses/${id}`);
                const courseData = await courseRes.json();

                // Fetch Lessons
                const lessonsRes = await fetch(`http://localhost:5000/api/lessons/course/${id}`);
                const lessonsData = await lessonsRes.json();

                // Fetch Progress
                const progressRes = await fetch(`http://localhost:5000/api/progress/course/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const progressData = await progressRes.json();

                if (courseRes.ok && lessonsRes.ok) {
                    setCourse(courseData.data);
                    const allLessons = lessonsData.data;

                    // Fetch topics for each lesson to build the full curriculum
                    const lessonsWithTopics = await Promise.all(allLessons.map(async (lesson: any) => {
                        const topicRes = await fetch(`http://localhost:5000/api/topics/lesson/${lesson._id}`);
                        const topicData = await topicRes.json();
                        return { ...lesson, topics: topicData.data || [] };
                    }));

                    setLessons(lessonsWithTopics);
                    if (progressRes.ok) setProgress(progressData.data);

                    // Set active topic: lastTopic from progress or first topic
                    let defaultTopic = null;
                    if (progressData.data?.lastTopic) {
                        // Find the topic object in lessonsWithTopics
                        for (const l of lessonsWithTopics) {
                            const found = l.topics.find((t: any) => t._id === progressData.data.lastTopic);
                            if (found) {
                                defaultTopic = found;
                                break;
                            }
                        }
                    }

                    if (!defaultTopic && lessonsWithTopics.length > 0 && lessonsWithTopics[0].topics.length > 0) {
                        defaultTopic = lessonsWithTopics[0].topics[0];
                    }

                    setActiveTopic(defaultTopic);
                }
            } catch (error) {
                console.error("Failed to load course content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleMarkComplete = async (topicId: string, autoNext = false) => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://localhost:5000/api/progress/mark-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: id, topicId })
            });

            if (res.ok) {
                const updated = await res.json();
                setProgress(updated.data);
                toast.success('Topic completed!');

                if (autoNext) {
                    goToNextTopic();
                }
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const goToNextTopic = () => {
        if (!activeTopic) return;

        let foundCurrent = false;
        for (const lesson of lessons) {
            for (const topic of lesson.topics) {
                if (foundCurrent) {
                    setActiveTopic(topic);
                    return;
                }
                if (topic._id === activeTopic._id) {
                    foundCurrent = true;
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-400 font-black uppercase tracking-widest animate-pulse">Initializing Virtual Classroom...</p>
            </div>
        );
    }

    if (!course) return <div>Course not found</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/student/courses" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <ChevronLeft className="w-6 h-6 text-neutral-400" />
                    </Link>
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <div>
                        <h1 className="text-sm border-0 font-bold text-white truncate max-w-md">{course.title}</h1>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Mastery Progress: {progress?.percentComplete || 0}%</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                        <Trophy className="w-3 h-3" /> Certificate Earned at 100%
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white rounded-xl">
                        <HelpCircle className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area (Video Player + Tabs) */}
                <main className="flex-1 overflow-y-auto bg-black relative">
                    {activeTopic ? (
                        <div className="flex flex-col h-full">
                            {/* Video Player Section */}
                            <div className="relative aspect-video bg-neutral-900 shadow-2xl">
                                {activeTopic.videoUrl ? (
                                    activeTopic.videoUrl.startsWith('http') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={activeTopic.videoUrl.replace('watch?v=', 'embed/')}
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
                                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                                            <Play className="w-10 h-10 text-neutral-700" />
                                        </div>
                                        <p className="text-neutral-500 font-bold italic">This module contains text-based resources</p>
                                    </div>
                                )}

                                {/* Custom Overlay (simulated) */}
                                <div className="absolute bottom-10 left-10 z-20">
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Now Playing</p>
                                    <h2 className="text-2xl font-black text-white">{activeTopic.title}</h2>
                                </div>
                            </div>

                            {/* Bottom Tabs Section */}
                            <div className="p-10 max-w-5xl">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 mb-10 overflow-x-auto no-scrollbar">
                                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white px-8 py-4 font-bold text-sm uppercase tracking-widest">
                                            Module Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white px-8 py-4 font-bold text-sm uppercase tracking-widest">
                                            Resources
                                        </TabsTrigger>
                                        <TabsTrigger value="qa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white px-8 py-4 font-bold text-sm uppercase tracking-widest">
                                            Q&A Community
                                        </TabsTrigger>
                                        <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 bg-transparent data-[state=active]:bg-transparent text-neutral-500 data-[state=active]:text-white px-8 py-4 font-bold text-sm uppercase tracking-widest">
                                            Study Notes
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="mt-0 space-y-8 animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-3xl font-black tracking-tight">{activeTopic.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    onClick={() => handleMarkComplete(activeTopic._id, true)}
                                                    disabled={progress?.completedTopics?.includes(activeTopic._id)}
                                                    className="bg-white/5 hover:bg-white/10 text-white rounded-xl h-12 px-6 border border-white/10 font-bold disabled:opacity-50"
                                                >
                                                    <CheckCircle className={`w-5 h-5 mr-3 ${progress?.completedTopics?.includes(activeTopic._id) ? 'text-green-500 fill-green-500/20' : 'text-green-400'}`} />
                                                    {progress?.completedTopics?.includes(activeTopic._id) ? 'Completed' : 'Mark as Complete'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                            <div className="lg:col-span-2 space-y-6">
                                                <p className="text-neutral-400 leading-relaxed text-lg">
                                                    {activeTopic.content || "No content description provided for this specific topic. Please check the resources tab for additional materials and downloads associated with this lesson."}
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-neutral-900 border border-white/5 p-6 rounded-[2rem]">
                                                    <h4 className="font-black text-[10px] uppercase tracking-widest text-neutral-500 mb-4 font-sans">Module Metadata</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-neutral-500">Duration</span>
                                                            <span className="text-white font-bold">{activeTopic.duration || '8m 22s'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-neutral-500">Language</span>
                                                            <span className="text-white font-bold">English (US)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-neutral-500">Subtitles</span>
                                                            <span className="text-white font-bold">Available</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="resources" className="py-20 text-center space-y-4">
                                        <FileText className="w-16 h-16 text-neutral-800 mx-auto" />
                                        <p className="text-neutral-500 font-bold tracking-tight">Access premium learning assets for this section</p>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p>Select a topic to start learning</p>
                        </div>
                    )}
                </main>

                {/* Course Curriculum Sidebar */}
                <aside
                    className={`bg-neutral-900 border-l border-white/10 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-96' : 'w-0'}`}
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between min-w-[384px]">
                        <h2 className="text-sm font-black uppercase tracking-widest font-sans">Course Curriculum</h2>
                        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-neutral-500 h-8 w-8 p-0 hover:bg-white/5 rounded-lg">
                            <Layout className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 min-w-[384px]">
                        <div className="p-2 space-y-2">
                            {lessons.map((lesson, lessonIdx) => (
                                <div key={lesson._id} className="space-y-1">
                                    <div className="px-4 py-3 bg-white/5 rounded-xl flex items-center justify-between group">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Section {lessonIdx + 1}: {lesson.title}</span>
                                        <span className="text-[10px] text-neutral-600 font-bold">{lesson.topics?.length || 0} Modules</span>
                                    </div>

                                    {lesson.topics?.map((topic: any) => (
                                        <button
                                            key={topic._id}
                                            onClick={() => setActiveTopic(topic)}
                                            className={`w-full flex flex-col p-4 rounded-xl transition-all text-left group ${activeTopic?._id === topic._id
                                                ? 'bg-blue-600 shadow-xl shadow-blue-600/20'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${activeTopic?._id === topic._id
                                                    ? 'bg-white border-white text-blue-600'
                                                    : 'border-white/10 text-neutral-500 group-hover:border-white/20'
                                                    }`}>
                                                    {topic.videoUrl ? <Play className="w-3 h-3 fill-current" /> : <FileText className="w-3 h-3" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-bold leading-snug ${activeTopic?._id === topic._id ? 'text-white' : 'text-neutral-300'}`}>
                                                        {topic.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className={`text-[10px] uppercase font-black tracking-widest ${activeTopic?._id === topic._id ? 'text-blue-100' : 'text-neutral-500'}`}>
                                                            {topic.duration || '08:22'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <CheckCircle className={`w-4 h-4 mt-1 transition-colors ${progress?.completedTopics?.includes(topic._id) ? 'text-green-500 fill-green-500/20' : (activeTopic?._id === topic._id ? 'text-blue-200' : 'text-neutral-800')}`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {!sidebarOpen && (
                    <Button
                        className="absolute right-6 bottom-6 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hover:bg-white/20 z-50 transition-all active:scale-95"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Layout className="w-6 h-6 text-white" />
                    </Button>
                )}
            </div>
        </div>
    );
}
