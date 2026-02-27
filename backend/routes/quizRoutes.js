const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(instructorOrAdmin);

router.get('/', quizController.getQuizzes);
router.post('/', quizController.createQuiz);
router.get('/:id', quizController.getQuizDetails);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;
