const User = require('../models/User');
const CompletedQuiz = require('../models/CompletedQuiz');

// @desc    Get leaderboard data
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        // Aggregate quiz scores per user
        const quizStats = await CompletedQuiz.aggregate([
            {
                $group: {
                    _id: '$user',
                    avgScore: { $avg: '$score' },
                    totalQuizzes: { $count: {} }
                }
            }
        ]);

        // Get all students
        const students = await User.find({ role: 'student' })
            .select('name avatar progress')
            .lean();

        // Calculate total points for each student
        const leaderboard = students.map(student => {
            const stats = quizStats.find(s => s._id.toString() === student._id.toString());
            
            // Base score from quiz average
            const avgQuizScore = stats ? stats.avgScore : 0;
            const quizCount = stats ? stats.totalQuizzes : 0;

            // Progress score (sum of all percentComplete)
            const totalProgress = (student.progress || []).reduce((sum, p) => sum + (p.percentComplete || 0), 0);
            
            // Simple ranking formula: Avg Quiz Score + (Progress * 0.5) + (Quiz Count * 2)
            const totalPoints = Math.round(avgQuizScore + (totalProgress * 0.1) + (quizCount * 5));

            return {
                _id: student._id,
                name: student.name,
                avatar: student.avatar === 'no-photo.jpg' 
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random` 
                    : (student.avatar.startsWith('http') ? student.avatar : `http://localhost:5000/uploads/${student.avatar}`),
                totalPoints,
                avgQuizScore: Math.round(avgQuizScore),
                quizCount,
                completedCourses: (student.progress || []).filter(p => p.percentComplete === 100).length
            };
        });

        // Sort by total points and take top 10
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
        const top10 = leaderboard.slice(0, 10);

        res.status(200).json({
            success: true,
            count: top10.length,
            data: top10
        });
    } catch (error) {
        console.error('Leaderboard error:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getLeaderboard
};
