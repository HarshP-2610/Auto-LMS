const express = require('express');
const router = express.Router();
const {
    addLesson,
    getCourseLessons,
    deleteLesson
} = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addLesson);

router.get('/course/:courseId', getCourseLessons);

router.route('/:id')
    .delete(protect, deleteLesson);

module.exports = router;
