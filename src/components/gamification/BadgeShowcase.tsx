import React from 'react';
import { Star, Shield, Trophy, Target, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Badge {
    name: string;
    icon: string;
    dateAwarded: Date;
}

interface BadgeShowcaseProps {
    badges: Badge[];
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {
    // Mapping of string identifiers to icons and styles
    const getBadgeStyle = (iconString: string) => {
        switch (iconString) {
            case 'Beginner':
                return { Icon: Star, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' };
            case 'Learner':
                return { Icon: Shield, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' };
            case 'QuizMaster':
                return { Icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' };
            case 'StreakKing':
                return { Icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' };
            default:
                return { Icon: Trophy, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30' };
        }
    };

    // Define all possible badges to show locked ones
    const allKnownBadges = [
        { name: 'Beginner', iconString: 'Beginner', desc: 'First activity' },
        { name: 'Dedicated Learner', iconString: 'Learner', desc: 'Reached 500 XP' },
        { name: 'Quiz Master', iconString: 'QuizMaster', desc: 'Reached 1000 XP' },
        { name: 'Streak King', iconString: 'StreakKing', desc: '7 Day Streak' }
    ];

    const unlockedIconStrings = badges.map(b => b.icon);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Achievement Badges</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {allKnownBadges.map((badgeDef, i) => {
                    const isUnlocked = unlockedIconStrings.includes(badgeDef.iconString);
                    const style = getBadgeStyle(badgeDef.iconString);
                    const Icon = style.Icon;

                    return (
                        <motion.div 
                            key={badgeDef.iconString}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border ${isUnlocked ? style.bg : 'bg-gray-800/20 border-gray-700/50 opacity-50 grayscale'} transition-all`}
                        >
                            <div className={`p-3 rounded-full ${isUnlocked ? 'bg-white/10 shadow-lg' : 'bg-gray-800'} mb-2`}>
                                <Icon className={`w-6 h-6 ${style.color}`} />
                            </div>
                            <span className="text-xs font-bold text-gray-200 text-center">{badgeDef.name}</span>
                            
                            {/* Tooltip */}
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-10 bg-gray-900 border border-gray-700 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointers-events-none">
                                {isUnlocked ? 'Unlocked!' : badgeDef.desc}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
