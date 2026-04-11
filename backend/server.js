const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Passport config
require('./config/passport');

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Connect to database
connectDB().then(() => {
    const seedAdmin = require('./seeders/adminSeeder');
    seedAdmin();
});

const app = express();

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(express.json());
app.use(cors());

// Session Middleware
const session = require('express-session');
app.use(session({ 
    secret: process.env.JWT_SECRET || 'secret', 
    resave: false, 
    saveUninitialized: false 
}));

// Passport Middleware
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/instructor-applications', require('./routes/instructorApplicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/extra-quizzes', require('./routes/extraQuizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/final-assessments', require('./routes/finalAssessmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('Auto-LMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
