import meetingsService from "./service.js";
import { serializeMeeting, serializeMeetings, deserializeMeeting } from "./serializer.js";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";


class MeetingsController {

  /**
   * Get all upcoming meetings
   * GET /api/meetings/upcoming
   */
  async getUpcomingMeetings(req, res) {
    try {
      const meetings = await meetingsService.getUpcomingMeetings();
      const serialized = serializeMeetings(meetings);
      res.status(200).json({ meetings: serialized });
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
      const serialized = serializeMeetings(meetings);
      res.status(200).json({ meetings: serialized });
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

      const serialized = serializeMeeting(meeting);
      res.status(200).json({ meeting: serialized });
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

      // Get user info from auth middleware or use defaults
      // Generate a proper UUID for the user if not authenticated
      const userId = req.user?.id || uuidv4();
      const scheduledBy = req.user?.name || "John Doe";

      // Transform frontend data to backend format
      const backendData = deserializeMeeting(req.body, userId);
      
      // Add the scheduledByName for serialization later
      backendData.scheduledByName = scheduledBy;

      const meeting = await meetingsService.scheduleMeeting(backendData, scheduledBy);
      
      // Transform back to frontend format
      const serialized = serializeMeeting(meeting);
      
      res.status(201).json({
        message: "Meeting scheduled successfully",
        meeting: serialized,
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
   * Start a meeting (generates room/link)
   * POST /api/meetings/:id/start
   */
  async startMeeting(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || uuidv4();
      
      const meeting = await meetingsService.startMeeting(id, userId);
      const serializedMeeting = serializeMeeting(meeting);
      
      res.status(200).json({
        success: true,
        message: "Meeting started successfully",
        meeting: serializedMeeting,
      });
    } catch (error) {
      console.error("Error in startMeeting:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  /**
   * Cancel a meeting
   * POST /api/meetings/:id/cancel
   */
  async cancelMeeting(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || "user-123";
      const { reason } = req.body;
      
      await meetingsService.deleteMeeting(id, userId);
      
      res.status(200).json({
        success: true,
        message: "Meeting cancelled successfully",
      });
    } catch (error) {
      console.error("Error in cancelMeeting:", error);
      res.status(500).json({
        success: false,
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

  /**
   * End meeting
   * POST /api/meetings/:id/end
   */
  async endMeeting(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'temp-user-id';

      const meeting = await meetingsService.endMeeting(id, userId);
      
      res.status(200).json({
        success: true,
        message: "Meeting ended successfully. AI processing started for summary and action items.",
        data: meeting
      });
    } catch (error) {
      console.error("Error in endMeeting:", error);
      const statusCode = error.message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Add participant to meeting
   * POST /api/meetings/:id/participants
   */
  async addParticipant(req, res) {
    try {
      const { id } = req.params;
      const participantData = req.body;
      const userId = req.user?.id || 'temp-user-id';

      const participant = await meetingsService.addParticipant(id, participantData, userId);
      
      res.status(201).json({
        success: true,
        message: "Participant added successfully. Invitation sent.",
        data: participant
      });
    } catch (error) {
      console.error("Error in addParticipant:", error);
      const statusCode = error.message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Remove participant from meeting
   * DELETE /api/meetings/:id/participants/:participantId
   */
  async removeParticipant(req, res) {
    try {
      const { id, participantId } = req.params;
      const userId = req.user?.id || 'temp-user-id';

      await meetingsService.removeParticipant(id, participantId, userId);
      
      res.status(200).json({
        success: true,
        message: "Participant removed successfully"
      });
    } catch (error) {
      console.error("Error in removeParticipant:", error);
      const statusCode = error.message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * RSVP to meeting
   * POST /api/meetings/:id/rsvp
   */
  async rsvpToMeeting(req, res) {
    try {
      const { id } = req.params;
      const { token, response: rsvpStatus, message } = req.query;

      // Decode token to get participant ID
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [meetingId, participantId] = decoded.split(':');

      if (meetingId !== id) {
        return res.status(400).json({
          success: false,
          error: "Invalid token"
        });
      }

      const participant = await meetingsService.rsvpToMeeting(id, participantId, rsvpStatus, message);
      
      res.status(200).json({
        success: true,
        message: `RSVP updated to ${rsvpStatus}`,
        data: participant
      });
    } catch (error) {
      console.error("Error in rsvpToMeeting:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Create action item
   * POST /api/meetings/:id/action-items
   */
  async createActionItem(req, res) {
    try {
      const { id } = req.params;
      const actionItemData = { ...req.body, meetingId: id };
      const userId = req.user?.id || 'temp-user-id';

      const actionItem = await meetingsService.createActionItem(actionItemData, userId);
      
      res.status(201).json({
        success: true,
        message: "Action item created successfully",
        data: actionItem
      });
    } catch (error) {
      console.error("Error in createActionItem:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Update action item
   * PUT /api/meetings/action-items/:id
   */
  async updateActionItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id || 'temp-user-id';

      const actionItem = await meetingsService.updateActionItem(id, updateData, userId);
      
      res.status(200).json({
        success: true,
        message: "Action item updated successfully",
        data: actionItem
      });
    } catch (error) {
      console.error("Error in updateActionItem:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Get meetings by participant
   * GET /api/meetings/my-meetings
   */
  async getMyMeetings(req, res) {
    try {
      const userId = req.user?.id || 'temp-user-id';
      const meetings = await meetingsService.getMeetingsByParticipant(userId);
      
      res.status(200).json({
        success: true,
        count: meetings.length,
        data: meetings
      });
    } catch (error) {
      console.error("Error in getMyMeetings:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Check for scheduling conflicts
   * POST /api/meetings/check-conflicts
   */
  async checkConflicts(req, res) {
    try {
      const { participants, scheduledAt, durationMinutes } = req.body;
      
      const result = await meetingsService.checkConflicts(participants, scheduledAt, durationMinutes);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Error in checkConflicts:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Get AI-powered meeting time suggestions
   * POST /api/meetings/suggest-times
   */
  async suggestMeetingTimes(req, res) {
    try {
      const { participants, durationMinutes } = req.body;
      
      const suggestions = await meetingsService.suggestMeetingTimes(participants, durationMinutes);
      
      res.status(200).json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error("Error in suggestMeetingTimes:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Track participant join (called from video module)
   * POST /api/meetings/:id/participants/:participantId/join
   */
  async trackParticipantJoin(req, res) {
    try {
      const { id, participantId } = req.params;
      
      const participant = await meetingsService.trackParticipantJoin(id, participantId);
      
      res.status(200).json({
        success: true,
        message: "Participant joined",
        data: participant
      });
    } catch (error) {
      console.error("Error in trackParticipantJoin:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }

  /**
   * Track participant leave (called from video module)
   * POST /api/meetings/:id/participants/:participantId/leave
   */
  async trackParticipantLeave(req, res) {
    try {
      const { id, participantId } = req.params;
      
      const participant = await meetingsService.trackParticipantLeave(id, participantId);
      
      res.status(200).json({
        success: true,
        message: "Participant left",
        data: participant
      });
    } catch (error) {
      console.error("Error in trackParticipantLeave:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: error.message
      });
    }
  }
}

export default new MeetingsController();
