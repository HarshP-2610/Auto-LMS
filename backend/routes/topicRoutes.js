const express = require('express');
const router = express.Router();
const {
    addTopic,
    getLessonTopics,
    deleteTopic,
    updateTopic
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addTopic);

router.get('/lesson/:lessonId', getLessonTopics);

router.route('/:id')
    .put(protect, updateTopic)
    .delete(protect, deleteTopic);

module.exports = router;
