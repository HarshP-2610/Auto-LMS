const Notification = require('../models/Notification');

/**
 * Create a notification for a user.
 * Can be called from any controller.
 * Does NOT throw — silently logs errors to avoid breaking the main flow.
 */
const createNotification = async (userId, message, type = 'general', link = '') => {
    try {
        await Notification.create({ user: userId, message, type, link });
    } catch (error) {
        console.error('Failed to create notification:', error.message);
    }
};

module.exports = { createNotification };
