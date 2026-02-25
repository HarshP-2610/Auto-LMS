const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const instructorApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
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
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Hash password before saving
instructorApplicationSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
instructorApplicationSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('InstructorApplication', instructorApplicationSchema, 'instructorApplications');
