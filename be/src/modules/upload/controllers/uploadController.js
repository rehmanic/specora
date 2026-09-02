import asyncHandler from "../../../utils/asyncHandler.js";
import { buildFileData } from "../services/uploadService.js";
export { generalUploadMiddleware as upload } from "../../../lib/storage/index.js";

// Controller: Handle Single File Upload
export const uploadFile = asyncHandler((req, res) => {
    const fileData = buildFileData(req.file);

    res.status(201).json({
        message: "File uploaded successfully",
        data: fileData,
    });
});
