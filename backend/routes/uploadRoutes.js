const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

function checkVideoFileType(file, cb) {
    const filetypes = /mp4|webm|mkv|mov|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Videos only!');
    }
}

const uploadImage = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

const uploadVideo = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkVideoFileType(file, cb);
    },
});

router.post('/image', protect, uploadImage.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded',
        imagePath: `/uploads/${req.file.filename}`,
    });
});

router.post('/video', protect, uploadVideo.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Please upload a video file' });
    }
    res.send({
        message: 'Video uploaded',
        videoPath: `/uploads/${req.file.filename}`,
    });
});

// Message Attachment Route
const uploadAttachment = multer({
    storage,
    fileFilter: function (req, file, cb) {
        // Allow images, pdfs, docs, zips
        const filetypes = /jpg|jpeg|png|pdf|doc|docx|zip|txt/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname || mimetype) {
            return cb(null, true);
        } else {
            cb('File type not supported!');
        }
    },
});

router.post('/message-attachment', protect, uploadAttachment.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    res.send({
        message: 'File uploaded',
        filePath: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileType: req.file.mimetype
    });
});

module.exports = router;
