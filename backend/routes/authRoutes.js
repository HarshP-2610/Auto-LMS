const express = require('express');
const router = express.Router();
const { registerUser, loginUser, studentLogin, instructorLogin, adminLogin } = require('../controllers/authController');

const passport = require('passport');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/student-login', studentLogin);
router.post('/instructor-login', instructorLogin);
router.post('/admin-login', adminLogin);

// ==========================================
// Google OAuth Routes
// ==========================================
// Trigger Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=auth_failed' }),
    (req, res) => {
        // Successful authentication
        const token = generateToken(req.user._id);
        
        // Redirect back to frontend
        res.redirect(`http://localhost:5173/auth-success?token=${token}`);
    }
);

module.exports = router;
