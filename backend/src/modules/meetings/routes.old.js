import express from "express";
import { body } from "express-validator";
import meetingsController from "./controller.js";
// import { authenticate } from "../../core/middlewares/auth.js"; // TODO: Enable when auth is ready

const router = express.Router();

// Validation middleware
const scheduleMeetingValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Meeting name is required")
    .isLength({ max: 150 })
    .withMessage("Meeting name must not exceed 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Meeting description is required"),
  body("stakeholders")
    .isArray({ min: 1 })
    .withMessage("At least one stakeholder email is required"),
  body("stakeholders.*")
    .isEmail()
    .withMessage("Each stakeholder must be a valid email address"),
  body("scheduled_at")
    .notEmpty()
    .withMessage("Scheduled date/time is required")
    .isISO8601()
    .withMessage("Scheduled date/time must be in ISO 8601 format"),
];

// Routes
// TODO: Add authentication middleware to all routes
// router.use(authenticate);

/**
 * @route   GET /api/meetings/upcoming
 * @desc    Get all upcoming meetings
 * @access  Private
 */
router.get("/upcoming", meetingsController.getUpcomingMeetings);

/**
 * @route   GET /api/meetings/completed
 * @desc    Get all completed meetings
 * @access  Private
 */
router.get("/completed", meetingsController.getCompletedMeetings);

/**
 * @route   GET /api/meetings/search
 * @desc    Search meetings by name or description
 * @access  Private
 */
router.get("/search", meetingsController.searchMeetings);

/**
 * @route   GET /api/meetings/:id
 * @desc    Get meeting by ID
 * @access  Private
 */
router.get("/:id", meetingsController.getMeetingById);

/**
 * @route   POST /api/meetings/schedule
 * @desc    Schedule a new meeting
 * @access  Private (Manager/Engineer only)
 */
router.post(
  "/schedule",
  scheduleMeetingValidation,
  meetingsController.scheduleMeeting
);

/**
 * @route   POST /api/meetings/send-email
 * @desc    Send meeting invitation emails
 * @access  Private (Manager/Engineer only)
 */
router.post("/send-email", meetingsController.sendMeetingEmail);

/**
 * @route   PUT /api/meetings/:id
 * @desc    Update meeting
 * @access  Private (Manager/Engineer only)
 */
router.put("/:id", scheduleMeetingValidation, meetingsController.updateMeeting);

/**
 * @route   PATCH /api/meetings/:id/complete
 * @desc    Mark meeting as completed
 * @access  Private (Manager/Engineer only)
 */
router.patch("/:id/complete", meetingsController.markAsCompleted);

/**
 * @route   DELETE /api/meetings/:id
 * @desc    Delete meeting
 * @access  Private (Manager only)
 */
router.delete("/:id", meetingsController.deleteMeeting);

export default router;
