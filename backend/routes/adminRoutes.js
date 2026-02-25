const express = require('express');
const router = express.Router();
const {
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getPendingCourses,
    approveCourse,
    rejectCourse
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Check admin role
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

router.route('/pending-instructors')
    .get(protect, adminCheck, getPendingInstructors);

router.route('/pending-instructors/:id/approve')
    .put(protect, adminCheck, approveInstructor);

router.route('/pending-instructors/:id/reject')
    .put(protect, adminCheck, rejectInstructor);

router.route('/pending-courses')
    .get(protect, adminCheck, getPendingCourses);

router.route('/pending-courses/:id/approve')
    .put(protect, adminCheck, approveCourse);

router.route('/pending-courses/:id/reject')
    .put(protect, adminCheck, rejectCourse);

module.exports = router;
