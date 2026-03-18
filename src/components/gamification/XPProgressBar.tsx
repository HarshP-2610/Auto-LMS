import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap } from 'lucide-react';

interface XPProgressBarProps {
    xp: number;
    level: number;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({ xp, level }) => {
    // level = floor(sqrt(totalXP / 100)) + 1
    // So currentLevelXPBase = (level - 1)^2 * 100
    // nextLevelXPBase = level^2 * 100
    
    const currentLevelXPBase = Math.pow(level - 1, 2) * 100;
    const nextLevelXPBase = Math.pow(level, 2) * 100;
    
    const xpInCurrentLevel = xp - currentLevelXPBase;
    const xpNeededForNextLevel = nextLevelXPBase - currentLevelXPBase;
    const progressPercent = Math.min(Math.max((xpInCurrentLevel / xpNeededForNextLevel) * 100, 0), 100);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Level</h3>
                        <p className="text-2xl font-bold text-white">Level {level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total XP</p>
                    <div className="flex items-center gap-1 justify-end font-mono text-yellow-400 font-bold">
                        <Zap className="w-4 h-4 fill-current" />
                        {xp}
                    </div>
                </div>
            </div>

            <div className="relative h-4 w-full bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 via-gold-400 to-yellow-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                
                {/* Glow effect */}
                <motion.div
                    className="absolute top-0 left-0 h-full w-full bg-white/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="flex justify-between items-center mt-3 text-xs font-medium uppercase tracking-widest">
                <span className="text-yellow-500/80">{Math.round(xpInCurrentLevel)} XP</span>
                <span className="text-gray-500">{Math.round(xpNeededForNextLevel)} XP for Level {level + 1}</span>
            </div>
        </div>
    );
};
