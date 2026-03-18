const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getMyCourses,
    getCourse,
    deleteCourse,
    updateCourse,
    getPopularCourses,
    enrollCourse,
    getInstructorStudents,
    searchCourses
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchCourses);
router.get('/popular', getPopularCourses);
router.get('/my-courses', protect, getMyCourses);
router.get('/instructor/students', protect, getInstructorStudents);


router.route('/')
    .get(getCourses)
    .post(protect, createCourse);

router.route('/:id/enroll')
    .post(protect, enrollCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);


module.exports = router;
