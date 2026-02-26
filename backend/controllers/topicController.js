const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Add topic to lesson
// @route   POST /api/topics
// @access  Private (Instructor)
const addTopic = async (req, res) => {
    try {
        const { lesson: lessonId, title, description, videoUrl, duration } = req.body;

        const lesson = await Lesson.findById(lessonId).populate('course');

        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        // Check ownership via course
        if (lesson.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to add topics to this lesson' });
        }

        const topic = await Topic.create({
            lesson: lessonId,
            title,
            description,
            videoUrl,
            duration,
        });

        res.status(201).json({
            success: true,
            data: topic
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get topics for a lesson
// @route   GET /api/topics/lesson/:lessonId
// @access  Public
const getLessonTopics = async (req, res) => {
    try {
        const topics = await Topic.find({ lesson: req.params.lessonId }).sort('order');
        res.status(200).json({ success: true, data: topics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private (Instructor)
const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id).populate({
            path: 'lesson',
            populate: { path: 'course' }
        });

        if (!topic) {
            return res.status(404).json({ success: false, message: 'Topic not found' });
        }

        // Check ownership
        if (topic.lesson.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this topic' });
        }

        await Topic.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Topic removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addTopic,
    getLessonTopics,
    deleteTopic
};
