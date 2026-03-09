const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Progress = require('./models/Progress');
const dotenv = require('dotenv');

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autolms');
        console.log('Connected to DB');

        const users = await User.find({ role: 'student' });
        console.log(`Found ${users.length} students`);

        for (const user of users) {
            console.log(`\nStudent: ${user.name} (${user.email})`);
            console.log(`Enrolled Course IDs: ${user.enrolledCourses}`);

            const courses = await Course.find({ _id: { $in: user.enrolledCourses } });
            console.log(`Course Details: ${courses.map(c => c.title).join(', ')}`);

            const progress = await Progress.find({ user: user._id });
            console.log(`Progress Records: ${progress.length}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Debug failed:', error);
        process.exit(1);
    }
};

debug();
