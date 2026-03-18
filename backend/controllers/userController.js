const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'enrolledCourses',
                select: 'title thumbnail category difficulty duration instructor lessonsCount status',
                populate: {
                    path: 'instructor',
                    select: 'name avatar'
                }
            })
            .populate({
                path: 'wishlist',
                select: 'title thumbnail category difficulty duration instructor lessonsCount price status',
                populate: {
                    path: 'instructor',
                    select: 'name avatar'
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for any dead references in enrolledCourses (courses that return null after populate)
        const initialEnrolledCount = user.enrolledCourses.length;
        const validEnrolledCourses = user.enrolledCourses.filter(c => c !== null);

        // If we found dead references, clean up the user document in the background (or here)
        if (validEnrolledCourses.length !== initialEnrolledCount) {
            user.enrolledCourses = validEnrolledCourses.map(c => c._id);
            await user.save();
            console.log(`Cleaned up ${initialEnrolledCount - validEnrolledCourses.length} dead course references for user ${user.name}`);
        }

        // Clean up wishlist dead references
        const initialWishlistCount = user.wishlist.length;
        const validWishlistCourses = user.wishlist.filter(c => c !== null);
        if (validWishlistCourses.length !== initialWishlistCount) {
            user.wishlist = validWishlistCourses.map(c => c._id);
            await user.save();
            console.log(`Cleaned up ${initialWishlistCount - validWishlistCourses.length} dead wishlist references for user ${user.name}`);
        }

        // Fetch progress from separate Progress model
        const Progress = require('../models/Progress');
        const userProgress = await Progress.find({ user: req.user._id })
            .populate('course', 'title thumbnail category instructor');

        // Filter out progress records for deleted courses
        const filteredProgress = (userProgress || []).filter(p => p && p.course !== null);

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
            enrolledCourses: validEnrolledCourses,
            wishlist: validWishlistCourses,
            progress: filteredProgress,
            certificates: user.certificates || [],
            taughtCourses: user.taughtCourses || [],
            rating: user.rating,
            numReviews: user.numReviews,
            earnings: user.earnings,
            adminLevel: user.adminLevel,
            permissions: user.permissions,
            createdAt: user.createdAt,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            badges: user.badges
        });
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

// @desc    Add course to wishlist
// @route   POST /api/users/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.wishlist.includes(courseId)) {
            return res.status(400).json({ message: 'Course already in wishlist' });
        }

        user.wishlist.push(courseId);
        await user.save();

        res.json({ message: 'Course added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove course from wishlist
// @route   DELETE /api/users/wishlist/remove/:courseId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
        await user.save();

        res.json({ message: 'Course removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, addToWishlist, removeFromWishlist };
