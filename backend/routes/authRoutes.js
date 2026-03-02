const express = require('express');
const router = express.Router();
const { registerUser, loginUser, studentLogin, instructorLogin, adminLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/student-login', studentLogin);
router.post('/instructor-login', instructorLogin);
router.post('/admin-login', adminLogin);

module.exports = router;
