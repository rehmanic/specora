import nodemailer from 'nodemailer';
import ical from 'ical-generator';
import { emailQueue } from './queueService.js';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Generate calendar invite (.ics file)
  generateCalendarInvite(meeting) {
    const calendar = ical({ name: 'Specora Meeting' });
    
    let description = meeting.description || '';
    if (meeting.meetingLink) {
      description += `\n\nJoin meeting: ${meeting.meetingLink}`;
    }
    
    calendar.createEvent({
      start: new Date(meeting.scheduledAt),
      end: new Date(new Date(meeting.scheduledAt).getTime() + meeting.durationMinutes * 60000),
      summary: meeting.title,
      description: description,
      location: meeting.location || meeting.meetingLink || 'Virtual',
      url: meeting.meetingLink,
      uid: meeting.id,
      sequence: 0,
      status: 'CONFIRMED'
    });

    return calendar.toString();
  }

  // Send meeting invitation
  async sendMeetingInvitation(meeting, participant) {
    const calendar = this.generateCalendarInvite(meeting);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const rsvpToken = Buffer.from(`${meeting.id}:${participant.id}`).toString('base64');
    
    const acceptUrl = `${frontendUrl}/api/meetings/${meeting.id}/rsvp?token=${rsvpToken}&response=accepted`;
    const declineUrl = `${frontendUrl}/api/meetings/${meeting.id}/rsvp?token=${rsvpToken}&response=declined`;
    const tentativeUrl = `${frontendUrl}/api/meetings/${meeting.id}/rsvp?token=${rsvpToken}&response=tentative`;

    const mailOptions = {
      from: `"Specora Meetings" <${process.env.SMTP_USER}>`,
      to: participant.email || participant.userId, // Handle both external and internal
      subject: `Meeting Invitation: ${meeting.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .meeting-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            .buttons { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 12px 30px; margin: 0 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .btn-accept { background: #10b981; color: white; }
            .btn-decline { background: #ef4444; color: white; }
            .btn-tentative { background: #f59e0b; color: white; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📅 Meeting Invitation</h1>
            </div>
            <div class="content">
              <p>Hello ${participant.name || 'there'},</p>
              <p>You've been invited to attend the following meeting:</p>
              
              <div class="meeting-details">
                <h2 style="margin-top: 0; color: #4F46E5;">${meeting.title}</h2>
                ${meeting.description ? `<p>${meeting.description}</p>` : ''}
                
                <div class="detail-row">
                  <span class="label">📆 When:</span>
                  <span class="value">${new Date(meeting.scheduledAt).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">⏱️ Duration:</span>
                  <span class="value">${meeting.durationMinutes} minutes</span>
                </div>
                
                ${meeting.meetingType === 'virtual' ? `
                  <div class="detail-row">
                    <span class="label">🌐 Type:</span>
                    <span class="value">Virtual Meeting</span>
                  </div>
                ` : ''}
                
                ${meeting.location ? `
                  <div class="detail-row">
                    <span class="label">📍 Location:</span>
                    <span class="value">${meeting.location}</span>
                  </div>
                ` : ''}
                
                ${meeting.meetingLink ? `
                  <div class="detail-row">
                    <span class="label">🎥 Meeting Link:</span>
                    <span class="value"><a href="${meeting.meetingLink}" style="color: #4F46E5; text-decoration: none; font-weight: bold;">${meeting.meetingLink}</a></span>
                  </div>
                ` : ''}
              </div>

              ${meeting.meetingLink ? `
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${meeting.meetingLink}" style="display: inline-block; padding: 15px 40px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    🎥 Join Meeting
                  </a>
                  <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
                    Click the button above to join the video meeting
                  </p>
                </div>
              ` : ''}

              <div class="buttons">
                <a href="${acceptUrl}" class="button btn-accept">✓ Accept</a>
                <a href="${tentativeUrl}" class="button btn-tentative">? Tentative</a>
                <a href="${declineUrl}" class="button btn-decline">✗ Decline</a>
              </div>

              <p style="text-align: center; color: #6b7280; font-size: 14px;">
                A calendar invitation (.ics file) is attached to this email.
              </p>

              <div class="footer">
                <p>This is an automated message from Specora Meetings</p>
                <p>© ${new Date().getFullYear()} Specora. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      icalEvent: {
        filename: 'meeting.ics',
        method: 'REQUEST',
        content: calendar
      }
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✓ Invitation sent to ${participant.email || participant.userId}`);
      return true;
    } catch (error) {
      console.error('✗ Failed to send invitation:', error);
      throw error;
    }
  }

  // Send meeting reminder
  async sendMeetingReminder(meeting, participant, minutesBefore) {
    const mailOptions = {
      from: `"Specora Meetings" <${process.env.SMTP_USER}>`,
      to: participant.email || participant.userId,
      subject: `Reminder: ${meeting.title} starts in ${minutesBefore} minutes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🔔 Meeting Reminder</h2>
          <p>Your meeting "<strong>${meeting.title}</strong>" starts in ${minutesBefore} minutes.</p>
          <p><strong>Time:</strong> ${new Date(meeting.scheduledAt).toLocaleString()}</p>
          ${meeting.meetingLink ? `<p><a href="${meeting.meetingLink}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Join Meeting</a></p>` : ''}
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send meeting summary
  async sendMeetingSummary(meeting, participants, summary) {
    const participantEmails = participants.map(p => p.email || p.userId).filter(Boolean);

    const mailOptions = {
      from: `"Specora Meetings" <${process.env.SMTP_USER}>`,
      to: participantEmails,
      subject: `Meeting Summary: ${meeting.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">📝 Meeting Summary</h2>
          <h3>${meeting.title}</h3>
          <p><strong>Date:</strong> ${new Date(meeting.scheduledAt).toLocaleDateString()}</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${summary}
          </div>
          <p style="color: #6b7280; font-size: 12px;">Generated by Specora AI</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

// Queue processors
emailQueue.process('send-invitation', async (job) => {
  const emailService = new EmailService();
  const { meeting, participant, participants } = job.data;
  
  // Handle both single participant and multiple participants
  if (participant) {
    await emailService.sendMeetingInvitation(meeting, participant);
  } else if (participants && Array.isArray(participants)) {
    for (const p of participants) {
      try {
        await emailService.sendMeetingInvitation(meeting, p);
      } catch (error) {
        console.error(`Failed to send invitation to ${p.email}:`, error.message);
      }
    }
  }
});

emailQueue.process('send-reminder', async (job) => {
  const emailService = new EmailService();
  const { meeting, participant, minutesBefore } = job.data;
  await emailService.sendMeetingReminder(meeting, participant, minutesBefore);
});

emailQueue.process('send-summary', async (job) => {
  const emailService = new EmailService();
  const { meeting, participants, summary } = job.data;
  await emailService.sendMeetingSummary(meeting, participants, summary);
});

export default new EmailService();
