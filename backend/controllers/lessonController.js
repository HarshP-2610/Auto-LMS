const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Topic = require('../models/Topic');

// @desc    Add lesson to course
// @route   POST /api/lessons
// @access  Private (Instructor)
const addLesson = async (req, res) => {
    try {
        const { course: courseId, title, description } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check ownership
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to add lessons to this course' });
        }

        const lesson = await Lesson.create({
            course: courseId,
            title,
            description,
        });

        // Update course lesson count (assuming lesson count now counts lessons, not individual topics)
        course.lessonsCount = (course.lessonsCount || 0) + 1;
        await course.save();

        res.status(201).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
const getCourseLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
        
        // For each lesson, fetch the count of topics and calculate total duration
        const lessonsWithStats = await Promise.all(lessons.map(async (lesson) => {
            const topics = await Topic.find({ lesson: lesson._id });
            const topicsCount = topics.length;

            // Calculate total duration
            let totalMinutes = 0;
            topics.forEach(topic => {
                const dur = topic.duration || '0';
                if (dur.includes(':')) {
                    const parts = dur.split(':');
                    if (parts.length === 2) {
                        totalMinutes += parseInt(parts[0]) + (parseInt(parts[1]) / 60);
                    } else if (parts.length === 3) {
                        totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]) + (parseInt(parts[2]) / 60);
                    }
                } else {
                    const mins = parseInt(dur);
                    if (!isNaN(mins)) totalMinutes += mins;
                }
            });

            // Format duration string
            let durationStr = '0m';
            if (totalMinutes > 0) {
                if (totalMinutes >= 60) {
                    const h = Math.floor(totalMinutes / 60);
                    const m = Math.round(totalMinutes % 60);
                    durationStr = m > 0 ? `${h}h ${m}m` : `${h}h`;
                } else {
                    durationStr = `${Math.round(totalMinutes)}m`;
                }
            }

            return {
                ...lesson.toObject(),
                topicsCount,
                duration: durationStr
            };
        }));

        res.status(200).json({ success: true, data: lessonsWithStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor)
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);

        // Check ownership
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this lesson' });
        }

        // Delete all topics in this lesson
        await Topic.deleteMany({ lesson: req.params.id });

        await Lesson.findByIdAndDelete(req.params.id);

        // Update course lesson count
        course.lessonsCount = Math.max(0, (course.lessonsCount || 0) - 1);
        await course.save();

        res.status(200).json({ success: true, message: 'Lesson and its topics removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor)
const updateLesson = async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        const course = await Course.findById(lesson.course);

        // Check ownership
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this lesson' });
        }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addLesson,
    getCourseLessons,
    deleteLesson,
    updateLesson
};
