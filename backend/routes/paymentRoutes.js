const express = require('express');
const router = express.Router();
const { getMyTransactions } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-transactions', protect, getMyTransactions);

module.exports = router;
