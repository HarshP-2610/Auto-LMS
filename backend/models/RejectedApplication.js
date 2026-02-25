const mongoose = require('mongoose');

const rejectedApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    educationalDetails: {
        type: String,
    },
    workExperience: {
        type: Number,
    },
    areaOfExpertise: {
        type: String,
    },
    bio: {
        type: String,
    },
    status: {
        type: String,
        default: 'rejected'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RejectedApplication', rejectedApplicationSchema, 'rejectedApplications');
