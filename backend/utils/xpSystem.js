const User = require('../models/User');

/**
 * Award XP to a user and handle level-up / badge logic.
 * @param {string} userId - The unique identifier for the user.
 * @param {number} amount - The amount of XP to award.
 * @returns {object} - Updated user gamification stats.
 */
exports.awardXP = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return null;

        // 1. Add XP
        user.xp += amount;

        // 2. Calculate current level based on XP
        // level = floor(sqrt(totalXP / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
        
        let leveledUp = false;
        if (newLevel > user.level) {
            user.level = newLevel;
            leveledUp = true;
        }

        // 3. Badge System Logic
        const existingBadges = user.badges.map(b => b.icon);

        // Badge: Beginner (First Login/Activity)
        if (!existingBadges.includes('Beginner')) {
            user.badges.push({ name: 'Beginner', icon: 'Beginner', dateAwarded: new Date() });
        }

        // Badge: Learner (Complete 5 lessons - dummy logic, better to check Progress model)
        // For simplicity, we could award it when a certain amount of XP is reached
        if (user.xp >= 500 && !existingBadges.includes('Learner')) {
            user.badges.push({ name: 'Dedicated Learner', icon: 'Learner', dateAwarded: new Date() });
        }

        // Badge: Quiz Master (Complete 10 quizzes / 1000 XP milestone)
        if (user.xp >= 1000 && !existingBadges.includes('QuizMaster')) {
            user.badges.push({ name: 'Quiz Master', icon: 'QuizMaster', dateAwarded: new Date() });
        }

        // Badge: Streak King (7 day streak)
        if (user.streak >= 7 && !existingBadges.includes('StreakKing')) {
            user.badges.push({ name: 'Streak King', icon: 'StreakKing', dateAwarded: new Date() });
        }

        await user.save();

        return {
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            badges: user.badges,
            leveledUp
        };
    } catch (error) {
        console.error('XP Awarding Error:', error);
        return null;
    }
};

/**
 * Update user streak logic on login.
 * @param {object} user - The user mongoose object.
 */
exports.handleStreakOnLogin = async (user) => {
    try {
        const now = new Date();
        const lastLogin = user.lastLogin;
        
        if (!lastLogin) {
            // First ever login
            user.streak = 1;
        } else {
            const diffTime = Math.abs(now - lastLogin);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Logged in exactly tomorrow
                user.streak += 1;
            } else if (diffDays > 1) {
                // Missed a day
                user.streak = 1;
            }
        }

        user.lastLogin = now;
        await user.save();
        
        // Award XP for daily login
        return await this.awardXP(user._id, 10);
    } catch (error) {
        console.error('Streak Update Error:', error);
        return null;
    }
};
