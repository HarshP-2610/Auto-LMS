const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true }
});

const extraQuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number, required: true, default: 15 },
    passingMarks: { type: Number, required: true, default: 70 },
    extraXP: { type: Number, required: true, default: 50 },
    questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('ExtraQuiz', extraQuizSchema);
