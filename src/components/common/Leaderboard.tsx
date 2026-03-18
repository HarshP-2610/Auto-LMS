import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';

interface LeaderboardEntry {
  _id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  quizCount: number;
  completedCourses: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        const result = await response.json();
        if (response.ok) {
          setLeaderboard(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white/50 dark:bg-gray-950/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-sm text-gray-400 font-medium">Calculating rankings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400/10 rounded-xl">
            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Student Leaderboard</h2>
        </div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Top 10 Leaders</span>
      </div>

      <div className="p-2">
        <div className="space-y-1">
          {leaderboard.map((entry, index) => {
            const isTop3 = index < 3;
            const rankStyle = 
              index === 0 ? 'bg-yellow-400/10 text-yellow-600 border-yellow-200 ring-yellow-400/20' :
              index === 1 ? 'bg-gray-400/10 text-gray-600 border-gray-200 ring-gray-400/20' :
              index === 2 ? 'bg-orange-400/10 text-orange-600 border-orange-200 ring-orange-400/20' :
              'bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 border-transparent';

            return (
              <div 
                key={entry._id}
                className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${isTop3 ? 'bg-white dark:bg-gray-800/40 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm ring-4 ${rankStyle}`}>
                  {isTop3 ? (
                    <Medal className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={entry.avatar} 
                    alt={entry.name} 
                    className="w-11 h-11 rounded-xl object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                  {index === 0 && (
                     <div className="absolute -top-1 -right-1">
                       <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                     </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {entry.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                    {entry.completedCourses} Courses • {entry.quizCount} Quizzes
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                   <div className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                     {entry.totalPoints.toLocaleString()}
                   </div>
                   <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Points</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Updated in real-time based on your progress</p>
      </div>
    </div>
  );
}
