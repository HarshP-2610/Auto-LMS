const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    password: {
        type: String,
        required: [
            function() { return !this.googleId; },
            'Please add a password'
        ],
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin', 'user'],
        default: 'user'
    },
    phone: {
        type: String,
        required: [
            function() { return !this.googleId && this.role !== 'user'; },
            'Please add a mobile number'
        ],
        default: ''
    },
    address: {
        type: String,
        required: [
            function() { return !this.googleId && this.role !== 'user'; },
            'Please add an address'
        ],
        default: ''
    },

    // ==========================================
    // Student Specific Data
    // ==========================================
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    progress: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        percentComplete: {
            type: Number,
            default: 0
        },
        completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }]
    }],
    certificates: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        dateAwarded: {
            type: Date,
            default: Date.now
        }
    }],

    // ==========================================
    // Instructor Specific Data
    // ==========================================
    instructorBio: {
        type: String,
        maxlength: 1000
    },
    instructorTitle: {
        type: String,
        default: 'Instructor'
    },
    location: {
        type: String,
        default: ''
    },
    expertise: [{
        type: String
    }],
    payoutSettings: {
        method: {
            type: String,
            default: 'PayPal'
        },
        schedule: {
            type: String,
            default: 'Monthly'
        }
    },
    taughtCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },

    // ==========================================
    // Admin Specific Data
    // ==========================================
    adminLevel: {
        type: Number,
        default: 1
    },
    permissions: [{
        type: String,
        enum: ['manage_users', 'manage_courses', 'manage_finances', 'full_access']
    }],

    // Common Profile Data
    avatar: {
        type: String,
        default: 'no-photo.jpg'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isActive: {
        type: Boolean,
        default: true
    },

    // ==========================================
    // Gamification Data
    // ==========================================
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date
    },
    badges: [{
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String, // e.g., 'Beginner', 'Learner', 'QuizMaster', 'StreakKing'
            required: true
        },
        dateAwarded: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
