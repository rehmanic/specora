import meetingsRepository from "./repository.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MeetingsService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Get upcoming meetings
   */
  async getUpcomingMeetings() {
    return await meetingsRepository.getUpcomingMeetings();
  }

  /**
   * Get completed meetings
   */
  async getCompletedMeetings() {
    return await meetingsRepository.getCompletedMeetings();
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
   * Schedule a new meeting
   */
  async scheduleMeeting(meetingData, scheduledByUser = "System") {
    // Add scheduled_by field
    const dataWithScheduler = {
      ...meetingData,
      scheduled_by: scheduledByUser,
    };

    const meeting = await meetingsRepository.createMeeting(dataWithScheduler);
    return meeting;
  }

  /**
   * Update meeting
   */
  async updateMeeting(id, updateData) {
    return await meetingsRepository.updateMeeting(id, updateData);
  }

  /**
   * Mark meeting as completed
   */
  async markAsCompleted(id, recordingLink = null) {
    return await meetingsRepository.markAsCompleted(id, recordingLink);
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(id) {
    return await meetingsRepository.deleteMeeting(id);
  }

  /**
   * Send meeting invitation emails
   */
  async sendMeetingInvites(meeting) {
    try {
      const { name, description, stakeholders, scheduled_by, meeting_link, scheduled_at } = meeting;

      // Format date and time
      const meetingDate = new Date(scheduled_at);
      const formattedDate = meetingDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = meetingDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Email template
      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .meeting-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .detail-row {
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
              color: #667eea;
              margin-right: 10px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📅 Meeting Invitation</h1>
            <p>Specora - Requirements Engineering Platform</p>
          </div>
          <div class="content">
            <h2>You're invited to: ${name}</h2>
            <p>${description}</p>
            
            <div class="meeting-details">
              <div class="detail-row">
                <span class="detail-label">📆 Date:</span>
                <span>${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Time:</span>
                <span>${formattedTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">👤 Organized by:</span>
                <span>${scheduled_by}</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${meeting_link}" class="button">Join Meeting</a>
            </div>

            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              <strong>Meeting Link:</strong><br/>
              <a href="${meeting_link}" style="color: #667eea; word-break: break-all;">${meeting_link}</a>
            </p>

            <div class="footer">
              <p>This is an automated invitation from Specora.</p>
              <p>© 2025 Specora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email to each stakeholder
      const emailPromises = stakeholders.map((stakeholder) =>
        this.transporter.sendMail({
          from: `"Specora Meetings" <${process.env.SMTP_USER}>`,
          to: stakeholder,
          subject: `Meeting Invite: ${name}`,
          html: emailHTML,
        })
      );

      await Promise.all(emailPromises);
      return {
        success: true,
        message: `Invitations sent to ${stakeholders.length} stakeholder(s)`,
      };
    } catch (error) {
      console.error("Error sending meeting invites:", error);
      throw new Error(`Failed to send meeting invites: ${error.message}`);
    }
  }

  /**
   * Search meetings
   */
  async searchMeetings(query) {
    return await meetingsRepository.searchMeetings(query);
  }
}

export default new MeetingsService();
