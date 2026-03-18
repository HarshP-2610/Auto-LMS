import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Star } from 'lucide-react';

interface LevelUpAnimationProps {
    level: number;
    show: boolean;
    onComplete: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ level, show, onComplete }) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            
            // Trigger confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
            }, 250);

            // Hide after 4 seconds
            const timeout = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onComplete, 500); // Allow exit animation to finish
            }, 4000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="relative flex flex-col items-center justify-center p-12 bg-gradient-to-b from-yellow-500/20 to-gold-900/40 rounded-3xl border border-yellow-500/30 overflow-hidden"
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        {/* Rotating background sunburst */}
                        <motion.div 
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent opacity-50"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Icon */}
                        <motion.div
                            className="relative z-10 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.5)] border-4 border-yellow-200"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Award className="w-20 h-20 text-white" />
                        </motion.div>

                        {/* Stars */}
                        <motion.div className="absolute top-10 right-10" animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                        </motion.div>
                        <motion.div className="absolute bottom-20 left-10" animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                            <Star className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                        </motion.div>

                        <div className="relative z-10 text-center mt-8 space-y-2">
                            <motion.h2 
                                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                LEVEL UP!
                            </motion.h2>
                            <motion.p 
                                className="text-2xl text-yellow-100/80 font-medium"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                You are now Level <span className="font-bold text-white">{level}</span>
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
