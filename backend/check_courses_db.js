const mongoose = require('mongoose');

async function checkCourses() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/autolms');
        console.log('Connected to MongoDB');

        const Course = mongoose.model('Course', new mongoose.Schema({
            title: String,
            thumbnail: String
        }));

        const courses = await Course.find({});
        console.log('Courses in DB:');
        courses.forEach(c => {
            console.log(`- ${c.title}: ${c.thumbnail}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCourses();
