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

module.exports = {
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getPendingCourses,
    approveCourse,
    rejectCourse
};
