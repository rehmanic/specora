import AppError from "../../../utils/AppError.js";

/**
 * Build a file data object from a multer-processed file.
 *
 * @param {object} file  The multer req.file object.
 * @returns {object}  Structured file metadata.
 */
export function buildFileData(file) {
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  const fileUrl = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${file.filename}`;

  return {
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
    url: fileUrl,
  };
}
