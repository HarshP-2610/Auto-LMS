const express = require('express');
const router = express.Router();
const {
    registerInstructorApp,
    getInstructorApp,
    updateInstructorApp
} = require('../controllers/instructorApplicationController');
const { protectApp } = require('../middleware/instructorApplicationAuth');

// Public route -> register (Draft)
router.post('/register', registerInstructorApp);

// Protected routes -> get draft and complete profile
router.route('/me')
    .get(protectApp, getInstructorApp)
    .put(protectApp, updateInstructorApp);

module.exports = router;
