const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const fs = require('fs');
const path = require('path');

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
        const courses = await Course.find({ status: 'published' }).populate('instructor', 'name avatar');
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

// @desc    Get popular courses (random 3)
// @route   GET /api/courses/popular
// @access  Public
const getPopularCourses = async (req, res) => {
    try {
        console.log('Inside getPopularCourses handler');
        // Use aggregate to get random samples if possible, or just limit
        const courses = await Course.find({ status: 'published' })
            .populate('instructor', 'name avatar')
            .limit(3);

        // If we want truly random each time we can use aggregation $sample
        // For simplicity and since there might be few courses, just limit is fine or:
        const randomCourses = await Course.aggregate([
            { $match: { status: 'published' } },
            { $sample: { size: 3 } }
        ]);

        // Need to populate instructor after aggregate
        const populatedCourses = await Course.populate(randomCourses, { path: 'instructor', select: 'name avatar' });

        res.status(200).json({ success: true, data: populatedCourses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Enroll in a course (with payment storage)
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const user = await User.findById(req.user._id);

        // Check if already enrolled
        if (user.enrolledCourses.includes(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // 1. Create payment record
        // Generate a simple unique transaction ID for now
        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const { paymentMethod, paymentDetails } = req.body;

        const paymentRecord = await Payment.create({
            student: req.user._id,
            course: req.params.id,
            amount: course.price,
            paymentMethod: paymentMethod || 'card',
            transactionId,
            paymentDetails: paymentDetails || {}
        });

        // 2. Add course to user's enrolledCourses
        user.enrolledCourses.push(req.params.id);

        // Setup initial progress record in separate Progress model
        const Progress = require('../models/Progress');
        await Progress.create({
            user: req.user._id,
            course: req.params.id,
            completedTopics: [],
            percentComplete: 0
        });

        await user.save();

        // 3. Add user to course's enrolledStudents
        course.enrolledStudents.push(req.user._id);
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled!',
            transactionId,
            payment: paymentRecord,
            course: course,
            student: {
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            }
        });
    } catch (error) {
        const errorLog = `[${new Date().toISOString()}] Enrollment error: ${error.stack}\n`;
        fs.appendFileSync(path.join(__dirname, '../error.log'), errorLog);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all students enrolled in instructor's courses
// @route   GET /api/courses/instructor/students
// @access  Private (Instructor)
const getInstructorStudents = async (req, res) => {
    try {
        const Progress = require('../models/Progress');
        const CompletedQuiz = require('../models/CompletedQuiz');

        // 1. Get all courses taught by this instructor
        const myCourses = await Course.find({ instructor: req.user._id });
        const courseIds = myCourses.map(c => c._id);

        // 2. Find all students enrolled in any of these courses
        const students = await User.find({
            role: 'student',
            enrolledCourses: { $in: courseIds }
        }).select('name email avatar enrolledCourses');

        // 3. For each student, get detailed info for instructor's courses
        const studentsData = await Promise.all(students.map(async (student) => {
            // Courses of this instructor that the student is enrolled in
            const relevantCourseIds = student.enrolledCourses.filter(id =>
                courseIds.some(cId => cId.toString() === id.toString())
            );

            const courseDetails = await Promise.all(relevantCourseIds.map(async (courseId) => {
                const course = await Course.findById(courseId).select('title');

                // Get progress for this course
                const progress = await Progress.findOne({ user: student._id, course: courseId });

                // Get completed quizzes for this course
                const completedQuizzes = await CompletedQuiz.find({
                    user: student._id,
                    course: courseId
                }).populate('quiz', 'title');

                return {
                    id: course._id,
                    title: course.title,
                    percentComplete: progress ? progress.percentComplete : 0,
                    completedQuizzes: completedQuizzes.map(q => ({
                        quizTitle: q.quiz?.title,
                        score: q.score,
                        passed: q.passed,
                        date: q.completedAt
                    }))
                };
            }));

            return {
                id: student._id,
                name: student.name,
                email: student.email,
                avatar: student.avatar,
                courses: courseDetails
            };
        }));

        res.status(200).json({ success: true, data: studentsData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search/filter courses
// @route   GET /api/courses/search
// @access  Public
const searchCourses = async (req, res) => {
    try {
        const { q, category, difficulty, priceType, minRating } = req.query;

        // Always start with published courses only
        const query = { status: 'published' };

        // Text search on title, description, and skills using regex
        if (q && q.trim()) {
            const regex = new RegExp(q.trim(), 'i');
            query.$or = [
                { title: regex },
                { description: regex },
                { skills: { $elemMatch: { $regex: regex } } }
            ];
        }

        // Category filter (case-insensitive match)
        if (category && category !== 'all') {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        // Difficulty / Level filter
        if (difficulty) {
            // Support comma-separated values like "Beginner,Intermediate"
            const levels = difficulty.split(',').map(d => d.trim());
            if (levels.length === 1) {
                query.difficulty = new RegExp(`^${levels[0]}$`, 'i');
            } else {
                query.difficulty = { $in: levels.map(l => new RegExp(`^${l}$`, 'i')) };
            }
        }

        // Price type filter
        if (priceType) {
            switch (priceType) {
                case 'free':
                    query.price = 0;
                    break;
                case 'under50':
                    query.price = { $gt: 0, $lt: 50 };
                    break;
                case '50to100':
                    query.price = { $gte: 50, $lte: 100 };
                    break;
                case 'over100':
                    query.price = { $gt: 100 };
                    break;
                case 'paid':
                    query.price = { $gt: 0 };
                    break;
                default:
                    break;
            }
        }

        let courses = await Course.find(query).populate('instructor', 'name avatar');

        // Rating filter (applied post-query since rating may not be stored on course model yet)
        if (minRating) {
            const min = parseFloat(minRating);
            if (!isNaN(min)) {
                courses = courses.filter(c => (c.rating || 0) >= min);
            }
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getMyCourses,
    getCourse,
    deleteCourse,
    updateCourse,
    getPopularCourses,
    enrollCourse,
    getInstructorStudents,
    searchCourses
};

