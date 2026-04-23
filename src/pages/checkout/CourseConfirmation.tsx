import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    ShieldCheck,
    ArrowLeft,
    Clock,
    Award,
    BookOpen,
    Star,
    Users,
    Zap,
    Lock,
    Infinity,
    CheckCircle2,
    PlayCircle,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CourseConfirmation() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setCourse(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch course');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-4 border-indigo-400 border-b-transparent rounded-full animate-spin-reverse"></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Secure Checkout...</p>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Course not found</div>;

    const originalPrice = (course.price * 1.5).toFixed(0);
    const savings = (course.price * 0.5).toFixed(0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
            <Navbar />

            <div className="pt-32 pb-24 relative overflow-hidden">
                {/* Modern Ambient Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header with Breadcrumb-style Progress */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                        >
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors group mb-4"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                Return to Storefront
                            </button>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                Review <span className="text-blue-600">Order</span>
                            </h1>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none"
                        >
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Review</span>
                            </div>
                            <div className="w-8 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-3 px-6 py-3 text-slate-400">
                                <Lock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Payment</span>
                            </div>
                            <div className="w-8 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-3 px-6 py-3 text-slate-400">
                                <Award className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Success</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Left Column: Course Preview */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-7 space-y-10"
                        >
                            <div className="group relative rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900 border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                <div className="aspect-[16/9] w-full overflow-hidden relative">
                                    <img
                                        src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        alt={course.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                            <PlayCircle className="w-10 h-10 fill-white" />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <Badge className="bg-blue-600/90 backdrop-blur-md text-white border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px] mb-4">
                                            {course.category}
                                        </Badge>
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                                            {course.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-10 space-y-8">
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-sm opacity-50"></div>
                                                <img
                                                    src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name)}&background=6366f1&color=fff`}
                                                    className="relative w-12 h-12 rounded-full border-2 border-white shadow-xl"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Academic Lead</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{course.instructor?.name}</p>
                                            </div>
                                        </div>

                                        <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Peer Index</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{course.rating || '5.0'} / 5.0</p>
                                            </div>
                                        </div>

                                        <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Matriculated</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{course.enrolledStudents?.length || 0} Scholars</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-600" />
                                            Curriculum Highlights
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{course.duration} High-Octane Learning</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{course.lessonsCount} Master Modules</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                                <Award className="w-5 h-5 text-amber-600" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Professional Credential</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                                <Infinity className="w-5 h-5 text-emerald-600" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Eternal Content Access</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Checkout Summary */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-5 space-y-8 sticky top-32"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                
                                <div className="relative space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Order Summary</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Verify and proceed to checkout</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enrollment Fee</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">${originalPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 text-emerald-600">
                                            <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0.5 rounded-lg text-[9px] font-black">AUTO_SAVINGS</Badge>
                                                Institutional Credit
                                            </span>
                                            <span className="text-sm font-black">-${savings}</span>
                                        </div>
                                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total to Pay</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${course.price}</span>
                                                    <Badge className="bg-blue-600 text-white border-none font-black text-[9px] px-2 py-1 rounded-lg shadow-lg shadow-blue-500/20">USD</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => navigate(`/checkout/payment/${id}`)}
                                        className="w-full h-20 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-100 font-black text-xl uppercase tracking-widest shadow-2xl shadow-slate-900/20 dark:shadow-white/10 active:scale-[0.98] transition-all group overflow-hidden relative"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            Begin Enrollment
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </Button>

                                    <div className="pt-6 space-y-6">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Protocol</p>
                                                <p className="text-xs font-black text-slate-700 dark:text-slate-300 leading-none">256-bit AES Encryption Active</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Pay</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <Infinity className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Forever</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                                    <Lock className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SSL Secure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-8 leading-relaxed italic">
                                By clicking 'Begin Enrollment', you agree to our Academic Terms of Service and digital content governance policy.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
