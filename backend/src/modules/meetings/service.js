import meetingsRepository from './repository.js';
import eventBus from '../../core/events/eventBus.js';
import { emailQueue, aiQueue, isQueueHealthy } from '../../core/services/queueService.js';
import emailService from '../../core/services/emailService.js';
import dailyVideoService from './dailyService.js';
import dotenv from "dotenv";

dotenv.config();

class MeetingsService {
  /**
   * Get upcoming meetings
   */
  async getUpcomingMeetings(userId = null) {
    return await meetingsRepository.getUpcomingMeetings(userId);
  }

  /**
   * Get completed meetings
   */
  async getCompletedMeetings(userId = null) {
    return await meetingsRepository.getCompletedMeetings(userId);
  }

  /**
   * Get meeting by ID
   */
  async getMeetingById(id) {
    const meeting = await meetingsRepository.getMeetingById(id);
    if (!meeting) {
      throw new Error("Meeting not found");
    }
    return meeting;
  }

  /**
   * Schedule a new meeting with event-driven notifications
   */
  async scheduleMeeting(meetingData, userId) {
    try {
      // Add creator
      meetingData.createdBy = userId;

      // Create meeting with participants and agendas
      const meeting = await meetingsRepository.createMeeting(meetingData);

      // Create Daily.co room immediately for virtual meetings
      if (meeting.meetingType === 'virtual') {
        try {
          const dailyRoom = await dailyVideoService.createRoom();
          
          // Update meeting with Daily.co details
          const updatedMeeting = await meetingsRepository.updateMeeting(meeting.id, {
            meetingLink: dailyRoom.url,
            roomId: dailyRoom.name
          });
          
          // Update the meeting object with the new data
          meeting.meetingLink = dailyRoom.url;
          meeting.roomId = dailyRoom.name;
          
          console.log(`✓ Daily.co room created: ${dailyRoom.url}`);
        } catch (error) {
          console.error('⚠️  Failed to create Daily.co room:', error.message);
          // Continue anyway - room can be created later when starting meeting
        }
      }

      // Send email invitations to all participants (direct send + optional queue)
      if (meeting.participants && meeting.participants.length > 0) {
        console.log(`📧 Sending email invitations to ${meeting.participants.length} participants (direct send)...`);
        // Always send directly so we are not blocked by Redis availability
        sendEmailsDirect(meeting, meeting.participants);

        // Best-effort queue (non-blocking) if Redis is healthy
        if (isQueueHealthy()) {
          emailQueue.add('send-invitation', {
            meeting,
            participants: meeting.participants
          }, {
            delay: 1000,
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 }
          }).then(() => {
            console.log('✅ Email job also queued to Redis successfully (optional)');
          }).catch((emailError) => {
            console.error('⚠️  Queue add failed (will rely on direct send):', emailError.message);
          });
        } else {
          console.warn('⚠️  Redis queue not healthy - using direct send only');
        }
      } else {
        console.log('⚠️  No participants to email');
      }

      // Emit event for meeting created
      eventBus.emitSafe('meeting.created', {
        meeting,
        participants: meeting.participants
      });

      // Send email invitations via queue (if Redis is available)
      // Make sure to send the meeting object WITH the Daily.co link
      if (isQueueHealthy() && meeting.participants && meeting.participants.length > 0) {
        await emailQueue.add('send-invitation', {
          meeting: {
            ...meeting.toJSON ? meeting.toJSON() : meeting,
            meetingLink: meeting.meetingLink,
            roomId: meeting.roomId
          },
          participants: meeting.participants
        }, {
          delay: 2000 // Send after 2 seconds
        });
        console.log('📧 Email invitation job queued with link:', meeting.meetingLink || 'No link');
      } else {
        console.log('⚠️  Redis not available - Email invitations skipped (queue disabled)');
      }

      console.log(`✓ Meeting scheduled: ${meeting.title} (${meeting.id})`);
      return meeting;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  /**
   * Update meeting
   */
  async updateMeeting(id, updateData, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization (only creator can update)
      if (meeting.createdBy !== userId) {
        throw new Error('Unauthorized to update this meeting');
      }

      const updatedMeeting = await meetingsRepository.updateMeeting(id, updateData);

      // Emit event
      eventBus.emitSafe('meeting.updated', {
        meeting: updatedMeeting,
        changes: updateData
      });

      return updatedMeeting;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel meeting
   */
  async cancelMeeting(id, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization
      if (meeting.createdBy !== userId) {
        throw new Error('Unauthorized to cancel this meeting');
      }

      const cancelledMeeting = await meetingsRepository.updateMeeting(id, {
        status: 'cancelled'
      });

      // Emit event
      eventBus.emitSafe('meeting.cancelled', {
        meeting: cancelledMeeting
      });

      return cancelledMeeting;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization (COMMENTED OUT FOR NOW)
      // if (meeting.createdBy !== userId) {
      //   throw new Error('Unauthorized to delete this meeting');
      // }

      await meetingsRepository.deleteMeeting(id);

      // Emit event
      eventBus.emitSafe('meeting.deleted', { meetingId: id });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add participant to meeting
   */
  async addParticipant(meetingId, participantData, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization
      if (meeting.createdBy !== userId) {
        throw new Error('Unauthorized to add participants');
      }

      const participant = await meetingsRepository.addParticipant(meetingId, participantData);

      // Send invitation email
      await emailQueue.add('send-invitation', {
        meeting: meeting.toJSON(),
        participant: participant.toJSON()
      });

      // Emit event
      eventBus.emitSafe('participant.added', {
        meeting,
        participant
      });

      return participant;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove participant from meeting
   */
  async removeParticipant(meetingId, participantId, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization
      if (meeting.createdBy !== userId) {
        throw new Error('Unauthorized to remove participants');
      }

      await meetingsRepository.removeParticipant(participantId);

      // Emit event
      eventBus.emitSafe('participant.removed', {
        meetingId,
        participantId
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * RSVP to meeting
   */
  async rsvpToMeeting(meetingId, participantId, status, message = null) {
    try {
      const participant = await meetingsRepository.updateParticipantStatus(
        participantId,
        status,
        message
      );

      // Emit event
      eventBus.emitSafe('participant.responded', {
        meetingId,
        participant,
        status
      });

      return participant;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start meeting
   */
  async startMeeting(id, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization (temporarily relaxed for development)
      // TODO: Re-enable strict auth when user authentication is implemented
      // if (meeting.createdBy !== userId) {
      //   throw new Error('Unauthorized to start this meeting');
      // }

      // Create Daily.co video room
      console.log('🎥 Creating Daily.co video room...');
      const roomData = await dailyVideoService.createRoom(
        `meeting-${id}`,
        meeting.title
      );

      const roomId = roomData.name;
      const meetingLink = roomData.url;

      // Update meeting with video room info
      const startedMeeting = await meetingsRepository.startMeeting(id, roomId, meetingLink);

      // Emit event
      eventBus.emitSafe('meeting.started', {
        meeting: startedMeeting,
        roomId,
        meetingLink,
        videoProvider: 'daily.co'
      });

      console.log(`✅ Meeting started with Daily.co: ${meetingLink}`);
      return startedMeeting;
    } catch (error) {
      throw error;
    }
  }

  /**
   * End meeting
   */
  async endMeeting(id, userId) {
    try {
      const meeting = await meetingsRepository.getMeetingById(id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check authorization (COMMENTED OUT FOR NOW)
      // if (meeting.createdBy !== userId) {
      //   throw new Error('Unauthorized to end this meeting');
      // }

      const endedMeeting = await meetingsRepository.endMeeting(id);

      // Emit event
      eventBus.emitSafe('meeting.ended', {
        meeting: endedMeeting
      });

      // Queue AI processing for summary and action items (disabled - Redis not configured)
      // if (aiQueue) {
      //   await aiQueue.add('generate-summary', {...});
      //   await aiQueue.add('extract-actions', {...});
      // }

      return endedMeeting;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create action item
   */
  async createActionItem(actionItemData, userId) {
    try {
      actionItemData.createdBy = userId;
      const actionItem = await meetingsRepository.createActionItem(actionItemData);

      // Emit event
      eventBus.emitSafe('action_item.created', {
        actionItem
      });

      return actionItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update action item
   */
  async updateActionItem(id, updateData, userId) {
    try {
      const actionItem = await meetingsRepository.updateActionItem(id, updateData);

      // Emit event
      eventBus.emitSafe('action_item.updated', {
        actionItem,
        changes: updateData
      });

      return actionItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get meetings by participant
   */
  async getMeetingsByParticipant(userId) {
    return await meetingsRepository.getMeetingsByParticipant(userId);
  }

  /**
   * Check for conflicts
   */
  async checkConflicts(participants, scheduledAt, durationMinutes) {
    try {
      // AI service disabled (Redis/AI not configured)
      return { hasConflicts: false, conflicts: [], message: "AI service not available" };
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return { hasConflicts: false, conflicts: [] };
    }
  }

  /**
   * Suggest meeting times (AI-powered)
   */
  async suggestMeetingTimes(participants, durationMinutes) {
    try {
      // AI service disabled (Redis/AI not configured)
      return { message: "AI service not available", suggestions: [] };
    } catch (error) {
      console.error('Error suggesting meeting times:', error);
      return [];
    }
  }

  /**
   * Track participant join
   */
  async trackParticipantJoin(meetingId, participantId) {
    try {
      const participant = await meetingsRepository.trackParticipantJoin(participantId);

      // Emit event
      eventBus.emitSafe('participant.joined', {
        meetingId,
        participant
      });

      return participant;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Track participant leave
   */
  async trackParticipantLeave(meetingId, participantId) {
    try {
      const participant = await meetingsRepository.trackParticipantLeave(participantId);

      // Emit event
      eventBus.emitSafe('participant.left', {
        meetingId,
        participant
      });

      return participant;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Schedule reminders for meeting
   */
  async scheduleReminders(meeting) {
    const scheduledTime = new Date(meeting.scheduledAt);
    const now = new Date();

    // Schedule 1-day-before reminder
    const oneDayBefore = new Date(scheduledTime.getTime() - 24 * 60 * 60 * 1000);
    if (oneDayBefore > now && meeting.participants) {
      for (const participant of meeting.participants) {
        const delay = oneDayBefore.getTime() - now.getTime();
        await emailQueue.add('send-reminder', {
          meeting: meeting.toJSON(),
          participant: participant.toJSON(),
          minutesBefore: 1440 // 24 hours
        }, { delay });
      }
    }

    // Schedule 15-minutes-before reminder
    const fifteenMinBefore = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
    if (fifteenMinBefore > now && meeting.participants) {
      for (const participant of meeting.participants) {
        const delay = fifteenMinBefore.getTime() - now.getTime();
        await emailQueue.add('send-reminder', {
          meeting: meeting.toJSON(),
          participant: participant.toJSON(),
          minutesBefore: 15
        }, { delay });
      }
    }
  }
}

/**
 * Direct-send helper: send all emails immediately (used always; queue is optional best-effort)
 */
async function sendEmailsDirect(meeting, participants) {
  try {
    console.log(`📧 Sending ${participants.length} emails directly...`);
    const meetingPlain = meeting.toJSON ? meeting.toJSON() : meeting;

    for (const participant of participants) {
      try {
        await emailService.sendMeetingInvitation(meetingPlain, participant.toJSON ? participant.toJSON() : participant);
      } catch (error) {
        console.error(`❌ Failed to send email to ${participant.email || participant.userId}:`, error.message);
      }
    }

    console.log('✅ Direct email sending completed');
  } catch (error) {
    console.error('❌ Direct email sending failed:', error.message);
  }
}

export default new MeetingsService();
