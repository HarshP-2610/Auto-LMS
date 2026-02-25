const express = require('express');
const router = express.Router();
const { registerUser, loginUser, instructorLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/instructor-login', instructorLogin);

module.exports = router;
