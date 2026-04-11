const express = require('express');
const router = express.Router();
const extraQuizController = require('../controllers/extraQuizController');
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', extraQuizController.getExtraQuizzes);
router.get('/completed/my-quizzes', extraQuizController.getCompletedExtraQuizzes);
router.post('/', instructorOrAdmin, extraQuizController.createExtraQuiz);
router.post('/submit', extraQuizController.submitExtraQuiz);
router.get('/:id', extraQuizController.getExtraQuizDetails);
router.put('/:id', instructorOrAdmin, extraQuizController.updateExtraQuiz);
router.delete('/:id', instructorOrAdmin, extraQuizController.deleteExtraQuiz);

module.exports = router;
