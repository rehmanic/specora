import meetingsRepository from './repository.js';
import dailyVideoService from './dailyService.js';
import eventBus from '../../core/events/eventBus.js';

/**
 * Daily.co Webhook Controller
 * Handles webhooks from Daily.co for meeting lifecycle events
 */
class WebhookController {
  /**
   * Handle Daily.co webhook events
   * POST /api/meetings/webhook/daily
   */
  async handleDailyWebhook(req, res) {
    try {
      const event = req.body;
      
      console.log('📨 Daily.co webhook received:', event.type);

      // Handle different Daily.co event types
      switch (event.type) {
        case 'room.ended':
          await this.handleRoomEnded(event);
          break;
        
        case 'recording.ready-to-download':
          await this.handleRecordingReady(event);
          break;
        
        case 'recording.started':
          console.log('Recording started for room:', event.room);
          break;
        
        case 'room.exp-updated':
          console.log('Room expiry updated:', event.room);
          break;
        
        default:
          console.log('Unhandled webhook type:', event.type);
      }

      res.status(200).json({ success: true, received: true });
    } catch (error) {
      console.error('Error handling Daily.co webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * Handle room ended event
   * When Daily.co meeting room is closed/ended
   */
  async handleRoomEnded(event) {
    try {
      const { room, room_name, ended_at } = event;
      const roomId = room_name || room;

      console.log(`🏁 Meeting room ended: ${roomId}`);

      // Find meeting by room_id
      const meeting = await meetingsRepository.findByRoomId(roomId);
      
      if (!meeting) {
        console.warn(`No meeting found for room: ${roomId}`);
        return;
      }

      // End the meeting (set status to completed)
      const endedMeeting = await meetingsRepository.endMeeting(meeting.id);

      // Emit event
      eventBus.emitSafe('meeting.ended', {
        meeting: endedMeeting,
        roomId,
        endedAt: ended_at
      });

      console.log(`✅ Meeting ${meeting.id} marked as completed`);
    } catch (error) {
      console.error('Error handling room.ended:', error);
      throw error;
    }
  }

  /**
   * Handle recording ready event
   * When Daily.co has finished processing the recording
   */
  async handleRecordingReady(event) {
    try {
      const { room, room_name, recording } = event;
      const roomId = room_name || room;
      const recordingUrl = recording?.download_link || recording?.play_url;

      console.log(`🎥 Recording ready for room: ${roomId}`);
      console.log(`📹 Recording URL: ${recordingUrl}`);

      if (!recordingUrl) {
        console.warn('No recording URL in webhook event');
        return;
      }

      // Find meeting by room_id
      const meeting = await meetingsRepository.findByRoomId(roomId);
      
      if (!meeting) {
        console.warn(`No meeting found for room: ${roomId}`);
        return;
      }

      // Update meeting with recording link
      await meetingsRepository.updateMeeting(meeting.id, {
        recordingLink: recordingUrl
      });

      // Emit event
      eventBus.emitSafe('recording.ready', {
        meetingId: meeting.id,
        roomId,
        recordingUrl
      });

      console.log(`✅ Recording link saved for meeting ${meeting.id}`);
    } catch (error) {
      console.error('Error handling recording.ready:', error);
      throw error;
    }
  }
}

export default new WebhookController();
