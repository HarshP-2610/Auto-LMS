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
    deleteUser
};
