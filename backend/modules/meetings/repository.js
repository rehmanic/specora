import Meeting from "../../database/models/meeting.js";
import { Op } from "sequelize";

class MeetingsRepository {
  /**
   * Get all upcoming meetings
   */
  async getUpcomingMeetings() {
    try {
      const meetings = await Meeting.findAll({
        where: {
          is_completed: false,
        },
        order: [["scheduled_at", "ASC"]],
      });
      return meetings;
    } catch (error) {
      throw new Error(`Error fetching upcoming meetings: ${error.message}`);
    }
  }

  /**
   * Get all completed meetings
   */
  async getCompletedMeetings() {
    try {
      const meetings = await Meeting.findAll({
        where: {
          is_completed: true,
        },
        order: [["scheduled_at", "DESC"]],
      });
      return meetings;
    } catch (error) {
      throw new Error(`Error fetching completed meetings: ${error.message}`);
    }
  }

  /**
   * Get meeting by ID
   */
  async getMeetingById(id) {
    try {
      const meeting = await Meeting.findByPk(id);
      return meeting;
    } catch (error) {
      throw new Error(`Error fetching meeting: ${error.message}`);
    }
  }

  /**
   * Create a new meeting
   */
  async createMeeting(meetingData) {
    try {
      const meeting = await Meeting.create(meetingData);
      return meeting;
    } catch (error) {
      throw new Error(`Error creating meeting: ${error.message}`);
    }
  }

  /**
   * Update meeting
   */
  async updateMeeting(id, updateData) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      await meeting.update(updateData);
      return meeting;
    } catch (error) {
      throw new Error(`Error updating meeting: ${error.message}`);
    }
  }

  /**
   * Mark meeting as completed
   */
  async markAsCompleted(id, recordingLink = null) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      await meeting.update({
        is_completed: true,
        recording_link: recordingLink,
      });
      return meeting;
    } catch (error) {
      throw new Error(`Error marking meeting as completed: ${error.message}`);
    }
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      await meeting.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting meeting: ${error.message}`);
    }
  }

  /**
   * Search meetings by name or description
   */
  async searchMeetings(query) {
    try {
      const meetings = await Meeting.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${query}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${query}%`,
              },
            },
          ],
        },
        order: [["scheduled_at", "DESC"]],
      });
      return meetings;
    } catch (error) {
      throw new Error(`Error searching meetings: ${error.message}`);
    }
  }
}

export default new MeetingsRepository();
