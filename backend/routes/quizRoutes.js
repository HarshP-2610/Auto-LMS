const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', quizController.getQuizzes);
router.post('/', instructorOrAdmin, quizController.createQuiz);
router.post('/submit', quizController.submitQuiz);
router.get('/completed/my-quizzes', quizController.getCompletedQuizzes);
router.get('/completed/details/:id', quizController.getCompletedQuizDetails);
router.get('/:id', quizController.getQuizDetails);

router.put('/:id', instructorOrAdmin, quizController.updateQuiz);
router.delete('/:id', instructorOrAdmin, quizController.deleteQuiz);


module.exports = router;
