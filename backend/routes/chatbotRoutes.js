const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getChatbotResponse } = require('../controllers/chatbotController');

// Rate limiting for chatbot: 20 requests per minute per IP
const chatbotLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        message: 'Too many requests, please try again in a minute.'
    }
});

router.post('/', chatbotLimiter, getChatbotResponse);

module.exports = router;
