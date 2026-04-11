const mongoose = require('mongoose');

const completedExtraQuizSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'ExtraQuiz', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    extraXPAwarded: { type: Number, default: 0 },
    answers: [{
        questionId: String,
        selectedOption: Number,
        isCorrect: Boolean
    }]
}, { timestamps: true });

module.exports = mongoose.model('CompletedExtraQuiz', completedExtraQuizSchema);
