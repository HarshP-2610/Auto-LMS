const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getMyCourses,
    getCourse,
    deleteCourse,
    updateCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, createCourse);

router.get('/my-courses', protect, getMyCourses);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);


module.exports = router;
