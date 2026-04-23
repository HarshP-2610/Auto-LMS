const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'upi']
    },
    status: {
        type: String,
        default: 'completed',
        enum: ['pending', 'completed', 'failed']
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentDetails: {
        cardHolderName: String,
        lastFourDigits: String,
        upiId: String
    }
}, {
    timestamps: true
});

paymentSchema.index({ student: 1 });
paymentSchema.index({ course: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
