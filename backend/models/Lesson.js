const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a lesson description'],
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Lesson', lessonSchema);
