const express = require('express');
const router = express.Router();
const {
    getPendingInstructors,
    approveInstructor,
    rejectInstructor,
    getPendingCourses,
    approveCourse,
    rejectCourse,
    getAllUsers,
    toggleUserStatus,
    getAllCourses,
    deleteCourse,
    getAdminNotifications,
    deleteUser,
    getFullCourseDetails,
    getStudentFullDetails
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

router.route('/users')
    .get(protect, adminCheck, getAllUsers);

router.route('/users/:id/toggle-status')
    .put(protect, adminCheck, toggleUserStatus);

router.route('/users/:id')
    .delete(protect, adminCheck, deleteUser);

router.route('/users/:id/full-details')
    .get(protect, adminCheck, getStudentFullDetails);

router.route('/courses-all')
    .get(protect, adminCheck, getAllCourses);

router.route('/courses/:id')
    .delete(protect, adminCheck, deleteCourse);

router.route('/courses/:id/full-details')
    .get(protect, adminCheck, getFullCourseDetails);

router.route('/notifications')
    .get(protect, adminCheck, getAdminNotifications);

module.exports = router;
