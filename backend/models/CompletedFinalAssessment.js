const mongoose = require('mongoose');

const completedFinalAssessmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    finalAssessment: { type: mongoose.Schema.Types.ObjectId, ref: 'FinalAssessment', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    retakeCount: { type: Number, default: 0 },
    answers: [{
        questionId: { type: String, required: true },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true }
    }],
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CompletedFinalAssessment', completedFinalAssessmentSchema);
