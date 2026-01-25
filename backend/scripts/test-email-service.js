import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import emailService from '../core/services/emailService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Test meeting object
const testMeeting = {
  id: 'test-meeting-' + Date.now(),
  title: 'Test Meeting - Email Verification',
  description: 'This is a test email to verify your SMTP and email service setup.',
  scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
  durationMinutes: 60,
  meetingLink: 'https://go-specora.daily.co/test-meeting-' + Date.now(),
  location: 'Virtual',
  participants: [
    { email: 'bilalrazaswe@gmail.com', name: 'Bilal Raza 1' },
    { email: 'bilalrazaprotoit@gmail.com', name: 'Bilal Raza 2' }
  ]
};

async function testEmailService() {
  console.log('\n' + '='.repeat(70));
  console.log('📧 EMAIL SERVICE DIAGNOSTIC & TEST');
  console.log('='.repeat(70) + '\n');

  console.log('Configuration:');
  console.log(`  SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`  SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`  SMTP User: ${process.env.SMTP_USER}`);
  console.log(`  From Name: ${process.env.EMAIL_FROM_NAME}`);
  console.log(`  From Address: ${process.env.EMAIL_FROM_ADDRESS}\n`);

  console.log('Test Meeting Details:');
  console.log(`  Title: ${testMeeting.title}`);
  console.log(`  Meeting Link: ${testMeeting.meetingLink}`);
  console.log(`  Scheduled At: ${testMeeting.scheduledAt.toLocaleString()}`);
  console.log(`  Participants: ${testMeeting.participants.length}`);
  testMeeting.participants.forEach((p, i) => {
    console.log(`    ${i + 1}. ${p.name} <${p.email}>`);
  });
  console.log();

  let successCount = 0;
  let failCount = 0;

  for (const participant of testMeeting.participants) {
    console.log(`\n📧 Sending test email to: ${participant.email}`);
    console.log(`   Recipient: ${participant.name}`);
    
    try {
      const result = await emailService.sendMeetingInvitation(testMeeting, participant);
      console.log(`   ✅ SUCCESS - Message ID: ${result.messageId}`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ FAILED - Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`📊 TEST RESULTS: ${successCount} sent, ${failCount} failed`);
  console.log('='.repeat(70) + '\n');

  if (successCount === testMeeting.participants.length) {
    console.log('✅ All emails sent successfully!');
    console.log('   Check your inbox for the test emails with:');
    console.log('   - Professional HTML formatting');
    console.log('   - Meeting details (date, time, duration)');
    console.log('   - List of participants');
    console.log('   - Daily.co meeting link');
    console.log('   - Calendar invite (.ics file) attachment\n');
    process.exit(0);
  } else if (successCount > 0) {
    console.log(`⚠️  Partial success: ${successCount}/${testMeeting.participants.length} emails sent`);
    console.log('   Check the errors above for failed addresses.\n');
    process.exit(1);
  } else {
    console.log('❌ All emails failed. Check SMTP configuration:');
    console.log('   1. Verify SMTP_USER and SMTP_PASS in .env');
    console.log('   2. Ensure Gmail 2FA is enabled');
    console.log('   3. Use app password, not account password');
    console.log('   4. Check firewall on port 587\n');
    process.exit(1);
  }
}

testEmailService().catch(error => {
  console.error('❌ Test failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
