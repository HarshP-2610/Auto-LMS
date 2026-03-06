const Quiz = require('../models/Quiz');
const CompletedQuiz = require('../models/CompletedQuiz');


exports.getQuizzes = async (req, res) => {
    try {
        let quizzes;
        if (req.user.role === 'student') {
            const user = await require('../models/User').findById(req.user._id);
            quizzes = await Quiz.find({ course: { $in: user.enrolledCourses } }).populate('course', 'title');
        } else {
            quizzes = await Quiz.find({ instructor: req.user._id }).populate('course', 'title');
        }
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
};

exports.getQuizDetails = async (req, res) => {
    try {
        let quiz;
        if (req.user.role === 'student') {
            const user = await require('../models/User').findById(req.user._id);
            quiz = await Quiz.findOne({ _id: req.params.id, course: { $in: user.enrolledCourses } }).populate('course', 'title');
        } else {
            quiz = await Quiz.findOne({ _id: req.params.id, instructor: req.user._id }).populate('course', 'title');
        }

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz details', error });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const { title, course, duration, passingMarks, questions } = req.body;
        const newQuiz = new Quiz({
            title,
            course,
            instructor: req.user._id,
            duration: duration || 15,
            passingMarks: passingMarks || 70,
            questions: questions || []
        });

        await newQuiz.save();
        const populated = await Quiz.findById(newQuiz._id).populate('course', 'title');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        console.log(req.body);
        const updatedQuiz = await Quiz.findOneAndUpdate(
            { _id: req.params.id, instructor: req.user._id },
            { $set: req.body },
            { new: true }
        ).populate('course', 'title');
        if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quiz', error });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers: userAnswers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        const answersToSave = quiz.questions.map((q) => {
            const selectedOption = userAnswers[q._id];
            const isCorrect = selectedOption === q.correctOptionIndex;
            if (isCorrect) correctCount++;
            return {
                questionId: q._id,
                selectedOption,
                isCorrect
            };
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = score >= quiz.passingMarks;

        const completedQuiz = new CompletedQuiz({
            user: req.user._id,
            quiz: quizId,
            course: quiz.course,
            score,
            totalQuestions: quiz.questions.length,
            correctAnswers: correctCount,
            passed,
            answers: answersToSave
        });

        await completedQuiz.save();
        res.status(201).json(completedQuiz);
    } catch (error) {
        console.error('Submit Quiz Error:', error);
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
};

exports.getCompletedQuizzes = async (req, res) => {
    try {
        const completedQuizzes = await CompletedQuiz.find({ user: req.user._id })
            .populate('quiz', 'title')
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.json(completedQuizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed quizzes', error });
    }
};

exports.getCompletedQuizDetails = async (req, res) => {
    try {
        const completedQuiz = await CompletedQuiz.findOne({ _id: req.params.id, user: req.user._id })
            .populate('quiz')
            .populate('course', 'title');

        if (!completedQuiz) return res.status(404).json({ message: 'Result not found' });
        res.json(completedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error });
    }
};



exports.deleteQuiz = async (req, res) => {
    try {
        const deletedQuiz = await Quiz.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
        if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
};

