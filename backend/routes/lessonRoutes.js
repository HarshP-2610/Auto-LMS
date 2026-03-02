const express = require('express');
const router = express.Router();
const {
    addLesson,
    getCourseLessons,
    deleteLesson,
    updateLesson
} = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addLesson);

router.get('/course/:courseId', getCourseLessons);

router.route('/:id')
    .put(protect, updateLesson)
    .delete(protect, deleteLesson);

module.exports = router;
