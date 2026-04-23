require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find({});
        console.log(`Total courses found: ${courses.length}`);

        for (const course of courses) {
            console.log(`Course Title: ${course.title}, Instructor ID: ${course.instructor}, Status: ${course.status}`);
        }

        const instructors = await User.find({ role: 'instructor' });
        console.log(`Total instructors found: ${instructors.length}`);
        for (const instructor of instructors) {
            console.log(`Instructor: ${instructor.name}, ID: ${instructor._id}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
