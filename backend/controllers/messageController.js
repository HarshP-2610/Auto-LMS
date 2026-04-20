const Message = require('../models/Message');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Get contacts for the logged in user
// @route   GET /api/messages/contacts
// @access  Private
const getContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        let contactIds = [];

        if (userRole === 'student') {
            // Find all unique instructors from courses where this student is enrolled
            const courses = await Course.find({ enrolledStudents: userId }).select('instructor');
            const instructorIds = courses
                .filter(c => c.instructor)
                .map(c => c.instructor.toString());
            
            contactIds = [...new Set(instructorIds)];
        } else if (userRole === 'instructor') {
            // Find all unique students enrolled in any of this instructor's courses
            const courses = await Course.find({ instructor: userId }).select('enrolledStudents');
            const allStudents = [];
            courses.forEach(course => {
                if (course.enrolledStudents && Array.isArray(course.enrolledStudents)) {
                    course.enrolledStudents.forEach(studentId => {
                        allStudents.push(studentId.toString());
                    });
                }
            });
            contactIds = [...new Set(allStudents)];
        }

        const contacts = await User.find({ _id: { $in: contactIds } })
            .select('name avatar role');

        // Fetch last message for each contact to show in sidebar snippet
        const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: userId, receiver: contact._id },
                    { sender: contact._id, receiver: userId }
                ]
            }).sort({ timestamp: -1 });

            return {
                ...contact.toObject(),
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    timestamp: lastMessage.timestamp,
                    status: lastMessage.status,
                    isSender: lastMessage.sender.toString() === userId.toString()
                } : null
            };
        }));

        res.status(200).json({
            success: true,
            data: contactsWithLastMessage
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get messages between logged in user and another user
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.otherUserId;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });

        // Mark messages from other user as seen
        await Message.updateMany(
            { sender: otherUserId, receiver: userId, status: 'sent' },
            { $set: { status: 'seen' } }
        );

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, attachment, attachmentType, attachmentName } = req.body;
        const senderId = req.user._id;

        if (!receiverId || (!content && !attachment)) {
            return res.status(400).json({ success: false, message: 'Receiver and content/attachment are required' });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content: content || '',
            attachment: attachment || '',
            attachmentType: attachmentType || '',
            attachmentName: attachmentName || ''
        });

        // Create a notification for the receiver
        try {
            const displayContent = content 
                ? `"${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`
                : (attachmentName ? `Sent an attachment: ${attachmentName}` : 'Sent an attachment');

            await Notification.create({
                user: receiverId,
                message: `New message from ${req.user.name}: ${displayContent}`,
                type: 'message',
                link: req.user.role === 'student' ? '/instructor/messages' : '/student/messages'
            });
        } catch (notifError) {
            console.error('Failed to create notification for message:', notifError);
            // Don't fail the message send if notification fails
        }

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getContacts,
    getMessages,
    sendMessage
};
