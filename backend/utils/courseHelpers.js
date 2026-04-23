const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');

// Helper: Calculate course duration from all topic durations
const calculateCourseDuration = async (courseId) => {
    const lessons = await Lesson.find({ course: courseId });
    const lessonIds = lessons.map(l => l._id);
    const topics = await Topic.find({ lesson: { $in: lessonIds } });

    let totalMinutes = 0;
    topics.forEach(topic => {
        const dur = topic.duration || '0';
        if (dur.includes(':')) {
            const parts = dur.split(':');
            if (parts.length === 2) {
                totalMinutes += parseInt(parts[0]) + (parseInt(parts[1]) / 60);
            } else if (parts.length === 3) {
                totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]) + (parseInt(parts[2]) / 60);
            }
        } else {
            const mins = parseInt(dur);
            if (!isNaN(mins)) totalMinutes += mins;
        }
    });

    if (totalMinutes <= 0) return '0m';
    if (totalMinutes >= 60) {
        const h = Math.floor(totalMinutes / 60);
        const m = Math.round(totalMinutes % 60);
        return m > 0 ? `${h} Hr ${m}m` : `${h} Hr`;
    }
    return `${Math.round(totalMinutes)}m`;
};

// Helper: Enrich an array of courses with calculated duration and lesson count
const enrichCoursesWithDuration = async (courses) => {
    return Promise.all(courses.map(async (course) => {
        const courseObj = course.toObject ? course.toObject() : { ...course };
        const lessons = await Lesson.find({ course: courseObj._id });
        courseObj.duration = await calculateCourseDuration(courseObj._id);
        courseObj.lessonsCount = lessons.length;
        return courseObj;
    }));
};

module.exports = {
    calculateCourseDuration,
    enrichCoursesWithDuration
};
