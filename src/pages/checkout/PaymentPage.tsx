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
    ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        { label: 'Verifying payment details...', icon: '🔐' },
        { label: 'Processing transaction...', icon: '💳' },
        { label: 'Confirming enrollment...', icon: '📚' },
        { label: 'Finalizing your access...', icon: '✅' }
    ];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/courses/${id}`);
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

        // Wait for animation steps to play, then fire the API
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    navigate('/auth/login');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:5000/api/courses/${id}/enroll`, {
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

                console.log('Payment response status:', response.status);
                const text = await response.text();
                console.log('Payment response text:', text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error('Server returned invalid response');
                }

                if (response.ok) {
                    // Set final step
                    setProcessingStep(processingSteps.length - 1);
                    // Wait a moment for the final animation, then navigate
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
                    setProcessingError(data.message || 'Payment failed. Please try again.');
                    setTimeout(() => {
                        setIsProcessing(false);
                        setProcessingError('');
                    }, 3000);
                }
            } catch (error) {
                console.error('Payment error', error);
                setProcessingError('Network error. Please try again.');
                setTimeout(() => {
                    setIsProcessing(false);
                    setProcessingError('');
                }, 3000);
            }
        }, 2500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium">Setting up secure gateway...</p>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Course not found</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Navbar />

            {/* ====== PROCESSING OVERLAY MODAL ====== */}
            {isProcessing && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" style={{ animation: 'fadeIn 0.3s ease-out' }}></div>

                    {/* Modal */}
                    <div
                        className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-14 w-[90%] max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800"
                        style={{ animation: 'modalSlideUp 0.4s ease-out' }}
                    >
                        {/* Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[80px] rounded-full"></div>

                        {processingError ? (
                            /* Error State */
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                                    <span className="text-4xl">❌</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-red-500 mb-2">Payment Failed</h3>
                                    <p className="text-sm text-slate-500">{processingError}</p>
                                </div>
                            </div>
                        ) : (
                            /* Processing State */
                            <div className="text-center space-y-8">
                                {/* Animated Spinner */}
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 border-4 border-transparent border-b-indigo-500 border-l-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl" style={{ animation: 'pulse 1s ease-in-out infinite' }}>
                                            {processingSteps[processingStep].icon}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-xl font-black tracking-tight mb-1">Processing Payment</h3>
                                    <p className="text-sm text-slate-500 font-medium">Please do not close this window</p>
                                </div>

                                {/* Step Indicators */}
                                <div className="space-y-3 text-left max-w-xs mx-auto">
                                    {processingSteps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-3 transition-all duration-500 ${idx <= processingStep ? 'opacity-100' : 'opacity-30'
                                                }`}
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${idx < processingStep
                                                ? 'bg-emerald-500 text-white scale-100'
                                                : idx === processingStep
                                                    ? 'bg-blue-600 text-white scale-110'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                {idx < processingStep ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : idx === processingStep ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                )}
                                            </div>
                                            <span className={`text-sm font-bold ${idx < processingStep
                                                ? 'text-emerald-600 dark:text-emerald-400 line-through'
                                                : idx === processingStep
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-400'
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Amount being processed */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">${course.price}</p>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Lock className="w-3 h-3" />
                                    256-bit SSL Encrypted
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Inline styles for modal animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
            `}</style>

            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    {/* Progress Stepper */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/20">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Review</span>
                            </div>
                            <div className="w-20 h-px bg-emerald-500/30"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-600/20 scale-110">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Payment</span>
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Summary */}
                        <div className="lg:col-span-4 space-y-6 lg:order-2">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                                <h3 className="text-xl font-black mb-6 tracking-tight uppercase">Order Summary</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <img
                                            src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : `http://localhost:5000/uploads/${course.thumbnail}`}
                                            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                                            alt=""
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black line-clamp-2 uppercase tracking-tight">{course.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">{course.category}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 space-y-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Original Price</span>
                                            <span className="text-slate-400 line-through">${course.originalPrice || (course.price * 1.5).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">LMS Discount</span>
                                            <span className="text-green-500 font-bold">-$85.00</span>
                                        </div>
                                        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                            <span className="text-lg font-black uppercase tracking-tight">Total Amount</span>
                                            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">${course.price}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2">
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3 h-3" />
                                            Secure Transaction
                                        </p>
                                        <p className="text-[11px] text-slate-500 leading-snug">Every purchase is protected by 256-bit encryption ensuring your data stays private and safe.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment Form */}
                        <div className="lg:col-span-8 space-y-6 lg:order-1">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 lg:p-12 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
                                    <CreditCard className="w-8 h-8 text-blue-500" />
                                    Select Payment Way
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'card'
                                            ? 'border-blue-600 bg-blue-500/5 ring-4 ring-blue-500/5'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            {paymentMethod === 'card' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                                        </div>
                                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Plastic Currency</h4>
                                        <p className="text-sm font-bold opacity-80">Credit / Debit Card</p>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'upi'
                                            ? 'border-blue-600 bg-blue-500/5 ring-4 ring-blue-500/5'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                <Wallet className="w-6 h-6" />
                                            </div>
                                            {paymentMethod === 'upi' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                                        </div>
                                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Instant Pay</h4>
                                        <p className="text-sm font-bold opacity-80">UPI / Wallet Transfer</p>
                                    </button>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-8">
                                    {paymentMethod === 'card' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Account Holder Name</Label>
                                                <Input
                                                    placeholder="Johnathan Doe"
                                                    className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6 font-bold focus:ring-blue-500/20"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Card Identification Number</Label>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="0000 0000 0000 0000"
                                                        className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6 font-bold"
                                                        required
                                                    />
                                                    <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Expiry Timeline</Label>
                                                <Input
                                                    placeholder="MM/YY"
                                                    className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6 font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Security CVV</Label>
                                                <Input
                                                    placeholder="XYZ"
                                                    type="password"
                                                    className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6 font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-6">
                                                <div className="w-48 h-48 bg-white mx-auto rounded-3xl p-4 flex items-center justify-center flex-col gap-2 border border-slate-100 shadow-lg">
                                                    <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AUTOLMS_PAYMENT')] bg-center bg-no-repeat bg-contain opacity-80"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-black uppercase tracking-widest text-xs text-blue-600 mb-2">Scan with Any UPI App</h4>
                                                    <p className="text-xs text-slate-500 font-medium">GPay, PhonePe, Paytm supported</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Or Enter UPI Identifier</Label>
                                                <Input
                                                    placeholder="youremail@upi"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value)}
                                                    className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-6 font-bold"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-8">
                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full h-18 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-2xl shadow-blue-500/30 group active:scale-[0.98] transition-all"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    Verifying Gateway...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-4">
                                                    Authorize Payment of ${course.price}
                                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            )}
                                        </Button>
                                        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            3D Secure Authentication Enabled
                                        </p>
                                    </div>
                                </form>
                            </div>

                            <div className="flex items-center justify-between px-8">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate(-1)}
                                    className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Modify Order
                                </Button>
                                <div className="flex items-center gap-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Mastercard" />
                                    <img src="https://static-assets.razorpay.com/logos/upi.svg" className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all" alt="UPI" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
