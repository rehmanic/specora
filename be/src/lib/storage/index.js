import multer from "multer";
import path from "path";
import { storageService } from "./storageService.js";

// General file upload configuration (Domain: 'uploads')
const uploadStorage = storageService.getDiskStorage("uploads");
export const generalUploadMiddleware = multer({
    storage: uploadStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => cb(null, true),
});

// Meetings recording configuration (Domain: 'meetings')
const recordingStorage = storageService.getDiskStorage("meetings", (req, file, cb) => {
    const meetingId = req.params.meetingId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `${meetingId}-${timestamp}${ext}`);
});

export const meetingRecordingMiddleware = multer({
    storage: recordingStorage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video/audio files are allowed'), false);
        }
    },
});

export { storageService };
