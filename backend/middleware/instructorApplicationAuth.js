const jwt = require('jsonwebtoken');
const InstructorApplication = require('../models/InstructorApplication');

const protectApp = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_autolms');

            // Get app from the token
            req.appliaction = await InstructorApplication.findById(decoded.id).select('-password');
            if (!req.appliaction) {
                const RejectedApplication = require('../models/RejectedApplication');
                req.appliaction = await RejectedApplication.findById(decoded.id).select('-password');
            }
            if (!req.appliaction) {
                return res.status(401).json({ message: 'Not authorized, application not found' });
            }

            return next();
        } catch (error) {
            console.error('protectApp error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protectApp };
