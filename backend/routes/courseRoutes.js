const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getMyCourses
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, createCourse);

router.get('/my-courses', protect, getMyCourses);

module.exports = router;
