import express from "express";
import { body } from "express-validator";
import meetingsController from "./controller.js";
// import { authenticate } from "../../core/middlewares/auth.js"; // TODO: Enable when auth is ready

const router = express.Router();

// Validation middleware
const createMeetingValidation = [
  // Accept both 'name' (frontend) and 'title' (backend)
  body("name")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Meeting name must not exceed 200 characters"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Meeting title must not exceed 200 characters"),
  // Ensure at least one is provided
  body()
    .custom((value, { req }) => {
      if (!req.body.name && !req.body.title) {
        throw new Error("Meeting name/title is required");
      }
      return true;
    }),
  // Accept both 'scheduled_at' (frontend) and 'scheduledAt' (backend)
  body("scheduled_at")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date/time must be in ISO 8601 format"),
  body("scheduledAt")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date/time must be in ISO 8601 format"),
  // Ensure at least one is provided
  body()
    .custom((value, { req }) => {
      if (!req.body.scheduled_at && !req.body.scheduledAt) {
        throw new Error("Scheduled date/time is required");
      }
      return true;
    }),
  body("durationMinutes")
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage("Duration must be between 15 and 480 minutes"),
  body("duration_minutes")
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage("Duration must be between 15 and 480 minutes"),
  body("meetingType")
    .optional()
    .isIn(['virtual', 'in-person', 'hybrid'])
    .withMessage("Meeting type must be virtual, in-person, or hybrid"),
  body("meeting_type")
    .optional()
    .isIn(['virtual', 'in-person', 'hybrid'])
    .withMessage("Meeting type must be virtual, in-person, or hybrid"),
  body("participants")
    .optional()
    .isArray()
    .withMessage("Participants must be an array"),
  body("stakeholders")
    .optional()
    .isArray()
    .withMessage("Stakeholders must be an array"),
];

// ======================
// MEETING CRUD ROUTES
// ======================

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
 * @route   GET /api/meetings/my-meetings
 * @desc    Get all meetings where user is a participant
 * @access  Private
 */
router.get("/my-meetings", meetingsController.getMyMeetings);

/**
 * @route   GET /api/meetings/:id
 * @desc    Get meeting by ID with all details
 * @access  Private
 */
router.get("/:id", meetingsController.getMeetingById);

/**
 * @route   POST /api/meetings
 * @desc    Create a new meeting
 * @access  Private
 */
router.post("/", ...createMeetingValidation, meetingsController.scheduleMeeting);

/**
 * @route   PUT /api/meetings/:id
 * @desc    Update meeting details
 * @access  Private (Creator only)
 */
router.put("/:id", meetingsController.updateMeeting);

/**
 * @route   DELETE /api/meetings/:id
 * @desc    Delete meeting
 * @access  Private (Creator only)
 */
router.delete("/:id", meetingsController.deleteMeeting);

// ======================
// MEETING CONTROL ROUTES
// ======================

/**
 * @route   POST /api/meetings/:id/start
 * @desc    Start a meeting (creates video room)
 * @access  Private (Creator only)
 */
router.post("/:id/start", meetingsController.startMeeting);

/**
 * @route   POST /api/meetings/:id/end
 * @desc    End a meeting (triggers AI processing)
 * @access  Private (Creator only)
 */
router.post("/:id/end", meetingsController.endMeeting);

/**
 * @route   POST /api/meetings/:id/cancel
 * @desc    Cancel a meeting
 * @access  Private (Creator only)
 */
router.post("/:id/cancel", meetingsController.cancelMeeting);

// ======================
// PARTICIPANT ROUTES
// ======================

/**
 * @route   POST /api/meetings/:id/participants
 * @desc    Add participant to meeting
 * @access  Private (Creator only)
 */
router.post("/:id/participants", meetingsController.addParticipant);

/**
 * @route   DELETE /api/meetings/:id/participants/:participantId
 * @desc    Remove participant from meeting
 * @access  Private (Creator only)
 */
router.delete("/:id/participants/:participantId", meetingsController.removeParticipant);

/**
 * @route   POST /api/meetings/:id/participants/:participantId/join
 * @desc    Track participant join event
 * @access  Internal (Called by video module)
 */
router.post("/:id/participants/:participantId/join", meetingsController.trackParticipantJoin);

/**
 * @route   POST /api/meetings/:id/participants/:participantId/leave
 * @desc    Track participant leave event
 * @access  Internal (Called by video module)
 */
router.post("/:id/participants/:participantId/leave", meetingsController.trackParticipantLeave);

/**
 * @route   GET /api/meetings/:id/rsvp
 * @desc    RSVP to meeting (Accept/Decline/Tentative)
 * @access  Public (with token)
 */
router.get("/:id/rsvp", meetingsController.rsvpToMeeting);

// ======================
// ACTION ITEM ROUTES
// ======================

/**
 * @route   POST /api/meetings/:id/action-items
 * @desc    Create action item for meeting
 * @access  Private
 */
router.post("/:id/action-items", meetingsController.createActionItem);

/**
 * @route   PUT /api/meetings/action-items/:id
 * @desc    Update action item
 * @access  Private
 */
router.put("/action-items/:id", meetingsController.updateActionItem);

// ======================
// AI-POWERED FEATURES
// ======================

/**
 * @route   POST /api/meetings/check-conflicts
 * @desc    Check for scheduling conflicts
 * @access  Private
 */
router.post("/check-conflicts", meetingsController.checkConflicts);

/**
 * @route   POST /api/meetings/suggest-times
 * @desc    Get AI-powered meeting time suggestions
 * @access  Private
 */
router.post("/suggest-times", meetingsController.suggestMeetingTimes);

export default router;
