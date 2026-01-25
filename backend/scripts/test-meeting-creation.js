import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';
import meetingsService from '../modules/meetings/service.js';
import '../database/models/index.js'; // Load models

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testMeetingCreation() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 FULL MEETING CREATION TEST WITH EMAIL DELIVERY');
  console.log('='.repeat(70) + '\n');

  try {
    // Sync database
    console.log('🔄 Syncing database...');
    await sequelize.sync();
    console.log('✅ Database synced\n');

    // Get User model
    const { User } = sequelize.models;

    // Create or get test user
    console.log('👤 Setting up test user...');
    const testUser = await User.findOrCreate({
      where: { email: 'i222559@nu.edu.pk' },
      defaults: {
        email: 'i222559@nu.edu.pk',
        name: 'Specora Admin',
        password: 'test123456'
      }
    });
    const userId = testUser[0].id;
    console.log(`✅ Test user: ${testUser[0].name} (${testUser[0].email})\n`);

    // Create test meeting
    const meetingData = {
      title: '🎯 Specora System Test - Email Verification',
      description: 'This is an automated test to verify email delivery to stakeholders. Please check your inbox.',
      scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
      durationMinutes: 60,
      location: 'Virtual Meeting',
      agendaItems: ['System verification', 'Email delivery test'],
      participants: [
        {
          email: 'bilalrazaswe@gmail.com',
          name: 'Bilal Raza 1'
        },
        {
          email: 'bilalrazaprotoit@gmail.com',
          name: 'Bilal Raza 2'
        }
      ]
    };

    console.log('📋 Creating test meeting...');
    console.log(`   Title: ${meetingData.title}`);
    console.log(`   Scheduled At: ${meetingData.scheduledAt.toLocaleString()}`);
    console.log(`   Duration: ${meetingData.durationMinutes} minutes`);
    console.log(`   Participants:`);
    meetingData.participants.forEach((p, i) => {
      console.log(`     ${i + 1}. ${p.name} <${p.email}>`);
    });
    console.log();

    const startTime = Date.now();
    const meeting = await meetingsService.scheduleMeeting(meetingData, userId);
    const duration = Date.now() - startTime;

    console.log('\n✅ Meeting created successfully!');
    console.log(`   Meeting ID: ${meeting.id}`);
    console.log(`   Meeting Link: ${meeting.meetingLink}`);
    console.log(`   Creation time: ${duration}ms`);
    console.log(`   Participants count: ${meeting.participants?.length || 0}`);

    console.log('\n' + '='.repeat(70));
    console.log('📧 EMAIL DELIVERY VERIFICATION');
    console.log('='.repeat(70));
    console.log('\n⏳ Waiting 3 seconds for emails to be sent...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Test complete!');
    console.log('\nNext steps:');
    console.log('1. Check inbox for bilalrazaswe@gmail.com');
    console.log('2. Check inbox for bilalrazaprotoit@gmail.com');
    console.log('3. Verify email contains:');
    console.log('   - Meeting title and description');
    console.log('   - Date and time');
    console.log('   - List of participants');
    console.log('   - Direct link to Daily.co video room');
    console.log('   - Calendar invite (.ics file) attachment');
    console.log('4. Click "Join Meeting" to verify the link works\n');

    console.log('📝 Meeting Details for Reference:');
    console.log(`   ID: ${meeting.id}`);
    console.log(`   Link: ${meeting.meetingLink}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testMeetingCreation();
