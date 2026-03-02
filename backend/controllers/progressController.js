const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Topic = require('../models/Topic');

// @desc    Update progress (Mark topic as complete)
// @route   POST /api/progress/mark-complete
// @access  Private (Student)
const markTopicComplete = async (req, res) => {
    try {
        const { courseId, topicId } = req.body;

        // Find or create progress for this user/course
        let progress = await Progress.findOne({ user: req.user._id, course: courseId });

        if (!progress) {
            progress = await Progress.create({
                user: req.user._id,
                course: courseId,
                completedTopics: []
            });
        }

        // Add topic to completed if not already there
        if (!progress.completedTopics.includes(topicId)) {
            progress.completedTopics.push(topicId);
        }

        progress.lastTopic = topicId;

        // Calculate percentage
        // Need to count total topics in course
        // First get all lessons in course
        const Lesson = require('../models/Lesson');
        const lessons = await Lesson.find({ course: courseId });
        const lessonIds = lessons.map(l => l._id);

        // Count all topics in those lessons
        const totalTopics = await Topic.countDocuments({ lesson: { $in: lessonIds } });

        if (totalTopics > 0) {
            progress.percentComplete = Math.round((progress.completedTopics.length / totalTopics) * 100);
        }

        await progress.save();

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user progress for a course
// @route   GET /api/progress/course/:courseId
// @access  Private (Student)
const getCourseProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });

        if (!progress) {
            return res.status(200).json({
                success: true,
                data: {
                    completedTopics: [],
                    percentComplete: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all progress for a user (for dashboard)
// @route   GET /api/progress/my-progress
// @access  Private (Student)
const getMyProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id }).populate('course', 'title thumbnail');
        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    markTopicComplete,
    getCourseProgress,
    getMyProgress
};
