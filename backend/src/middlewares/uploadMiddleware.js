const multer = require('multer');

// Configure memory storage (files stored in buffer in memory)
const storage = multer.memoryStorage();

// File filter for lab reports (allow PDFs, images, documents)
const labReportFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, image, and document files are allowed'), false);
    }
};

// Create multer upload instance for lab reports
const uploadLabReports = multer({
    storage: storage,
    fileFilter: labReportFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB max file size
        files: 10 // Max 10 files
    }
});

// File filter for general use
const fileFilter = (req, file, cb) => {
    // Allow all file types for now (validation handled in controller)
    cb(null, true);
};

// Create general multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB max file size
    }
});

module.exports = {
    upload,
    uploadLabReports
};
