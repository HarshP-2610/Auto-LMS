const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    completedTopics: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    }],
    lastTopic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic'
    },
    percentComplete: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Ensure unique progress record per user per course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
