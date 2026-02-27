import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Users,
  PlayCircle,
  CheckCircle,
  Award,
  ChevronDown,
  Share2,
  Heart,
  Play,
  Clock,
  MessageSquare,
  ShieldCheck,
  Zap,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function TopicList({ lessonId }: { lessonId: string }) {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/topics/lesson/${lessonId}`);
        const data = await response.json();
        if (response.ok) {
          setTopics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [lessonId]);

  if (loading) return <div className="text-xs text-gray-400 py-3 animate-pulse">Loading modules...</div>;
  if (topics.length === 0) return (
    <div className="text-xs text-slate-500 py-4 italic text-center border border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
      Module content is being prepared by the instructor
    </div>
  );

  return (
    <div className="space-y-2 mt-2">
      {topics.map((topic, idx) => (
        <div key={topic._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/topic border border-transparent hover:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400 border border-blue-500/20">
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 truncate font-medium group-hover/topic:text-blue-400 transition-colors">
              {topic.title}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <Play className="w-2.5 h-2.5" /> Video
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <Clock className="w-2.5 h-2.5" /> {topic.duration}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover/topic:opacity-100 transition-opacity h-8 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
            Preview
          </Button>
        </div>
      ))}
    </div>
  );
}

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`);
      const data = await response.json();
      if (response.ok) {
        const courseData = data.data;
        const mappedCourse = {
          ...courseData,
          id: courseData._id,
          level: courseData.difficulty,
          thumbnail: courseData.thumbnail === 'no-image.jpg'
            ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
            : (courseData.thumbnail.startsWith('http') ? courseData.thumbnail : `http://localhost:5000/uploads/${courseData.thumbnail}`),
          instructor: {
            ...courseData.instructor,
            avatar: courseData.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor.name)}&background=random`
          }
        };
        setCourse(mappedCourse);
      }
    } catch (error) {
      console.error('Failed to fetch course');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/course/${id}`);
      const data = await response.json();
      if (response.ok) {
        setLessons(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Designing your experience...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800">
            <Info className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">Course Not Found</h1>
          <p className="text-slate-400">The course you are looking for might have been removed or the link is invalid.</p>
          <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
            <Link to="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Hero Section - Premium Dark Atmosphere */}
      <div className="relative pt-24 lg:pt-32 pb-20 overflow-hidden bg-slate-950">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/courses" className="hover:text-blue-400 transition-colors">Courses</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">{course.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-blue-500/15 text-blue-400 hover:bg-blue-500/20 border-blue-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg ring-1 ring-blue-500/20">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg">
                  {course.level}
                </Badge>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Recently Updated</span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {course.title}
              </h1>

              <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-700'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold">{course.rating || '5.0'}</span>
                  <span className="text-slate-500 text-sm">({course.reviewCount || 0} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold">{course.enrolledStudents?.toLocaleString() || 0} Students</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold">{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-14 h-14 rounded-2xl object-cover relative z-10 border-2 border-slate-800"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Crafted by</p>
                  <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Right Sticky Card - Glassmorphism UI */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 group/card">
                <div className="absolute inset-0 bg-blue-600/20 blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <PlayCircle className="w-10 h-10 text-slate-950 fill-current" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-sm">Live Preview Available</span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-white tracking-tight">
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xl text-slate-500 line-through mb-1.5">
                          ${course.originalPrice}
                        </span>
                      )}
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] mb-2 px-2">85% OFF</Badge>
                    </div>

                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                      >
                        Enroll Now
                      </Button>

                      <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-slate-800 bg-transparent hover:bg-slate-800 text-slate-300 font-bold">
                        Start Free Trial
                      </Button>
                    </div>

                    <p className="text-center text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      30-Day Full Refund Guarantee
                    </p>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className={`flex-1 rounded-2xl border-slate-800 h-12 ${isWishlisted ? 'text-rose-500 bg-rose-500/5' : ''}`}
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                        {isWishlisted ? 'Favorite' : 'Wishlist'}
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1 rounded-2xl border-slate-800 h-12">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium Features</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-slate-400 group/item">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:text-blue-400 group-hover/item:bg-blue-500/20 transition-all">
                            <PlayCircle className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{course.duration} High-Res Content</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-400 group/item">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/20 transition-all">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{course.lessonsCount} Modules Included</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-400 group/item">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover/item:text-amber-400 group-hover/item:bg-amber-500/20 transition-all">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Industry Recognition Cert</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Custom Tabs Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar scroll-smooth">
              {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.toLowerCase()
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* What You'll Learn Grid */}
            <section id="overview" className={`${activeTab === 'overview' ? 'block' : 'hidden md:block'} space-y-6 pt-6`}>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-3xl font-black mb-8 tracking-tight">The Mastery Journey</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {course.skills?.map((skill: string) => (
                    <div key={skill} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{skill}</h4>
                        <p className="text-sm text-slate-500 leading-snug">Gain deep technical proficiency and industry best practices in this core competency.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Curriculum Section */}
            <section id="curriculum" className={`${activeTab === 'curriculum' ? 'block' : 'hidden md:block'} space-y-8`}>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight">Structured Curriculum</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full">
                  <PlayCircle className="w-4 h-4 text-blue-500" /> {lessons.length} Learning Sections
                </div>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson: any, index: number) => (
                  <div
                    key={lesson._id}
                    className={`rounded-[2rem] overflow-hidden border transition-all duration-300 ${expandedLesson === lesson._id
                      ? 'border-blue-500/30 bg-blue-500/[0.02] ring-4 ring-blue-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <button
                      onClick={() => toggleLesson(lesson._id)}
                      className="w-full px-8 py-7 flex items-center justify-between transition-colors text-left"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${expandedLesson === lesson._id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 rotate-3'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                          }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold transition-colors ${expandedLesson === lesson._id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                            }`}>
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 font-medium">{lesson.topicsCount || '0'} modules • {lesson.duration || '0m'}</p>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${expandedLesson === lesson._id
                        ? 'border-blue-500 bg-blue-500 text-white rotate-180'
                        : 'border-slate-200 dark:border-slate-700'
                        }`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>

                    {expandedLesson === lesson._id && (
                      <div className="px-8 pb-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium border-l-4 border-blue-500/30 pl-4 italic">
                            {lesson.description || `In this section, we dive deep into ${lesson.title} mapping the theoretical foundations to practical execution.`}
                          </p>
                          <TopicList lessonId={lesson._id} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor Section */}
            <section id="instructor" className={`${activeTab === 'instructor' ? 'block' : 'hidden md:block'} pt-6`}>
              <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-110"></div>
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-slate-800 relative z-10 shadow-2xl"
                    />
                    <div className="absolute -bottom-4 right-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-900 text-white z-20">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                        {course.instructor.name}
                      </h3>
                      <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Senior Industry Strategist & Elite Educator</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">4.9</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Instructor Rating</span>
                      </div>
                      <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">15K+</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Learners</span>
                      </div>
                      <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-white">12</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expert Courses</span>
                      </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed font-medium">
                      {course.instructor.bio || "An industry veteran with over a decade of hands-on experience in specialized domains, dedicated to empowering the next generation of builders."}
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                      <Button variant="outline" className="rounded-full border-slate-700 bg-transparent text-white px-8 h-12 font-bold hover:bg-slate-800">
                        View Full Profile
                      </Button>
                      <Button className="rounded-full bg-blue-600 hover:bg-blue-700 h-12 w-12 p-0">
                        <MessageSquare className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Similar Courses */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Pro Recommendations
                </h3>
                <div className="space-y-6">
                  {/* Related Courses Placeholder logic */}
                  <div className="space-y-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-10 border border-dashed border-slate-800 rounded-[2rem]">Processing similar content intelligence...</p>
                  </div>
                </div>

                <Button className="w-full mt-8 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border-none font-black text-[10px] uppercase tracking-widest" variant="ghost">
                  See More Like This
                </Button>
              </div>

              {/* Modern Trust Badge */}
              <div className="bg-blue-600 dark:bg-blue-600 rounded-[2.5rem] p-8 text-white text-center space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-black">Official Certification</h4>
                <p className="text-blue-100 text-sm font-medium leading-relaxed">Boost your career profile with industry-validated digital certificates for every course completed.</p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl w-full h-12 text-xs uppercase tracking-widest">Learn About Certs</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
