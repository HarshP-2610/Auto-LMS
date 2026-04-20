const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getContacts,
    getMessages,
    sendMessage
} = require('../controllers/messageController');

router.get('/contacts', protect, getContacts);
router.post('/send', protect, sendMessage);
router.get('/:otherUserId', protect, getMessages);

module.exports = router;
