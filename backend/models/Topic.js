const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    lesson: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a topic title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a topic description'],
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL'],
    },
    duration: {
        type: String,
        required: [true, 'Please add topic duration'],
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

module.exports = mongoose.model('Topic', topicSchema);
