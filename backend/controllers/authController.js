const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_autolms', {
        expiresIn: '30d',
    });
};

// @desc    Register new user (Student, Instructor, User)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;

    try {
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: 'Please add all fields including mobile and address' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default role is 'student' if not provided, or validating role
        const assignedRole = ['student', 'instructor'].includes(role) ? role : 'student';

        // Create user. The User model's pre('save') hook will hash the password.
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            role: assignedRole,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (handles Admin, Student, Instructor)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid Email' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            adminLevel: user.adminLevel,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate an instructor specifically
// @route   POST /api/auth/instructor-login
// @access  Public
const instructorLogin = async (req, res) => {
    const { email, password } = req.body;
    const InstructorApplication = require('../models/InstructorApplication');
    const RejectedApplication = require('../models/RejectedApplication');

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 1. Check if they exist in instructors collection (User model with role instructor)
        const user = await User.findOne({ email, role: 'instructor' }).select('+password');

        if (user) {
            const isMatch = await user.matchPassword(password);
            if (isMatch) {
                return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                });
            } else {
                return res.status(401).json({ message: 'Incorrect Password' });
            }
        }

        // 2. Check if they are in pending applications
        const pendingApp = await InstructorApplication.findOne({ email }).select('+password');
        if (pendingApp) {
            // Check password just in case, but really any pending means under review
            const isMatch = await pendingApp.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect Password' });
            }
            return res.status(403).json({ message: 'Your application is under review.' });
        }

        // 3. Check if they are in rejected applications
        const rejectedApp = await RejectedApplication.findOne({ email });
        if (rejectedApp) {
            return res.status(403).json({ message: 'Your application was rejected.' });
        }

        return res.status(401).json({ message: 'Invalid Email or you are not an instructor.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, instructorLogin };
