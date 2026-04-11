const ExtraQuiz = require('../models/ExtraQuiz');
const { awardXP } = require('../utils/xpSystem');

exports.getExtraQuizzes = async (req, res) => {
    try {
        let extraQuizzes;
        const { courseId } = req.query;
        if (req.user.role === 'student') {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);
            const query = { course: { $in: user.enrolledCourses } };
            if (courseId) query.course = courseId;
            extraQuizzes = await ExtraQuiz.find(query).populate('course', 'title');
        } else {
            const query = { instructor: req.user._id };
            if (courseId) query.course = courseId;
            extraQuizzes = await ExtraQuiz.find(query).populate('course', 'title');
        }
        res.json(extraQuizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching extra quizzes', error });
    }
};

exports.getExtraQuizDetails = async (req, res) => {
    try {
        let extraQuiz;
        if (req.user.role === 'student') {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);
            extraQuiz = await ExtraQuiz.findOne({ _id: req.params.id, course: { $in: user.enrolledCourses } }).populate('course', 'title');
        } else {
            extraQuiz = await ExtraQuiz.findOne({ _id: req.params.id, instructor: req.user._id }).populate('course', 'title');
        }

        if (!extraQuiz) return res.status(404).json({ message: 'Extra Quiz not found' });
        res.json(extraQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching extra quiz details', error });
    }
};

exports.createExtraQuiz = async (req, res) => {
    try {
        const { title, course, duration, passingMarks, extraXP, questions } = req.body;
        const newExtraQuiz = new ExtraQuiz({
            title,
            course,
            instructor: req.user._id,
            duration: duration || 15,
            passingMarks: passingMarks || 70,
            extraXP: extraXP || 50,
            questions: questions || []
        });

        await newExtraQuiz.save();
        const populated = await ExtraQuiz.findById(newExtraQuiz._id).populate('course', 'title');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Error creating extra quiz', error });
    }
};

exports.updateExtraQuiz = async (req, res) => {
    try {
        const updatedExtraQuiz = await ExtraQuiz.findOneAndUpdate(
            { _id: req.params.id, instructor: req.user._id },
            { $set: req.body },
            { new: true }
        ).populate('course', 'title');
        if (!updatedExtraQuiz) return res.status(404).json({ message: 'Extra Quiz not found' });
        res.json(updatedExtraQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error updating extra quiz', error });
    }
};

exports.deleteExtraQuiz = async (req, res) => {
    try {
        const deletedExtraQuiz = await ExtraQuiz.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
        if (!deletedExtraQuiz) return res.status(404).json({ message: 'Extra Quiz not found' });
        res.json({ message: 'Extra Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting extra quiz', error });
    }
};

exports.submitExtraQuiz = async (req, res) => {
    try {
        const { quizId, answers: userAnswers } = req.body;
        const extraQuiz = await ExtraQuiz.findById(quizId);
        if (!extraQuiz) return res.status(404).json({ message: 'Extra Quiz not found' });

        let correctCount = 0;
        const answersToSave = extraQuiz.questions.map((q) => {
            const selectedOption = userAnswers[q._id];
            const isCorrect = selectedOption === q.correctOptionIndex;
            if (isCorrect) correctCount++;
            return {
                questionId: q._id,
                selectedOption,
                isCorrect
            };
        });

        const score = Math.round((correctCount / extraQuiz.questions.length) * 100);
        const passed = score >= extraQuiz.passingMarks;

        // Award extra XP if passed
        let gamification = null;
        let extraXPAwarded = 0;
        if (passed) {
            extraXPAwarded = extraQuiz.extraXP;
            gamification = await awardXP(req.user._id, extraXPAwarded);
        }

        const CompletedExtraQuiz = require('../models/CompletedExtraQuiz');
        const completedExtraQuiz = new CompletedExtraQuiz({
            user: req.user._id,
            quiz: quizId,
            course: extraQuiz.course,
            score,
            totalQuestions: extraQuiz.questions.length,
            correctAnswers: correctCount,
            passed,
            extraXPAwarded,
            answers: answersToSave
        });

        await completedExtraQuiz.save();

        res.status(200).json({
            _id: completedExtraQuiz._id,
            score,
            passed,
            extraXP: extraXPAwarded,
            gamification
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting extra quiz', error: error.message });
    }
};

exports.getCompletedExtraQuizzes = async (req, res) => {
    try {
        const CompletedExtraQuiz = require('../models/CompletedExtraQuiz');
        const completedQuizzes = await CompletedExtraQuiz.find({ user: req.user._id })
            .populate('quiz', 'title')
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.json(completedQuizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed extra quizzes', error });
    }
};
