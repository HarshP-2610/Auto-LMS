const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { handleStreakOnLogin } = require('../utils/xpSystem');

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
    const { email, password, role: requiredRole } = req.body;

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

        // Check if role matches requiredRole (if provided)
        if (requiredRole && user.role !== requiredRole) {
            let message = `You are not authorized to login here.`;
            if (user.role === 'admin') message = "Admin Not Login Here Go to Admin Login";
            else if (user.role === 'instructor') message = "Instructor Not Login Here Go to Instructor Login";
            else if (user.role === 'student') message = "Student Not Login Here Go to Student Login";

            return res.status(403).json({ message });
        }

        // Handle Streak and Daily XP
        let gamification = null;
        if (user.role === 'student' || user.role === 'user') {
            gamification = await handleStreakOnLogin(user);
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            adminLevel: user.adminLevel,
            gamification,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a student specifically
// @route   POST /api/auth/student-login
// @access  Public
const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'student' }).select('+password');
        if (!user) {
            // Check if user exists with other role for better message
            const otherUser = await User.findOne({ email });
            if (otherUser) {
                let message = "You are not a student.";
                if (otherUser.role === 'admin') message = "Admin Not Login Here Go to Admin Login";
                else if (otherUser.role === 'instructor') message = "Instructor Not Login Here Go to Instructor Login";
                return res.status(403).json({ message });
            }
            return res.status(401).json({ message: 'Invalid Email' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect Password' });

        // Handle Streak and Daily XP
        const gamification = await handleStreakOnLogin(user);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            gamification,
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

        // 1. Check if they exist as an instructor
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

        // Check if user exists with other role
        const otherUser = await User.findOne({ email });
        if (otherUser) {
            let message = "You are not an instructor.";
            if (otherUser.role === 'admin') message = "Admin Not Login Here Go to Admin Login";
            else if (otherUser.role === 'student') message = "Student Not Login Here Go to Student Login";
            return res.status(403).json({ message });
        }

        // 2. Check if they are in pending applications
        const pendingApp = await InstructorApplication.findOne({ email }).select('+password');
        if (pendingApp) {
            const isMatch = await pendingApp.matchPassword(password);
            if (!isMatch) return res.status(401).json({ message: 'Incorrect Password' });
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

// @desc    Authenticate an admin specifically
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'admin' }).select('+password');
        if (!user) {
            const otherUser = await User.findOne({ email });
            if (otherUser) {
                let message = "You are not an administrator.";
                if (otherUser.role === 'instructor') message = "Instructor Not Login Here Go to Instructor Login";
                else if (otherUser.role === 'student') message = "Student Not Login Here Go to Student Login";
                return res.status(403).json({ message });
            }
            return res.status(401).json({ message: 'Invalid Email' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect Password' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, studentLogin, instructorLogin, adminLogin };
