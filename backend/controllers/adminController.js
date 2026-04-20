const InstructorApplication = require('../models/InstructorApplication');
const RejectedApplication = require('../models/RejectedApplication');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get all pending applications
// @route   GET /api/admin/pending-instructors
// @access  Private/Admin
const getPendingInstructors = async (req, res) => {
    try {
        const applications = await InstructorApplication.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve an instructor application
// @route   PUT /api/admin/pending-instructors/:id/approve
// @access  Private/Admin
const approveInstructor = async (req, res) => {
    try {
        const application = await InstructorApplication.findById(req.params.id).select('+password');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: application.email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create the user in the User collection (Instructors)
        const newUser = {
            name: application.name,
            email: application.email,
            password: application.password,
            phone: application.phone,
            address: 'Not Provided',
            role: 'instructor',
            instructorBio: application.bio,
            isActive: true
        };

        await User.collection.insertOne(newUser);

        // Update application status to approved
        application.status = 'approved';
        await application.save();

        res.status(200).json({ message: 'Instructor approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject an instructor application
// @route   PUT /api/admin/pending-instructors/:id/reject
// @access  Private/Admin
const rejectInstructor = async (req, res) => {
    try {
        const application = await InstructorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Move to rejectedApplications
        await RejectedApplication.create({
            _id: application._id,
            name: application.name,
            phone: application.phone,
            email: application.email,
            subject: application.subject,
            educationalDetails: application.educationalDetails,
            workExperience: application.workExperience,
            areaOfExpertise: application.areaOfExpertise,
            bio: application.bio,
            status: 'rejected'
        });

        // Remove from applications
        await InstructorApplication.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Instructor rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending courses
// @route   GET /api/admin/pending-courses
// @access  Private/Admin
const getPendingCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: 'pending' }).populate('instructor', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a course
// @route   PUT /api/admin/pending-courses/:id/approve
// @access  Private/Admin
const approveCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'published';
        await course.save();

        res.status(200).json({ message: 'Course approved and published successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a course
// @route   PUT /api/admin/pending-courses/:id/reject
// @access  Private/Admin
const rejectCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.status = 'rejected';
        await course.save();

        res.status(200).json({ message: 'Course rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (students and instructors)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['student', 'instructor'] } }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (students and instructors)
// @route   GET /api/admin/courses-all
// @access  Private/Admin
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructor', 'name email').sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get notifications for admin (pending requests)
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAdminNotifications = async (req, res) => {
    try {
        const pendingApplications = await InstructorApplication.find({ status: 'pending' }).select('name email createdAt');
        const pendingCourses = await Course.find({ status: 'pending' }).populate('instructor', 'name').select('title instructor createdAt');

        const notifications = [
            ...pendingApplications.map(app => ({
                id: app._id,
                type: 'instructor_application',
                message: `New instructor application from ${app.name}`,
                time: app.createdAt,
                link: '/admin/pending-instructors'
            })),
            ...pendingCourses.map(course => ({
                id: course._id,
                type: 'course_approval',
                message: `New course submission: ${course.title}`,
                time: course.createdAt,
                link: '/admin/courses'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get full course details including lessons, topics and quizzes
// @route   GET /api/admin/courses/:id/full-details
// @access  Private/Admin
const getFullCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const Lesson = require('../models/Lesson');
        const Topic = require('../models/Topic');
        const Quiz = require('../models/Quiz');

        // Get all lessons
        const lessons = await Lesson.find({ course: req.params.id }).sort('order');
        
        // Get all topics for these lessons
        const lessonIds = lessons.map(l => l._id);
        const topics = await Topic.find({ lesson: { $in: lessonIds } }).sort('order');

        // Group topics by lesson
        const lessonsWithTopics = lessons.map(lesson => {
            return {
                ...lesson.toObject(),
                topics: topics.filter(t => t.lesson.toString() === lesson._id.toString())
            };
        });

        // Get all quizzes
        const quizzes = await Quiz.find({ course: req.params.id });

        res.status(200).json({
            course,
            curriculum: lessonsWithTopics,
            quizzes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comprehensive details for a student
// @route   GET /api/admin/users/:id/full-details
// @access  Private/Admin
const getStudentFullDetails = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await User.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const Progress = require('../models/Progress');
        const CompletedQuiz = require('../models/CompletedQuiz');
        const Payment = require('../models/Payment');
        const Message = require('../models/Message');

        // 1. Get all courses this student is enrolled in
        const enrolledCourses = await Course.find({ _id: { $in: student.enrolledCourses } })
            .populate('instructor', 'name email avatar');

        // 2. Fetch progress and quizzes for each course
        const progressData = await Promise.all(enrolledCourses.map(async (course) => {
            const progress = await Progress.findOne({ user: studentId, course: course._id });
            const completedQuizzes = await CompletedQuiz.find({
                user: studentId,
                course: course._id
            }).populate('quiz', 'title isFinalAssessment');

            return {
                courseId: course._id,
                courseTitle: course.title,
                instructor: course.instructor,
                percentComplete: progress ? progress.percentComplete : 0,
                isCompleted: progress ? progress.isCompleted : false,
                completionDate: progress ? progress.completionDate : null,
                quizzes: completedQuizzes.map(q => ({
                    quizId: q.quiz?._id,
                    quizTitle: q.quiz?.title,
                    isFinal: q.quiz?.isFinalAssessment,
                    score: q.score,
                    passed: q.passed,
                    completedAt: q.completedAt
                }))
            };
        }));

        // 3. Fetch Payment History
        const payments = await Payment.find({ student: studentId })
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        // 4. Fetch Instructors contacted via Messages
        // Find all unique users this student has messaged or received messages from
        const messages = await Message.find({
            $or: [
                { sender: studentId },
                { receiver: studentId }
            ]
        });

        const contactedUserIds = [...new Set(messages.map(m => 
            m.sender.toString() === studentId.toString() ? m.receiver.toString() : m.sender.toString()
        ))];

        const contactedInstructors = await User.find({
            _id: { $in: contactedUserIds },
            role: 'instructor'
        }).select('name email avatar');

        res.status(200).json({
            personalDetails: {
                _id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                address: student.address,
                avatar: student.avatar,
                createdAt: student.createdAt,
                isActive: student.isActive
            },
            learningProgress: progressData,
            paymentHistory: payments,
            contactedInstructors: contactedInstructors
        });
    } catch (error) {
        console.error('Error fetching student full details:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getPendingCourses,
    approveCourse,
    rejectCourse,
    getAllUsers,
    toggleUserStatus,
    getAllCourses,
    deleteCourse,
    getAdminNotifications,
    deleteUser,
    getFullCourseDetails,
    getStudentFullDetails
};
