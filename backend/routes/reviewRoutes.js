const express = require('express');
const router = express.Router();
const { createReview, getCourseReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/reviews — create a review (must be logged in + enrolled)
router.post('/', protect, createReview);

// GET /api/reviews/:courseId — get all reviews for a course (public)
router.get('/:courseId', getCourseReviews);

module.exports = router;
