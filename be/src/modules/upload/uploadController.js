import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure storage directory exists
const uploadDir = path.join(process.cwd(), "storage", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File Filter (Optional: restrict types if needed, currently allowing all per requirements)
const fileFilter = (req, file, cb) => {
    // Allow all file types for now as requested ("all kinds of files")
    cb(null, true);
};

// Initialize Multer
export const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit example
    fileFilter: fileFilter,
});

// Controller: Handle Single File Upload
export const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Construct URL (assuming static file serving is set up in app.js)
        // URL format: /uploads/<filename>
        const fileUrl = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;

        const fileData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: fileUrl,
        };

        res.status(201).json({
            message: "File uploaded successfully",
            data: fileData,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error during file upload" });
    }
};
