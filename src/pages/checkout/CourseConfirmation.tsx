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
    BookOpen
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

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Navbar />

            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    {/* Progress Stepper */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-600/20">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Review</span>
                            </div>
                            <div className="w-20 h-px bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment</span>
                            </div>
                            <div className="w-20 h-px bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                    <Award className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Success</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to details
                            </Button>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-5">
                                {/* Image Section */}
                                <div className="md:col-span-2 relative h-full min-h-[250px]">
                                    <img
                                        src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt={course.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <Badge className="bg-blue-600 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{course.category}</Badge>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="md:col-span-3 p-8 lg:p-10 space-y-6">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight uppercase">{course.title}</h1>
                                        <div className="flex items-center gap-3">
                                            <img src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name)}&background=random`} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800" />
                                            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Instructor: <span className="text-slate-900 dark:text-white font-bold">{course.instructor?.name}</span></span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Duration</span>
                                                <span className="text-sm font-bold">{course.duration}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Modules</span>
                                                <span className="text-sm font-bold">{course.lessonsCount || 0} Lessons</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Original Price</span>
                                            <span className="text-lg text-slate-400 line-through font-medium">${course.originalPrice || (course.price * 1.5).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total to Pay</span>
                                            <span className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">${course.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-slate-500 text-sm font-medium flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Guaranteed access after successful payment
                            </div>
                            <Button
                                onClick={() => navigate(`/checkout/payment/${id}`)}
                                size="lg"
                                className="w-full sm:w-auto px-12 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all group"
                            >
                                Confirm & Proceed to Payment
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
                                <CheckCircle className="w-6 h-6 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lifetime Access</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
                                <Award className="w-6 h-6 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Certificate Included</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
                                <Clock className="w-6 h-6 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Study At Your Pace</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Safe Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
