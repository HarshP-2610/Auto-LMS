const Payment = require('../models/Payment');

// @desc    Get user payments
// @route   GET /api/payments/my-transactions
// @access  Private
const getMyTransactions = async (req, res) => {
    try {
        const payments = await Payment.find({ student: req.user._id })
            .populate('course', 'title thumbnail category');

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyTransactions
};
