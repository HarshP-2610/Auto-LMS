import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    ShieldX, 
    Shield,
    Lock,
    Zap,
    Loader2
} from 'lucide-react';

const socket = io('http://localhost:5000');

export function VerifyPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [status, setStatus] = useState<'idle' | 'verifying' | 'confirmed' | 'rejected'>('verifying');

    useEffect(() => {
        if (sessionId) {
            socket.emit('join-verification', sessionId);
        }
    }, [sessionId]);

    const handleConfirm = () => {
        if (!sessionId) return;
        setStatus('confirmed');
        socket.emit('verify-scan', { sessionId, status: 'confirmed' });
    };

    const handleReject = () => {
        if (!sessionId) return;
        setStatus('rejected');
        socket.emit('verify-scan', { sessionId, status: 'rejected' });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative w-full max-w-lg bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
                {/* Header */}
                <div className="relative p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-black uppercase tracking-widest text-white">Sovereign Gateway</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Level 4 Biometric Auth</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative p-8 md:p-12">
                    {status === 'verifying' && (
                        <div className="py-8 space-y-12">
                            <div className="text-center space-y-6">
                                <div className="relative inline-block">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="w-36 h-36 rounded-[3rem] border-2 border-dashed border-blue-500/30 p-3"
                                    >
                                        <div className="w-full h-full rounded-[2rem] bg-blue-500/5 flex items-center justify-center text-blue-600">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Lock className="w-12 h-12" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl border-4 border-slate-900"
                                    >
                                        <Zap className="w-5 h-5" />
                                    </motion.div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-3xl font-black uppercase tracking-tight text-white">Verification Required</h4>
                                    <p className="text-sm text-slate-400 font-medium italic max-w-xs mx-auto leading-relaxed">
                                        Payload ID: <span className="text-blue-500 font-bold font-mono">{sessionId?.substring(0, 12)}...</span>
                                        <br />
                                        Please authorize the pending transaction on the primary device.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 md:gap-8">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleReject}
                                    className="group relative h-28 rounded-[2rem] bg-rose-500/5 border-2 border-rose-500/10 hover:border-rose-500 hover:bg-rose-500 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative flex flex-col items-center justify-center gap-2 text-rose-500 group-hover:text-white">
                                        <ShieldX className="w-8 h-8" />
                                        <span className="text-xs font-black uppercase tracking-widest">Reject</span>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirm}
                                    className="group relative h-28 rounded-[2rem] bg-emerald-500/5 border-2 border-emerald-500/10 hover:border-emerald-500 hover:bg-emerald-500 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative flex flex-col items-center justify-center gap-2 text-emerald-500 group-hover:text-white">
                                        <ShieldCheck className="w-8 h-8" />
                                        <span className="text-xs font-black uppercase tracking-widest">Confirm</span>
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {(status === 'confirmed' || status === 'rejected') && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 text-center space-y-10"
                        >
                            <div className="relative inline-block">
                                <motion.div 
                                    animate={{ 
                                        scale: status === 'confirmed' ? [1, 1.3, 1] : [1, 1.05, 1],
                                        opacity: status === 'confirmed' ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute inset-[-40px] rounded-full blur-3xl ${
                                        status === 'confirmed' ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                />
                                
                                <div className={`relative w-40 h-40 mx-auto rounded-[3.5rem] flex items-center justify-center border-4 shadow-2xl ${
                                    status === 'confirmed' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20' 
                                    : 'bg-rose-500/10 border-rose-500/20 shadow-rose-500/20'
                                }`}>
                                    {status === 'confirmed' ? (
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.1, 1],
                                                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ShieldCheck className="w-20 h-20 text-emerald-500" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            animate={{ x: [-4, 4, -4, 4, -2, 2, 0] }}
                                            transition={{ duration: 0.4, repeat: 10 }}
                                        >
                                            <ShieldX className="w-20 h-20 text-rose-500" />
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className={`text-4xl font-black uppercase tracking-tighter ${
                                    status === 'confirmed' ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                    {status === 'confirmed' ? 'Authorization Granted' : 'Verification Denied'}
                                </h4>
                                <div className="flex items-center justify-center gap-3 text-slate-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        {status === 'confirmed' ? 'Broadcasting Approval...' : 'Protocol Terminated'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative p-8 bg-black/20 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-slate-800"></div>
                        Sovereign Security Node
                        <div className="h-px w-8 bg-slate-800"></div>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
