const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const User = require('../models/User');
const Payment = require('../models/Payment');
const fs = require('fs');
const path = require('path');

// Helper: Calculate course duration from all topic durations
const calculateCourseDuration = async (courseId) => {
    const lessons = await Lesson.find({ course: courseId });
    const lessonIds = lessons.map(l => l._id);
    const topics = await Topic.find({ lesson: { $in: lessonIds } });

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

    if (totalMinutes <= 0) return '0m';
    if (totalMinutes >= 60) {
        const h = Math.floor(totalMinutes / 60);
        const m = Math.round(totalMinutes % 60);
        return m > 0 ? `${h} Hr ${m}m` : `${h} Hr`;
    }
    return `${Math.round(totalMinutes)}m`;
};

// Helper: Enrich an array of courses with calculated duration and lesson count
const enrichCoursesWithDuration = async (courses) => {
    return Promise.all(courses.map(async (course) => {
        const courseObj = course.toObject ? course.toObject() : { ...course };
        const lessons = await Lesson.find({ course: courseObj._id });
        courseObj.duration = await calculateCourseDuration(courseObj._id);
        courseObj.lessonsCount = lessons.length;
        return courseObj;
    }));
};

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
            duration: '0m',
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
        const enrichedCourses = await enrichCoursesWithDuration(courses);
        res.status(200).json({ success: true, data: enrichedCourses });
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
        
        // Auto-calculate duration for each course from topics
        const coursesWithDuration = await Promise.all(courses.map(async (course) => {
            const lessons = await Lesson.find({ course: course._id });
            const calculatedDuration = await calculateCourseDuration(course._id);
            const courseObj = course.toObject();
            courseObj.duration = calculatedDuration;
            courseObj.lessonsCount = lessons.length;
            return courseObj;
        }));
        
        res.status(200).json({ success: true, data: coursesWithDuration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name avatar');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lessons = await Lesson.find({ course: course._id });
        const calculatedDuration = await calculateCourseDuration(course._id);

        const courseData = course.toObject();
        courseData.lessonsCount = lessons.length;
        courseData.duration = calculatedDuration;
        res.status(200).json({ success: true, data: courseData });
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
        const randomCourses = await Course.aggregate([
            { $match: { status: 'published' } },
            { $sample: { size: 3 } }
        ]);

        // Populate instructor after aggregate
        const populatedCourses = await Course.populate(randomCourses, { path: 'instructor', select: 'name avatar' });
        const enrichedCourses = await enrichCoursesWithDuration(populatedCourses);

        res.status(200).json({ success: true, data: enrichedCourses });
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

// @desc    Get detailed student progress for a specific student (For Instructor)
// @route   GET /api/courses/instructor/students/:studentId
// @access  Private (Instructor)
const getStudentDetailsForInstructor = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const instructorId = req.user._id;

        // 1. Get the student
        const student = await User.findById(studentId).select('name email avatar enrolledCourses');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // 2. Get all courses taught by this instructor
        const myCourses = await Course.find({ instructor: instructorId });
        const myCourseIds = myCourses.map(c => c._id.toString());

        // 3. Filter student's enrolled courses to only those taught by this instructor
        const relevantCourseIds = student.enrolledCourses.filter(id => myCourseIds.includes(id.toString()));

        const Progress = require('../models/Progress');
        const CompletedQuiz = require('../models/CompletedQuiz');
        const Lesson = require('../models/Lesson');
        const Topic = require('../models/Topic');
        const Quiz = require('../models/Quiz');

        // 4. Fetch details for each relevant course
        const detailedProgress = await Promise.all(relevantCourseIds.map(async (courseId) => {
            const course = await Course.findById(courseId).select('title thumbnail category');
            const progress = await Progress.findOne({ user: studentId, course: courseId });
            
            // Get all lessons and topics for this course
            const lessons = await Lesson.find({ course: courseId }).sort('order');
            const lessonIds = lessons.map(l => l._id);
            const topics = await Topic.find({ lesson: { $in: lessonIds } }).sort('order');

            // Map topics to their lessons and mark completion
            const curriculum = lessons.map(lesson => {
                const lessonTopics = topics.filter(t => t.lesson.toString() === lesson._id.toString());
                return {
                    id: lesson._id,
                    title: lesson.title,
                    topics: lessonTopics.map(topic => ({
                        id: topic._id,
                        title: topic.title,
                        duration: topic.duration,
                        isCompleted: progress ? progress.completedTopics.includes(topic._id) : false
                    }))
                };
            });

            // Get all completed quizzes for this course
            const completedQuizzes = await CompletedQuiz.find({
                user: studentId,
                course: courseId
            }).populate('quiz', 'title isExtraQuiz');

            return {
                id: course._id,
                title: course.title,
                thumbnail: course.thumbnail,
                category: course.category,
                percentComplete: progress ? progress.percentComplete : 0,
                isCompleted: progress ? progress.isCompleted : false,
                curriculum,
                completedQuizzes: completedQuizzes.map(q => ({
                    quizTitle: q.quiz?.title,
                    isExtraQuiz: q.quiz?.isExtraQuiz,
                    score: q.score,
                    passed: q.passed,
                    date: q.completedAt,
                    totalQuestions: q.totalQuestions,
                    correctAnswers: q.correctAnswers
                }))
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    avatar: student.avatar
                },
                courses: detailedProgress
            }
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
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

        const enrichedCourses = await enrichCoursesWithDuration(courses);

        res.status(200).json({
            success: true,
            count: enrichedCourses.length,
            data: enrichedCourses
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
    getStudentDetailsForInstructor,
    searchCourses
};

