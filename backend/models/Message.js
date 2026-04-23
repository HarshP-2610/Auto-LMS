const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [function() { return !this.attachment; }, 'Message content or attachment is required']
    },
    attachment: {
        type: String,
        default: ''
    },
    attachmentType: {
        type: String,
        default: ''
    },
    attachmentName: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['sent', 'seen'],
        default: 'sent'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

module.exports = mongoose.model('Message', messageSchema);
