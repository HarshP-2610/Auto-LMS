const Course = require('../models/Course');

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor)
const createCourse = async (req, res) => {
    try {
        console.log('Course creation attempt:', req.body);
        console.log('User from token:', req.user._id);

        // req.user is added by the protect middleware
        const { title, description, skills, category, difficulty, price, duration, thumbnail } = req.body;

        const course = await Course.create({
            title,
            description,
            skills: Array.isArray(skills) ? (skills.length > 0 ? skills : []) : (skills ? skills.split(',').map(s => s.trim()) : []),
            category,
            difficulty,
            price: Number(price) || 0,
            duration,
            thumbnail: thumbnail || 'no-image.jpg',
            instructor: req.user._id,
        });

        console.log('Course created successfully:', course._id);
        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Course creation error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all courses (with filters)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'published' }).populate('instructor', 'name');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor)
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        console.log('Fetching course with ID:', req.params.id);
        const course = await Course.findById(req.params.id).populate('instructor', 'name avatar');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this course' });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor)
const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this course' });
        }

        const { title, description, skills, category, difficulty, price, duration, thumbnail } = req.body;

        course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
                category,
                difficulty,
                price: Number(price) || 0,
                duration,
                thumbnail,
                status: 'pending' // Reset status to pending after edit for review
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getMyCourses,
    getCourse,
    deleteCourse,
    updateCourse
};
