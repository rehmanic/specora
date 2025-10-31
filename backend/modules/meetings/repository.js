import { Meeting, MeetingParticipant, MeetingAgenda, MeetingActionItem } from "../../database/models/index.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";

class MeetingsRepository {
  /**
   * Create a new meeting with participants and agendas
   */
  async createMeeting(meetingData) {
    const transaction = await sequelize.transaction();
    
    try {
      // 1. Create meeting
      const meeting = await Meeting.create({
        title: meetingData.title,
        description: meetingData.description,
        meetingType: meetingData.meeting_type || meetingData.meetingType || 'virtual',
        scheduledAt: meetingData.scheduled_at || meetingData.scheduledAt,
        durationMinutes: meetingData.duration_minutes || meetingData.durationMinutes || 60,
        location: meetingData.location,
        createdBy: meetingData.created_by || meetingData.createdBy,
        scheduledByName: meetingData.scheduledByName || meetingData.scheduled_by_name || null,
        projectId: meetingData.project_id || meetingData.projectId,
        isRecurring: meetingData.is_recurring || meetingData.isRecurring || false,
        recurrencePattern: meetingData.recurrence_pattern || meetingData.recurrencePattern
      }, { transaction });

      // 2. Add participants
      if (meetingData.participants && meetingData.participants.length > 0) {
        const participants = meetingData.participants.map(p => ({
          meetingId: meeting.id,
          userId: p.userId || null,
          email: p.email || null,
          name: p.name || null,
          roleInMeeting: p.role_in_meeting || p.roleInMeeting || 'attendee',
          attendanceStatus: 'invited',
          isRequired: p.is_required !== undefined ? p.is_required : (p.isRequired !== undefined ? p.isRequired : true)
        }));
        
        await MeetingParticipant.bulkCreate(participants, { transaction });
      }

      // 3. Create agenda items
      if (meetingData.agendaItems && meetingData.agendaItems.length > 0) {
        const agendas = meetingData.agendaItems.map((item, index) => ({
          meetingId: meeting.id,
          title: item.title,
          description: item.description,
          allocatedMinutes: item.allocatedMinutes,
          presenterId: item.presenterId,
          displayOrder: index,
          status: 'pending'
        }));
        
        await MeetingAgenda.bulkCreate(agendas, { transaction });
      }

      await transaction.commit();
      
      // Return meeting with associations
      return await this.getMeetingById(meeting.id);
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error creating meeting: ${error.message}`);
    }
  }

  /**
   * Get all upcoming meetings
   */
  async getUpcomingMeetings(userId = null) {
    try {
      const where = {
        status: { [Op.in]: ['scheduled', 'in-progress'] },
        scheduledAt: { [Op.gte]: new Date() }
      };

      if (userId) {
        where.createdBy = userId;
      }

      const meetings = await Meeting.findAll({
        where,
        include: [
          {
            model: MeetingParticipant,
            as: 'participants',
            attributes: ['id', 'userId', 'email', 'name', 'roleInMeeting', 'attendanceStatus']
          },
          {
            model: MeetingAgenda,
            as: 'agendas',
            attributes: ['id', 'title', 'allocatedMinutes', 'status', 'displayOrder'],
            order: [['displayOrder', 'ASC']]
          }
        ],
        order: [['scheduledAt', 'ASC']]
      });
      
      return meetings;
    } catch (error) {
      throw new Error(`Error fetching upcoming meetings: ${error.message}`);
    }
  }

  /**
   * Get all completed meetings
   */
  async getCompletedMeetings(userId = null) {
    try {
      const where = {
        status: 'completed'
      };

      if (userId) {
        where.createdBy = userId;
      }

      const meetings = await Meeting.findAll({
        where,
        include: [
          {
            model: MeetingParticipant,
            as: 'participants',
            attributes: ['id', 'userId', 'email', 'name', 'attendanceStatus']
          },
          {
            model: MeetingActionItem,
            as: 'actionItems',
            attributes: ['id', 'title', 'status', 'priority', 'assignedTo']
          }
        ],
        order: [['scheduledAt', 'DESC']]
      });
      
      return meetings;
    } catch (error) {
      throw new Error(`Error fetching completed meetings: ${error.message}`);
    }
  }

  /**
   * Get meeting by ID with all associations
   */
  async getMeetingById(id) {
    try {
      const meeting = await Meeting.findByPk(id, {
        include: [
          {
            model: MeetingParticipant,
            as: 'participants'
          },
          {
            model: MeetingAgenda,
            as: 'agendas',
            order: [['displayOrder', 'ASC']]
          },
          {
            model: MeetingActionItem,
            as: 'actionItems'
          }
        ]
      });
      
      return meeting;
    } catch (error) {
      throw new Error(`Error fetching meeting: ${error.message}`);
    }
  }

  /**
   * Update meeting
   */
  async updateMeeting(id, updateData) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      await meeting.update(updateData);
      return await this.getMeetingById(id);
    } catch (error) {
      throw new Error(`Error updating meeting: ${error.message}`);
    }
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      await meeting.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting meeting: ${error.message}`);
    }
  }

  /**
   * Add participant to meeting
   */
  async addParticipant(meetingId, participantData) {
    try {
      const participant = await MeetingParticipant.create({
        meetingId,
        userId: participantData.userId || null,
        email: participantData.email || null,
        name: participantData.name || null,
        roleInMeeting: participantData.roleInMeeting || 'attendee',
        attendanceStatus: 'invited',
        isRequired: participantData.isRequired !== undefined ? participantData.isRequired : true
      });
      
      return participant;
    } catch (error) {
      throw new Error(`Error adding participant: ${error.message}`);
    }
  }

  /**
   * Update participant RSVP status
   */
  async updateParticipantStatus(participantId, status, message = null) {
    try {
      const participant = await MeetingParticipant.findByPk(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      await participant.update({
        attendanceStatus: status,
        responseMessage: message
      });
      
      return participant;
    } catch (error) {
      throw new Error(`Error updating participant status: ${error.message}`);
    }
  }

  /**
   * Remove participant from meeting
   */
  async removeParticipant(participantId) {
    try {
      const participant = await MeetingParticipant.findByPk(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      await participant.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error removing participant: ${error.message}`);
    }
  }

  /**
   * Create action item
   */
  async createActionItem(actionItemData) {
    try {
      const actionItem = await MeetingActionItem.create(actionItemData);
      return actionItem;
    } catch (error) {
      throw new Error(`Error creating action item: ${error.message}`);
    }
  }

  /**
   * Update action item
   */
  async updateActionItem(id, updateData) {
    try {
      const actionItem = await MeetingActionItem.findByPk(id);
      if (!actionItem) {
        throw new Error('Action item not found');
      }

      // If status is being changed to completed, set completedAt
      if (updateData.status === 'completed' && !actionItem.completedAt) {
        updateData.completedAt = new Date();
      }

      await actionItem.update(updateData);
      return actionItem;
    } catch (error) {
      throw new Error(`Error updating action item: ${error.message}`);
    }
  }

  /**
   * Get meetings by participant
   */
  async getMeetingsByParticipant(userId) {
    try {
      const meetings = await Meeting.findAll({
        include: [
          {
            model: MeetingParticipant,
            as: 'participants',
            where: { userId },
            required: true
          }
        ],
        order: [['scheduledAt', 'DESC']]
      });
      
      return meetings;
    } catch (error) {
      throw new Error(`Error fetching participant meetings: ${error.message}`);
    }
  }

  /**
   * Start meeting (update status and set startedAt)
   */
  async startMeeting(id, roomId, meetingLink) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      await meeting.update({
        status: 'in-progress',
        startedAt: new Date(),
        roomId,
        meetingLink
      });

      return await this.getMeetingById(id);
    } catch (error) {
      throw new Error(`Error starting meeting: ${error.message}`);
    }
  }

  /**
   * End meeting (update status and set endedAt)
   */
  async endMeeting(id) {
    try {
      const meeting = await Meeting.findByPk(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      await meeting.update({
        status: 'completed',
        endedAt: new Date()
      });

      return await this.getMeetingById(id);
    } catch (error) {
      throw new Error(`Error ending meeting: ${error.message}`);
    }
  }

  /**
   * Track participant join
   */
  async trackParticipantJoin(participantId) {
    try {
      const participant = await MeetingParticipant.findByPk(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      await participant.update({
        joinedAt: new Date(),
        attendanceStatus: 'attended'
      });

      return participant;
    } catch (error) {
      throw new Error(`Error tracking participant join: ${error.message}`);
    }
  }

  /**
   * Track participant leave
   */
  async trackParticipantLeave(participantId) {
    try {
      const participant = await MeetingParticipant.findByPk(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      await participant.update({
        leftAt: new Date()
      });

      return participant;
    } catch (error) {
      throw new Error(`Error tracking participant leave: ${error.message}`);
    }
  }
}

export default new MeetingsRepository();

