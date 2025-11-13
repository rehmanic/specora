import axios from 'axios';

/**
 * Daily.co Video Service
 * Handles video room creation and management
 */
class DailyService {
  constructor() {
    this.apiKey = process.env.DAILY_API_KEY;
    this.baseUrl = 'https://api.daily.co/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️  DAILY_API_KEY not set - video rooms will not be created');
    }
  }

  /**
   * Create a Daily.co room for a meeting
   * @param {string} meetingId - Unique meeting identifier
   * @param {string} roomName - Custom room name
   * @returns {Promise<Object>} Room details with URL
   */
  async createRoom(meetingId, roomName) {
    if (!this.apiKey) {
      console.warn('Daily.co API key not configured, returning mock room');
      return {
        url: `http://localhost:3001/meetings/room/${meetingId}`,
        name: roomName,
        mock: true
      };
    }

    try {
      const requestBody = {
        // Don't specify name - let Daily.co auto-generate to avoid naming conflicts
        privacy: 'public', // Changed to public for easier access
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          enable_recording: 'cloud',
          start_video_off: false,
          start_audio_off: false,
          owner_only_broadcast: false,
          enable_prejoin_ui: true,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expires in 24 hours
        }
      };

      console.log('📤 Daily.co Request:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${this.baseUrl}/rooms`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✓ Daily.co room created: ${response.data.url}`);
      
      return {
        url: response.data.url,
        name: response.data.name,
        created_at: response.data.created_at,
        config: response.data.config,
        dailyRoomId: response.data.id
      };
    } catch (error) {
      console.error('❌ Error creating Daily.co room:');
      console.error('   Status:', error.response?.status);
      console.error('   Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('   Message:', error.message);
      throw new Error(`Failed to create video room: ${error.response?.data?.error || error.response?.data?.info || error.message}`);
    }
  }

  /**
   * Delete a Daily.co room
   * @param {string} roomName - Room name to delete
   */
  async deleteRoom(roomName) {
    if (!this.apiKey) {
      console.warn('Daily.co API key not configured, skipping room deletion');
      return { deleted: false, mock: true };
    }

    try {
      await axios.delete(
        `${this.baseUrl}/rooms/${roomName}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      console.log(`✓ Daily.co room deleted: ${roomName}`);
      return { deleted: true };
    } catch (error) {
      console.error('Error deleting Daily.co room:', error.response?.data || error.message);
      throw new Error(`Failed to delete video room: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Get room details
   * @param {string} roomName - Room name
   */
  async getRoom(roomName) {
    if (!this.apiKey) {
      return { name: roomName, mock: true };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/rooms/${roomName}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting Daily.co room:', error.response?.data || error.message);
      throw new Error(`Failed to get room details: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Get room recordings
   * @param {string} roomName - Room name
   */
  async getRecordings(roomName) {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/recordings`,
        {
          params: { room_name: roomName },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Error getting recordings:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Create a meeting token for participant authentication
   * @param {string} roomName - Room name
   * @param {Object} participantInfo - Participant details
   */
  async createMeetingToken(roomName, participantInfo = {}) {
    if (!this.apiKey) {
      return 'mock-token';
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/meeting-tokens`,
        {
          properties: {
            room_name: roomName,
            user_name: participantInfo.name || 'Guest',
            is_owner: participantInfo.isOwner || false,
            enable_recording: 'cloud'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.token;
    } catch (error) {
      console.error('Error creating meeting token:', error.response?.data || error.message);
      throw new Error(`Failed to create meeting token: ${error.response?.data?.error || error.message}`);
    }
  }
}

export default new DailyService();
