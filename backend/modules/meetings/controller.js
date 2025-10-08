import meetingsService from "./service.js";
import { validationResult } from "express-validator";

class MeetingsController {
  /**
   * Get all upcoming meetings
   * GET /api/meetings/upcoming
   */
  async getUpcomingMeetings(req, res) {
    try {
      const meetings = await meetingsService.getUpcomingMeetings();
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error in getUpcomingMeetings:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Get all completed meetings
   * GET /api/meetings/completed
   */
  async getCompletedMeetings(req, res) {
    try {
      const meetings = await meetingsService.getCompletedMeetings();
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error in getCompletedMeetings:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Get meeting by ID
   * GET /api/meetings/:id
   */
  async getMeetingById(req, res) {
    try {
      const { id } = req.params;
      const meeting = await meetingsService.getMeetingById(id);
      
      if (!meeting) {
        return res.status(404).json({
          error: "Not Found",
          message: "Meeting not found",
        });
      }

      res.status(200).json(meeting);
    } catch (error) {
      console.error("Error in getMeetingById:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Schedule a new meeting
   * POST /api/meetings/schedule
   */
  async scheduleMeeting(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation Error",
          errors: errors.array(),
        });
      }

      const meetingData = req.body;
      // TODO: Get actual user from auth middleware
      const scheduledBy = req.user?.name || "John Doe";

      const meeting = await meetingsService.scheduleMeeting(meetingData, scheduledBy);
      
      res.status(201).json({
        message: "Meeting scheduled successfully",
        meeting,
      });
    } catch (error) {
      console.error("Error in scheduleMeeting:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Send meeting invitation emails
   * POST /api/meetings/send-email
   */
  async sendMeetingEmail(req, res) {
    try {
      const meetingData = req.body;
      const result = await meetingsService.sendMeetingInvites(meetingData);
      
      res.status(200).json({
        message: result.message,
        success: result.success,
      });
    } catch (error) {
      console.error("Error in sendMeetingEmail:", error);
      res.status(500).json({
        error: "Email Error",
        message: error.message,
      });
    }
  }

  /**
   * Update meeting
   * PUT /api/meetings/:id
   */
  async updateMeeting(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const meeting = await meetingsService.updateMeeting(id, updateData);
      
      res.status(200).json({
        message: "Meeting updated successfully",
        meeting,
      });
    } catch (error) {
      console.error("Error in updateMeeting:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Mark meeting as completed
   * PATCH /api/meetings/:id/complete
   */
  async markAsCompleted(req, res) {
    try {
      const { id } = req.params;
      const { recording_link } = req.body;

      const meeting = await meetingsService.markAsCompleted(id, recording_link);
      
      res.status(200).json({
        message: "Meeting marked as completed",
        meeting,
      });
    } catch (error) {
      console.error("Error in markAsCompleted:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Delete meeting
   * DELETE /api/meetings/:id
   */
  async deleteMeeting(req, res) {
    try {
      const { id } = req.params;
      await meetingsService.deleteMeeting(id);
      
      res.status(200).json({
        message: "Meeting deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteMeeting:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Search meetings
   * GET /api/meetings/search?q=query
   */
  async searchMeetings(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Search query is required",
        });
      }

      const meetings = await meetingsService.searchMeetings(q);
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error in searchMeetings:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
}

export default new MeetingsController();
