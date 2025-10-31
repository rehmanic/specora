import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_DOMAIN = process.env.DAILY_DOMAIN;
const DAILY_API_URL = 'https://api.daily.co/v1';

class DailyVideoService {
  /**
   * Create a Daily.co room for a meeting
   */
  async createRoom(meetingId, meetingName) {
    try {
      if (!DAILY_API_KEY || DAILY_API_KEY === 'your-daily-api-key-here') {
        // Fallback: Generate a demo room URL (won't actually work but shows UI)
        console.warn('⚠️  Daily.co API key not configured - using demo URL');
        return {
          url: `https://demo.daily.co/${meetingId}`,
          name: meetingId,
          isDemo: true
        };
      }

      const response = await fetch(`${DAILY_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: meetingId,
          privacy: 'private', // or 'public'
          properties: {
            max_participants: 20,
            enable_chat: true,
            enable_screenshare: true,
            enable_recording: 'cloud', // Enable cloud recording
            enable_knocking: true,
            start_video_off: false,
            start_audio_off: false,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hour expiry
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Daily.co API error: ${error.error}`);
      }

      const room = await response.json();
      console.log(`✅ Daily.co room created: ${room.url}`);
      
      return {
        url: room.url,
        name: room.name,
        isDemo: false
      };
    } catch (error) {
      console.error('❌ Error creating Daily.co room:', error.message);
      // Fallback to demo URL
      return {
        url: `https://demo.daily.co/${meetingId}`,
        name: meetingId,
        isDemo: true,
        error: error.message
      };
    }
  }

  /**
   * Delete a Daily.co room
   */
  async deleteRoom(roomName) {
    try {
      if (!DAILY_API_KEY || DAILY_API_KEY === 'your-daily-api-key-here') {
        console.warn('⚠️  Daily.co API key not configured - skipping deletion');
        return { deleted: false, isDemo: true };
      }

      const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Daily.co API error: ${error.error}`);
      }

      console.log(`✅ Daily.co room deleted: ${roomName}`);
      return { deleted: true };
    } catch (error) {
      console.error('❌ Error deleting Daily.co room:', error.message);
      return { deleted: false, error: error.message };
    }
  }

  /**
   * Get room information
   */
  async getRoomInfo(roomName) {
    try {
      if (!DAILY_API_KEY || DAILY_API_KEY === 'your-daily-api-key-here') {
        return null;
      }

      const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error getting room info:', error.message);
      return null;
    }
  }

  /**
   * Create a meeting token for a participant (for private rooms)
   */
  async createMeetingToken(roomName, participantName) {
    try {
      if (!DAILY_API_KEY || DAILY_API_KEY === 'your-daily-api-key-here') {
        return null;
      }

      const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_name: participantName,
            enable_recording: 'cloud',
            start_video_off: false,
            start_audio_off: false
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Daily.co API error: ${error.error}`);
      }

      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error('❌ Error creating meeting token:', error.message);
      return null;
    }
  }

  /**
   * Get recording links for a room
   */
  async getRecordings(roomName) {
    try {
      if (!DAILY_API_KEY || DAILY_API_KEY === 'your-daily-api-key-here') {
        return [];
      }

      const response = await fetch(`${DAILY_API_URL}/recordings?room=${roomName}`, {
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('❌ Error getting recordings:', error.message);
      return [];
    }
  }
}

export default new DailyVideoService();
