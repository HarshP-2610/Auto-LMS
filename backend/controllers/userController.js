const User = require('../models/User');

// @desc    Get user profile
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
                location: user.location || '',
                instructorBio: user.instructorBio || '',
                instructorTitle: user.instructorTitle || '',
                expertise: user.expertise || [],
                payoutSettings: user.payoutSettings || { method: 'PayPal', schedule: 'Monthly' },
                enrolledCourses: user.enrolledCourses,
                progress: user.progress,
                certificates: user.certificates,
                taughtCourses: user.taughtCourses,
                rating: user.rating,
                numReviews: user.numReviews,
                earnings: user.earnings,
                adminLevel: user.adminLevel,
                permissions: user.permissions,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.location = req.body.location || user.location;
            user.avatar = req.body.avatar || user.avatar;

            // Instructor specific
            if (user.role === 'instructor') {
                user.instructorBio = req.body.instructorBio || user.instructorBio;
                user.instructorTitle = req.body.instructorTitle || user.instructorTitle;
                user.expertise = req.body.expertise || user.expertise;
                if (req.body.payoutSettings) {
                    user.payoutSettings = {
                        ...user.payoutSettings,
                        ...req.body.payoutSettings
                    };
                }
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                location: updatedUser.location,
                instructorBio: updatedUser.instructorBio,
                instructorTitle: updatedUser.instructorTitle,
                expertise: updatedUser.expertise,
                payoutSettings: updatedUser.payoutSettings,
                adminLevel: updatedUser.adminLevel,
                permissions: updatedUser.permissions
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };
