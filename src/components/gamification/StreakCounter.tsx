import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
    streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-2xl border border-orange-500/20 shadow-lg group">
            <div className="relative mb-3">
                <motion.div
                    className="absolute -inset-2 bg-orange-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                <motion.div
                    animate={{
                        y: [0, -4, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                >
                    <Flame className="w-12 h-12 text-orange-500 fill-orange-500" />
                </motion.div>
                
                {/* Streak number badge */}
                <div className="absolute -top-1 -right-1 bg-red-600 border border-white/20 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    {streak}
                </div>
            </div>

            <div className="text-center">
                <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tracking-tighter uppercase">
                    {streak} DAY STREAK
                </h4>
                <p className="text-[10px] text-orange-300 font-bold tracking-widest uppercase mt-1">Don't break the fire! 🔥</p>
            </div>
        </div>
    );
};
