const User = require('../models/User');

// @desc    Get user profile (specifically for student dashboard)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
                enrolledCourses: user.enrolledCourses,
                progress: user.progress,
                certificates: user.certificates,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile };
