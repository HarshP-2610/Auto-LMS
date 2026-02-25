const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    skills: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    difficulty: {
        type: String,
        required: [true, 'Please add a difficulty level'],
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0,
    },
    duration: {
        type: String,
        required: [true, 'Please add course duration'],
    },
    lessonsCount: {
        type: Number,
        default: 0,
    },
    thumbnail: {
        type: String,
        default: 'no-image.jpg',
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'published', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', courseSchema);
