const Quiz = require('../models/Quiz');

exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ instructor: req.user._id }).populate('course', 'title');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
};

exports.getQuizDetails = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id, instructor: req.user._id }).populate('course', 'title');
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

exports.deleteQuiz = async (req, res) => {
    try {
        const deletedQuiz = await Quiz.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
        if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
};
