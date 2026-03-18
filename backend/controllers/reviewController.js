const Review = require('../models/Review');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a review for a course
// @route   POST /api/reviews
// @access  Private (enrolled students only)
const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        // Validation
        if (!courseId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId, rating, and comment'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (comment.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Comment must be at least 5 characters'
            });
        }

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if the user is enrolled in the course
        const user = await User.findById(req.user._id);
        const isEnrolled = user.enrolledCourses.some(
            (id) => id.toString() === courseId.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to leave a review'
            });
        }

        // Check if user already reviewed this course
        const existingReview = await Review.findOne({
            user: req.user._id,
            course: courseId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }

        // Create the review
        const review = await Review.create({
            user: req.user._id,
            course: courseId,
            rating: Number(rating),
            comment: comment.trim()
        });

        // Populate user info for the response
        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        // Handle duplicate key error (user already reviewed)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }
        console.error('Create review error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all reviews for a course (with average rating)
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Get all reviews for this course, newest first
        const reviews = await Review.find({ course: courseId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = reviews.length > 0
            ? Math.round((totalRatings / reviews.length) * 10) / 10
            : 0;

        // Rating distribution (how many 5-star, 4-star, etc.)
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            averageRating,
            distribution,
            data: reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReview,
    getCourseReviews
};
