const express = require('express');
const router = express.Router();
const {
    markTopicComplete,
    getCourseProgress,
    getMyProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/mark-complete', markTopicComplete);
router.get('/my-progress', getMyProgress);
router.get('/course/:courseId', getCourseProgress);

module.exports = router;
