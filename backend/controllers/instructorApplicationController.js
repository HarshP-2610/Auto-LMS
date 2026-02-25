const InstructorApplication = require('../models/InstructorApplication');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_autolms', {
        expiresIn: '30d',
    });
};

// @desc    Register a draft instructor application
// @route   POST /api/instructor-applications/register
// @access  Public
const registerInstructorApp = async (req, res) => {
    const { name, phone, email, password, subject } = req.body;

    try {
        if (!name || !phone || !email || !password || !subject) {
            return res.status(400).json({ message: 'Please add all required fields.' });
        }

        // Check if application exists
        const appExists = await InstructorApplication.findOne({ email });
        if (appExists) {
            return res.status(400).json({ message: 'Instructor application with this email already exists' });
        }

        const application = await InstructorApplication.create({
            name,
            phone,
            email,
            password,
            subject,
            status: 'draft'
        });

        if (application) {
            res.status(201).json({
                _id: application._id,
                name: application.name,
                email: application.email,
                status: application.status,
                token: generateToken(application._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid application data received' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current application data (Step 2)
// @route   GET /api/instructor-applications/me
// @access  Private
const getInstructorApp = async (req, res) => {
    try {
        let application = await InstructorApplication.findById(req.appliaction._id).select('-password');
        if (!application) {
            const RejectedApplication = require('../models/RejectedApplication');
            application = await RejectedApplication.findById(req.appliaction._id).select('-password');
        }
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update draft to pending
// @route   PUT /api/instructor-applications/me
// @access  Private
const updateInstructorApp = async (req, res) => {
    const { educationalDetails, workExperience, areaOfExpertise, bio } = req.body;

    try {
        const app = await InstructorApplication.findById(req.appliaction._id);

        if (!app) {
            return res.status(404).json({ message: 'Application not found' });
        }

        app.educationalDetails = educationalDetails || app.educationalDetails;
        app.workExperience = workExperience || app.workExperience;
        app.areaOfExpertise = areaOfExpertise || app.areaOfExpertise;
        app.bio = bio || app.bio;
        app.status = 'pending';

        const updatedApp = await app.save();
        res.status(200).json({
            message: 'Application updated to pending',
            data: updatedApp
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerInstructorApp,
    getInstructorApp,
    updateInstructorApp
};
