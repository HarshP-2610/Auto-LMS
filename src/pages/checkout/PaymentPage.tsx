import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CreditCard,
    ArrowLeft,
    ShieldCheck,
    CheckCircle,
    Award,
    Lock,
    Loader2,
    Wallet,
    ChevronRight,
    CheckCircle2,
    LockKeyhole,
    Activity,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function PaymentPage() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [processingStep, setProcessingStep] = useState(0);
    const [processingError, setProcessingError] = useState('');
    const navigate = useNavigate();

    const processingSteps = [
        { label: 'Initializing Secure Tunnel', icon: <LockKeyhole className="w-5 h-5" /> },
        { label: 'Encrypting Financial Payload', icon: <Activity className="w-5 h-5" /> },
        { label: 'Merchant Authorization', icon: <ShieldCheck className="w-5 h-5" /> },
        { label: 'Establishing Academic Record', icon: <CheckCircle2 className="w-5 h-5" /> }
    ];

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

    useEffect(() => {
        if (isProcessing && processingStep < processingSteps.length - 1) {
            const timer = setTimeout(() => {
                setProcessingStep(prev => prev + 1);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isProcessing, processingStep]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setProcessingStep(0);
        setProcessingError('');

        setTimeout(async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    navigate('/auth/login');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/courses/${id}/enroll`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        paymentMethod,
                        paymentDetails: paymentMethod === 'card' ? {
                            cardHolderName: "Simulation User",
                            lastFourDigits: "4242"
                        } : {
                            upiId: upiId || "user@upi"
                        }
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setProcessingStep(processingSteps.length - 1);
                    setTimeout(() => {
                        navigate('/checkout/success', {
                            state: {
                                payment: data.payment,
                                course: data.course,
                                student: data.student
                            }
                        });
                    }, 1000);
                } else {
                    setProcessingError(data.message || 'Transaction Declined. Verification Failed.');
                    setTimeout(() => {
                        setIsProcessing(false);
                        setProcessingError('');
                    }, 3500);
                }
            } catch (error) {
                setProcessingError('Structural Network Breach. Please retry.');
                setTimeout(() => {
                    setIsProcessing(false);
                    setProcessingError('');
                }, 3500);
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Secure Gateway...</p>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-xs uppercase tracking-widest font-black">Entity Not Found</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
            <Navbar />

            {/* ====== CINEMATIC PROCESSING OVERLAY ====== */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white dark:bg-slate-900 rounded-[4rem] p-12 md:p-16 w-[90%] max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 overflow-hidden"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>

                            {processingError ? (
                                <div className="text-center space-y-8">
                                    <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-rose-500/10 flex items-center justify-center border-2 border-rose-500/20">
                                        <ShieldAlert className="w-12 h-12 text-rose-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black tracking-tighter text-rose-500 mb-3 uppercase">Security Breach</h3>
                                        <p className="text-sm text-slate-500 font-medium italic">{processingError}</p>
                                    </div>
                                    <Button onClick={() => setIsProcessing(false)} className="w-full h-16 rounded-[1.5rem] bg-rose-600 hover:bg-rose-700 font-black uppercase text-xs tracking-widest">
                                        Return to Interface
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-12">
                                    {/* Advanced Spinner UI */}
                                    <div className="relative w-32 h-32 mx-auto">
                                        <div className="absolute inset-0 border-4 border-blue-500/5 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-400 rounded-full animate-spin"></div>
                                        <div className="absolute inset-3 border-4 border-transparent border-b-indigo-500 border-l-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-blue-600 animate-pulse">
                                                {processingSteps[processingStep].icon}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">Executing Transaction</h3>
                                        <div className="flex flex-col items-center gap-3">
                                            {processingSteps.map((step, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center gap-4 transition-all duration-700 ${idx <= processingStep ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${idx < processingStep ? 'bg-emerald-500' : idx === processingStep ? 'bg-blue-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${idx === processingStep ? 'text-blue-600' : 'text-slate-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Amount</p>
                                        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${course.price}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-32 pb-24 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors group mb-4"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                Return to Order Review
                            </button>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                Secure <span className="text-blue-600">Checkout</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2 rounded-[2rem] shadow-xl"
                        >
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Review</span>
                            </div>
                            <div className="w-8 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                                <CreditCard className="w-4 h-4" />
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
                        {/* Left Column: Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-8 space-y-10"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>

                                <div className="relative space-y-12">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-4">
                                            <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                <Wallet className="w-6 h-6" />
                                            </span>
                                            Authorization Protocol
                                        </h2>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px]">
                                            Secure Channel Active
                                        </Badge>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`group relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 ${paymentMethod === 'card'
                                                ? 'border-blue-600 bg-blue-500/5 shadow-2xl shadow-blue-500/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'}`}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                                                    <CreditCard className="w-7 h-7" />
                                                </div>
                                                {paymentMethod === 'card' && (
                                                    <motion.div layoutId="active" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-2 text-slate-400">Option 01</h4>
                                            <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Credit Ledger</p>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`group relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 ${paymentMethod === 'upi'
                                                ? 'border-blue-600 bg-blue-500/5 shadow-2xl shadow-blue-500/10'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'}`}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${paymentMethod === 'upi' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                                                    <Activity className="w-7 h-7" />
                                                </div>
                                                {paymentMethod === 'upi' && (
                                                    <motion.div layoutId="active" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-2 text-slate-400">Option 02</h4>
                                            <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Instant UPI</p>
                                        </button>
                                    </div>

                                    <form onSubmit={handlePayment} className="space-y-10">
                                        {paymentMethod === 'card' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="md:col-span-2 space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Digital Signature Name</Label>
                                                    <Input
                                                        placeholder="e.g. PROF. ARCHI PATEL"
                                                        className="h-18 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 px-8 font-black text-lg focus:ring-blue-500/10 transition-all uppercase placeholder:opacity-30"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Card Identification String</Label>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="0000 0000 0000 0000"
                                                            className="h-18 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 px-8 font-black text-lg"
                                                            required
                                                        />
                                                        <CreditCard className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Expiry Timeline</Label>
                                                    <Input
                                                        placeholder="MM / YY"
                                                        className="h-18 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 px-8 font-black text-lg"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Security Hash (CVV)</Label>
                                                    <Input
                                                        placeholder="•••"
                                                        type="password"
                                                        className="h-18 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 px-8 font-black text-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-10">
                                                <div className="p-12 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/50 border-2 border-dashed border-slate-100 dark:border-slate-800 text-center space-y-8 group/qr transition-all duration-500 hover:border-blue-500/30">
                                                    <div className="relative w-56 h-56 mx-auto bg-white rounded-[2rem] p-6 shadow-2xl transition-transform duration-500 group-hover/qr:scale-105">
                                                        <div className="absolute inset-0 bg-blue-600/5 rounded-[2rem] blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                                                        <img 
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/verify/AUTOLMS_PAYMENT_FOR_${id}`)}`} 
                                                            className="relative w-full h-full object-contain opacity-80" 
                                                            alt="QR Code" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-blue-600 mb-2">Omnichannel Interface</h4>
                                                        <p className="text-xs text-slate-500 font-bold tracking-tight">Scan with GPay, PhonePe, or Apple Pay</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Alternative UPI ID</Label>
                                                    <Input
                                                        placeholder="identifier@institution"
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                        className="h-18 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 px-8 font-black text-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6">
                                            <Button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="w-full h-24 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-100 font-black text-2xl uppercase tracking-widest shadow-2xl shadow-slate-900/20 dark:shadow-white/10 active:scale-[0.98] transition-all group overflow-hidden relative"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-4">
                                                    Authorize Transaction
                                                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            </Button>
                                            <p className="text-center text-[9px] text-slate-400 mt-8 flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em]">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                Biometric 3D Secure Protection Enabled
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Mini Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-4 space-y-8 sticky top-32"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <div className="relative space-y-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">Order Manifest</h3>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Authentication Required</p>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                        <img
                                            src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : (course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)}
                                            className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-md"
                                            alt=""
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[11px] font-black line-clamp-2 uppercase tracking-tight leading-snug">{course.title}</h4>
                                            <p className="text-[9px] text-blue-600 mt-1 uppercase tracking-widest font-black italic">{course.category}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Institutional Fee</span>
                                            <span>${(course.price * 1.5).toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                            <span>Strategic Credit</span>
                                            <span>-${(course.price * 0.5).toFixed(0)}</span>
                                        </div>
                                        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                                        <div className="flex flex-col gap-2 pt-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Authorization</p>
                                            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${course.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 justify-center pt-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-7" alt="Mastercard" />
                                        <img src="https://static-assets.razorpay.com/logos/upi.svg" className="h-4" alt="UPI" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group cursor-default">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="relative flex items-start gap-4">
                                    <LockKeyhole className="w-6 h-6 shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <p className="text-sm font-black uppercase tracking-widest">Sovereign Protection</p>
                                        <p className="text-[10px] font-medium leading-relaxed opacity-80 italic">Your financial data is never stored on our local cloud. All transactions are proxied through a 256-bit AES military-grade vault.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
