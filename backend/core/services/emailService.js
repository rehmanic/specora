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

    // Verify connection on init
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP connection failed:', error.message);
      } else {
        console.log('✅ SMTP connection verified');
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
      start: new Date(meeting.scheduledAt || meeting.scheduled_at),
      end: new Date(new Date(meeting.scheduledAt || meeting.scheduled_at).getTime() + (meeting.durationMinutes || meeting.duration_minutes || 60) * 60000),
      summary: meeting.title,
      description: meeting.description || '',
      location: meeting.location || meeting.meetingLink || meeting.meeting_link || 'Virtual',
      url: meeting.meetingLink || meeting.meeting_link,
      uid: meeting.id,
      sequence: 0,
      status: 'CONFIRMED'
    });

    return calendar.toString();
  }

  // Send meeting invitation email
  async sendMeetingInvitation(meeting, participant) {
    try {
      if (!meeting.meetingLink && !meeting.meeting_link) {
        console.warn('⚠️  No meeting link available for email');
      }

      const meetingLink = meeting.meetingLink || meeting.meeting_link;
      const calendar = this.generateCalendarInvite(meeting);
      const participantEmail = participant.email || participant.userId;
      const participantName = participant.name || participantEmail.split('@')[0];

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Specora Meetings'}" <${process.env.SMTP_USER}>`,
        to: participantEmail,
        subject: `📅 Meeting Invitation: ${meeting.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
              .email-wrapper { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { padding: 30px 20px; }
              .meeting-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .detail-row { margin: 12px 0; display: flex; align-items: flex-start; }
              .detail-icon { width: 24px; margin-right: 10px; font-size: 18px; }
              .detail-label { font-weight: 600; color: #667eea; min-width: 80px; }
              .detail-value { color: #111827; }
              .participants { margin: 15px 0; }
              .participant-item { background: white; padding: 8px 12px; margin: 5px 0; border-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; }
              .join-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .join-button:hover { background: #5568d3; }
              .calendar-notice { background: #dbeafe; color: #1e40af; padding: 12px; border-radius: 4px; font-size: 13px; margin: 15px 0; border-left: 4px solid #1e40af; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
              .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email-wrapper">
                <div class="header">
                  <h1>📅 Meeting Invitation</h1>
                </div>
                
                <div class="content">
                  <p>Hello <strong>${participantName}</strong>,</p>
                  <p>You've been invited to attend the following meeting:</p>
                  
                  <div class="meeting-details">
                    <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">${meeting.title}</h2>
                    ${meeting.description ? `<p style="margin: 10px 0; color: #6b7280;">${meeting.description}</p>` : ''}
                    
                    <div class="detail-row">
                      <span class="detail-icon">📆</span>
                      <div>
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${new Date(meeting.scheduledAt || meeting.scheduled_at).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-icon">⏰</span>
                      <div>
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${new Date(meeting.scheduledAt || meeting.scheduled_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}</span>
                      </div>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-icon">⏱️</span>
                      <div>
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${meeting.durationMinutes || meeting.duration_minutes || 60} minutes</span>
                      </div>
                    </div>

                    ${meeting.location ? `
                      <div class="detail-row">
                        <span class="detail-icon">📍</span>
                        <div>
                          <span class="detail-label">Location:</span>
                          <span class="detail-value">${meeting.location}</span>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <div class="participants">
                    <p style="font-weight: 600; color: #667eea; margin-bottom: 8px;">👥 Participants:</p>
                    ${meeting.participants && meeting.participants.length > 0 
                      ? meeting.participants.map(p => `<div class="participant-item">${p.email || p.name || p.userId}</div>`).join('')
                      : '<div class="participant-item">No other participants</div>'
                    }
                  </div>

                  ${meetingLink ? `
                    <div style="text-align: center;">
                      <a href="${meetingLink}" class="join-button">Click to Join Meeting</a>
                    </div>
                    <p style="text-align: center; color: #6b7280; font-size: 14px;">
                      <strong>Meeting Link:</strong><br/>
                      <a href="${meetingLink}" style="color: #667eea; word-break: break-all;">${meetingLink}</a>
                    </p>
                  ` : ''}

                  <div class="calendar-notice">
                    📎 A calendar invitation (.ics file) is attached to this email. You can import it to your calendar application.
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #6b7280; font-size: 14px;">If you have any questions, please don't hesitate to reach out.</p>
                  </div>
                </div>
                
                <div class="footer">
                  <p style="margin: 0;">This is an automated message from <strong>Specora Meetings</strong></p>
                  <p style="margin: 5px 0;">© ${new Date().getFullYear()} Specora. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: 'meeting.ics',
            content: calendar,
            contentType: 'text/calendar'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${participantEmail}. Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId, email: participantEmail };
    } catch (error) {
      console.error(`❌ Failed to send email to ${participant.email || participant.userId}:`, error.message);
      throw error;
    }
  }
}

// Queue processors
emailQueue.process('send-invitation', async (job) => {
  try {
    const emailService = new EmailService();
    const { meeting, participants } = job.data;

    if (!participants || participants.length === 0) {
      console.log('⚠️  No participants to send emails to');
      return { skipped: true, reason: 'No participants' };
    }

    console.log(`📧 Processing email job for meeting: ${meeting.title} (${participants.length} participants)`);

    const results = [];
    for (const participant of participants) {
      try {
        const result = await emailService.sendMeetingInvitation(meeting, participant);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send to ${participant.email || participant.userId}:`, error.message);
        results.push({
          success: false,
          email: participant.email || participant.userId,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    console.log(`📊 Email job completed: ${successCount} sent, ${failCount} failed`);

    return {
      success: true,
      sent: successCount,
      failed: failCount,
      results
    };
  } catch (error) {
    console.error('❌ Error processing email job:', error.message);
    throw error;
  }
});

emailQueue.on('completed', (job) => {
  console.log(`✓ Email job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`✗ Email job ${job.id} failed:`, err.message);
});

export default new EmailService();
