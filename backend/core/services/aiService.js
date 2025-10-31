import axios from 'axios';
import { aiQueue } from './queueService.js';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'gemini'
  }

  // Generate meeting summary from transcript
  async generateMeetingSummary(transcript) {
    if (!this.apiKey) {
      console.warn('No AI API key configured, returning basic summary');
      return 'Meeting completed. AI summary not available.';
    }

    try {
      if (this.provider === 'openai') {
        return await this.generateWithOpenAI(transcript);
      } else if (this.provider === 'gemini') {
        return await this.generateWithGemini(transcript);
      }
    } catch (error) {
      console.error('AI summary generation failed:', error);
      return 'Meeting completed. Summary generation failed.';
    }
  }

  async generateWithOpenAI(transcript) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a meeting assistant. Generate a concise summary of the meeting including key points, decisions made, and important discussions.'
          },
          {
            role: 'user',
            content: `Summarize this meeting transcript:\n\n${transcript}`
          }
        ],
        max_tokens: 500,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  async generateWithGemini(transcript) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{
            text: `Summarize this meeting transcript including key points, decisions made, and important discussions:\n\n${transcript}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  // Extract action items from transcript
  async extractActionItems(transcript) {
    if (!this.apiKey) {
      return [];
    }

    try {
      const prompt = `Extract action items from this meeting transcript. Format as JSON array with fields: title, description, priority (low/medium/high). Only return the JSON array, nothing else.\n\nTranscript:\n${transcript}`;

      let response;
      if (this.provider === 'openai') {
        response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You extract action items from meeting transcripts and return them as JSON.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.3
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const content = response.data.choices[0].message.content;
        return JSON.parse(content);
      } else if (this.provider === 'gemini') {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }]
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const content = response.data.candidates[0].content.parts[0].text;
        // Extract JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      }
    } catch (error) {
      console.error('Action item extraction failed:', error);
      return [];
    }
  }

  // Suggest optimal meeting times based on participants' schedules
  async suggestMeetingTimes(participants, duration, constraints = {}) {
    // This is a simplified version - in production, you'd integrate with calendar APIs
    const suggestions = [];
    const now = new Date();
    
    // Generate 3 suggestions for the next 7 days (business hours only)
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Suggest 10 AM
      const morning = new Date(date);
      morning.setHours(10, 0, 0, 0);
      suggestions.push({
        time: morning.toISOString(),
        confidence: 0.9,
        reason: 'Morning slot - typically high availability'
      });
      
      // Suggest 2 PM
      const afternoon = new Date(date);
      afternoon.setHours(14, 0, 0, 0);
      suggestions.push({
        time: afternoon.toISOString(),
        confidence: 0.85,
        reason: 'Afternoon slot - good for collaborative meetings'
      });
      
      if (suggestions.length >= 3) break;
    }
    
    return suggestions.slice(0, 3);
  }

  // Detect conflicts in schedule
  async detectConflicts(participantSchedules, proposedTime, duration) {
    const conflicts = [];
    
    // Simplified conflict detection
    // In production, integrate with calendar APIs (Google Calendar, Outlook, etc.)
    
    for (const participant of participantSchedules) {
      if (participant.existingMeetings) {
        const proposedStart = new Date(proposedTime);
        const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);
        
        for (const meeting of participant.existingMeetings) {
          const meetingStart = new Date(meeting.start);
          const meetingEnd = new Date(meeting.end);
          
          // Check for overlap
          if (
            (proposedStart >= meetingStart && proposedStart < meetingEnd) ||
            (proposedEnd > meetingStart && proposedEnd <= meetingEnd) ||
            (proposedStart <= meetingStart && proposedEnd >= meetingEnd)
          ) {
            conflicts.push({
              participantId: participant.id,
              participantName: participant.name,
              conflictingMeeting: meeting.title,
              conflictTime: meeting.start
            });
          }
        }
      }
    }
    
    return conflicts;
  }
}

// Queue processors for AI tasks
aiQueue.process('generate-summary', async (job) => {
  const aiService = new AIService();
  const { meetingId, transcript } = job.data;
  const summary = await aiService.generateMeetingSummary(transcript);
  return { meetingId, summary };
});

aiQueue.process('extract-actions', async (job) => {
  const aiService = new AIService();
  const { meetingId, transcript } = job.data;
  const actionItems = await aiService.extractActionItems(transcript);
  return { meetingId, actionItems };
});

export default new AIService();
