import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    CheckCircle,
    Download,
    BookOpen,
    Clock,
    Award,
    CreditCard,
    User,
    Mail,
    Phone,
    Calendar,
    Hash,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Receipt,
    GraduationCap
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const { payment, course, student } = (location.state as any) || {};

    useEffect(() => {
        if (!payment || !course) {
            navigate('/courses');
            return;
        }
        // Delay for entrance animation
        setTimeout(() => setShowContent(true), 300);
        // Remove confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 5000);
    }, []);

    if (!payment || !course) return null;

    const formattedDate = new Date(payment.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleDownloadReceipt = () => {
        // Build a clean HTML receipt and open it for printing/saving as PDF
        const receiptHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - AutoLMS</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; }
        .receipt { max-width: 700px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
        .receipt-header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 40px; text-align: center; }
        .receipt-header h1 { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 5px; }
        .receipt-header p { opacity: 0.85; font-size: 14px; }
        .receipt-header .logo { font-size: 36px; font-weight: 900; margin-bottom: 15px; letter-spacing: -1px; }
        .receipt-body { padding: 40px; }
        .success-badge { display: inline-flex; align-items: center; gap: 8px; background: #ecfdf5; color: #059669; padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
        .detail-row .label { font-size: 13px; color: #64748b; font-weight: 600; }
        .detail-row .value { font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; }
        .total-row { display: flex; justify-content: space-between; padding: 18px 0; margin-top: 10px; border-top: 2px solid #e2e8f0; }
        .total-row .label { font-size: 16px; font-weight: 900; color: #0f172a; }
        .total-row .value { font-size: 28px; font-weight: 900; color: #2563eb; }
        .receipt-footer { text-align: center; padding: 25px 40px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
        .receipt-footer p { font-size: 11px; color: #94a3b8; line-height: 1.8; }
        .receipt-footer .brand { font-weight: 800; color: #2563eb; }
        @media print {
            body { padding: 0; background: white; }
            .receipt { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="receipt-header">
            <div class="logo">⊙ AutoLMS</div>
            <h1>Payment Receipt</h1>
            <p>Thank you for your purchase</p>
        </div>
        <div class="receipt-body">
            <div class="success-badge">
                ✓ Payment Successful
            </div>

            <div class="section">
                <div class="section-title">Transaction Details</div>
                <div class="detail-row">
                    <span class="label">Transaction ID</span>
                    <span class="value">${payment.transactionId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date & Time</span>
                    <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Payment Method</span>
                    <span class="value">${payment.method === 'card' ? 'Credit/Debit Card' : 'UPI Transfer'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status</span>
                    <span class="value" style="color: #059669;">✓ Completed</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Course Details</div>
                <div class="detail-row">
                    <span class="label">Course Name</span>
                    <span class="value">${course.title}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Category</span>
                    <span class="value">${course.category}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Difficulty</span>
                    <span class="value">${course.difficulty}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Duration</span>
                    <span class="value">${course.duration}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Instructor</span>
                    <span class="value">${course.instructor?.name || 'N/A'}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Student Details</div>
                <div class="detail-row">
                    <span class="label">Name</span>
                    <span class="value">${student?.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email</span>
                    <span class="value">${student?.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Phone</span>
                    <span class="value">${student?.phone || 'N/A'}</span>
                </div>
            </div>

            <div class="total-row">
                <span class="label">Total Amount Paid</span>
                <span class="value">$${payment.amount}</span>
            </div>
        </div>
        <div class="receipt-footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>For support, contact us at <span class="brand">support@autolms.com</span></p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} <span class="brand">AutoLMS</span>. All rights reserved.</p>
        </div>
    </div>
    <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
            newWindow.onafterprint = () => {
                URL.revokeObjectURL(url);
            };
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Navbar />

            {/* ====== CONFETTI EFFECT ====== */}
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 rounded-sm"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-5%`,
                                background: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'][Math.floor(Math.random() * 6)],
                                animation: `confettiFall ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s forwards`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                opacity: 0.8
                            }}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity: 0; }
                }
                @keyframes successPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
                    50% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div className="pt-32 pb-20 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4"></div>

                <div className="max-w-5xl mx-auto px-4 relative z-10">

                    {/* Progress Stepper - All Complete */}
                    <div className="flex items-center justify-center mb-12" style={{ animation: showContent ? 'slideUp 0.5s ease-out' : 'none' }}>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/20">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Review</span>
                            </div>
                            <div className="w-20 h-px bg-emerald-500/30"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/20">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Payment</span>
                            </div>
                            <div className="w-20 h-px bg-emerald-500/30"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/20 scale-110" style={{ animation: 'successPulse 2s ease-in-out infinite' }}>
                                    <Award className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Success</span>
                            </div>
                        </div>
                    </div>

                    {/* Success Hero */}
                    <div
                        className="text-center mb-12"
                        style={{ animation: showContent ? 'scaleIn 0.6s ease-out 0.2s both' : 'none' }}
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 mb-6" style={{ animation: 'successPulse 2s ease-in-out infinite' }}>
                            <CheckCircle className="w-14 h-14 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                            Payment <span className="text-emerald-500">Successful!</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            Congratulations! You've been enrolled in <span className="font-bold text-slate-700 dark:text-slate-300">{course.title}</span>. Start learning right away!
                        </p>
                    </div>

                    <div
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        style={{ animation: showContent ? 'slideUp 0.6s ease-out 0.4s both' : 'none' }}
                    >
                        {/* Left Column: Course & Student Info */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Course Details Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                                <div className="relative h-48">
                                    <img
                                        src={course.thumbnail === 'no-image.jpg' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60' : `http://localhost:5000/uploads/${course.thumbnail}`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt={course.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-8 right-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest">Enrolled</span>
                                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest">{course.category}</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">{course.title}</h2>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Course Meta */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center">
                                            <GraduationCap className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Instructor</p>
                                            <p className="text-sm font-bold truncate">{course.instructor?.name}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center">
                                            <Clock className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                                            <p className="text-sm font-bold">{course.duration}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center">
                                            <BookOpen className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Lessons</p>
                                            <p className="text-sm font-bold">{course.lessonsCount || 0}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center">
                                            <Award className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Level</p>
                                            <p className="text-sm font-bold">{course.difficulty}</p>
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    {student && (
                                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Student Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</p>
                                                        <p className="text-sm font-bold">{student.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</p>
                                                        <p className="text-sm font-bold truncate">{student.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</p>
                                                        <p className="text-sm font-bold">{student.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment Summary + Actions */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Payment Details Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Receipt className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">Payment Receipt</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Completed</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <Hash className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction ID</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight">{payment.transactionId}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Method</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{payment.method === 'card' ? 'Credit/Debit Card' : 'UPI Transfer'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle className="w-3 h-3" />
                                            Completed
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black uppercase tracking-tight">Total Paid</span>
                                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">${payment.amount}</span>
                                    </div>
                                </div>

                                {/* Download Receipt */}
                                <Button
                                    onClick={handleDownloadReceipt}
                                    className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-xl active:scale-[0.98] transition-all group"
                                >
                                    <Download className="w-5 h-5 mr-2 group-hover:translate-y-0.5 transition-transform" />
                                    Download Receipt (PDF)
                                </Button>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate('/student/courses')}
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all group"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Learning Now
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/courses')}
                                    className="w-full h-12 rounded-2xl text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest"
                                >
                                    Browse More Courses
                                </Button>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-2">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto" />
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Transaction Secured</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Your payment was processed securely with 256-bit encryption. A confirmation email has been sent to your registered email address.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
