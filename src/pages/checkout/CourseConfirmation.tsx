import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    ChevronRight,
    ShieldCheck,
    CreditCard,
    ArrowLeft,
    Clock,
    Award,
    BookOpen,
    Sparkles,
    Star,
    Users,
    Zap
} from 'lucide-react';
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
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium">Preparing your enrollment...</p>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Course not found</div>;

    const savingsPercent = Math.round((1 - course.price / (course.price * 1.5)) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
            <Navbar />

            <div className="pt-28 pb-24 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-600/8 via-purple-600/5 to-pink-500/8 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                    {/* Progress Stepper */}
                    <div className="flex items-center justify-center mb-14">
                        <div className="flex items-center">
                            {/* Step 1 - Review (Active) */}
                            <div className="flex flex-col items-center gap-2.5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Review</span>
                            </div>

                            <div className="w-24 h-1 mx-3 rounded-full bg-gradient-to-r from-blue-500/30 to-slate-200 dark:to-slate-800"></div>

                            {/* Step 2 - Payment */}
                            <div className="flex flex-col items-center gap-2.5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment</span>
                            </div>

                            <div className="w-24 h-1 mx-3 rounded-full bg-slate-200 dark:bg-slate-800"></div>

                            {/* Step 3 - Success */}
                            <div className="flex flex-col items-center gap-2.5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                    <Award className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Success</span>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to course details
                    </button>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">

                        {/* Course Hero Section */}
                        <div className="relative">
                            <div className="h-56 md:h-64 w-full overflow-hidden">
                                <img
                                    src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                    className="w-full h-full object-cover"
                                    alt={course.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                            </div>

                            {/* Floating badges on image */}
                            <div className="absolute top-5 left-5 flex items-center gap-2">
                                <Badge className="bg-white/15 backdrop-blur-xl text-white border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                                    {course.category}
                                </Badge>
                                <Badge className="bg-emerald-500/20 backdrop-blur-xl text-emerald-300 border-emerald-400/20 px-3 py-1.5 text-xs font-bold">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {savingsPercent}% OFF
                                </Badge>
                            </div>

                            {/* Course title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                                    {course.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <img
                                        src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name)}&background=6366f1&color=fff`}
                                        className="w-8 h-8 rounded-full border-2 border-white/30 shadow-md"
                                        alt=""
                                    />
                                    <span className="text-sm font-medium text-white/80">
                                        by <span className="text-white font-semibold">{course.instructor?.name}</span>
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-400 ml-2">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-xs font-bold text-white/70">{course.rating || '5.0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Stats + Pricing */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{course.duration || '0m'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lessons</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{course.lessonsCount || 0} Modules</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{course.difficulty || 'All'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{course.enrolledStudents?.length || 0} Students</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800"></div>

                            {/* Pricing Section */}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-indigo-900/10 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Summary</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                            ${course.price}
                                        </span>
                                        <span className="text-lg text-slate-400 line-through font-medium">
                                            ${(course.price * 1.5).toFixed(0)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">One-time payment &bull; Lifetime access</p>
                                </div>
                                <Button
                                    onClick={() => navigate(`/checkout/payment/${id}`)}
                                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all group"
                                >
                                    Proceed to Payment
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Lifetime Access</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Certificate Included</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Learn At Your Pace</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Secure Checkout</span>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Your payment information is protected with 256-bit SSL encryption</span>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
