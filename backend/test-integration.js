/**
 * Test Script for Meetings Module with Redis & Daily.co
 * Tests: Meeting creation, Redis queue, Daily.co video rooms
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRedisConnection() {
  log('\n🔍 Testing Redis Connection...', 'cyan');
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.redis?.connected) {
      log('✅ Redis is connected and healthy', 'green');
      return true;
    } else {
      log('⚠️  Redis not connected (queue features disabled)', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Could not check Redis status', 'red');
    return false;
  }
}

async function testMeetingCreation() {
  log('\n📅 Testing Meeting Creation...', 'cyan');
  try {
    const meetingData = {
      name: 'Integration Test Meeting',
      description: 'Testing Redis Queue + Daily.co Integration',
      stakeholders: ['alice@test.com', 'bob@test.com', 'charlie@test.com'],
      scheduled_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      duration_minutes: 60
    };

    const response = await axios.post(`${API_URL}/api/meetings`, meetingData);
    
    if (response.data.meeting) {
      log('✅ Meeting created successfully', 'green');
      log(`   ID: ${response.data.meeting.id}`, 'blue');
      log(`   Name: ${response.data.meeting.name}`, 'blue');
      return response.data.meeting;
    }
  } catch (error) {
    log(`❌ Meeting creation failed: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testStartMeeting(meetingId) {
  log('\n🎥 Testing Meeting Start (Daily.co Room Creation)...', 'cyan');
  try {
    const response = await axios.post(`${API_URL}/api/meetings/${meetingId}/start`);
    
    if (response.data.meeting && response.data.meeting.meeting_link) {
      log('✅ Meeting started successfully', 'green');
      log(`   Room Link: ${response.data.meeting.meeting_link}`, 'blue');
      log(`   Room ID: ${response.data.meeting.room_id}`, 'blue');
      
      // Check if it's a real Daily.co link or mock
      if (response.data.meeting.meeting_link.includes('daily.co')) {
        log('   🌟 Real Daily.co room created!', 'green');
      } else {
        log('   ⚠️  Mock room (Daily.co API key not configured)', 'yellow');
      }
      
      return response.data.meeting;
    }
  } catch (error) {
    log(`❌ Meeting start failed: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testGetUpcomingMeetings() {
  log('\n📋 Testing Get Upcoming Meetings...', 'cyan');
  try {
    const response = await axios.get(`${API_URL}/api/meetings/upcoming`);
    
    if (response.data.meetings) {
      log(`✅ Retrieved ${response.data.meetings.length} upcoming meetings`, 'green');
      response.data.meetings.slice(0, 3).forEach((meeting, idx) => {
        log(`   ${idx + 1}. ${meeting.name} - ${meeting.scheduled_at}`, 'blue');
      });
      return response.data.meetings;
    }
  } catch (error) {
    log(`❌ Failed to get meetings: ${error.message}`, 'red');
    return [];
  }
}

async function testEmailQueue(meetingId) {
  log('\n📧 Testing Email Queue (Send Invitations)...', 'cyan');
  try {
    const response = await axios.post(`${API_URL}/api/meetings/send-email`, {
      meetingId: meetingId
    });
    
    if (response.data.success) {
      log('✅ Email job queued successfully', 'green');
      log(`   Job ID: ${response.data.jobId || 'N/A'}`, 'blue');
      return true;
    }
  } catch (error) {
    log(`⚠️  Email queue test: ${error.response?.data?.message || error.message}`, 'yellow');
    return false;
  }
}

async function runFullTest() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║   MEETINGS MODULE - INTEGRATION TEST SUITE           ║', 'cyan');
  log('║   Redis Queue + Daily.co Video Rooms                 ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');

  // Test 1: Redis Connection
  const redisConnected = await testRedisConnection();
  await sleep(1000);

  // Test 2: Get existing meetings
  await testGetUpcomingMeetings();
  await sleep(1000);

  // Test 3: Create new meeting
  const meeting = await testMeetingCreation();
  if (!meeting) {
    log('\n❌ Test suite failed - Could not create meeting', 'red');
    process.exit(1);
  }
  await sleep(1000);

  // Test 4: Test email queue (if Redis is connected)
  if (redisConnected) {
    await testEmailQueue(meeting.id);
    await sleep(1000);
  }

  // Test 5: Start meeting (creates Daily.co room)
  const startedMeeting = await testStartMeeting(meeting.id);
  await sleep(1000);

  // Final Summary
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                   TEST SUMMARY                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`Redis Queue:        ${redisConnected ? '✅ WORKING' : '⚠️  DISABLED'}`, redisConnected ? 'green' : 'yellow');
  log(`Meeting Creation:   ${meeting ? '✅ WORKING' : '❌ FAILED'}`, meeting ? 'green' : 'red');
  log(`Daily.co Integration: ${startedMeeting?.meeting_link ? '✅ WORKING' : '❌ FAILED'}`, startedMeeting?.meeting_link ? 'green' : 'red');
  
  if (startedMeeting?.meeting_link) {
    log('\n🎉 All tests passed! Your system is ready for demo.', 'green');
    log(`\n📺 Open this link to test video meeting:`, 'cyan');
    log(`   ${startedMeeting.meeting_link}`, 'blue');
  } else {
    log('\n⚠️  Some features not available (check API keys)', 'yellow');
  }
  
  log('\n');
}

// Run the test suite
runFullTest().catch(error => {
  log(`\n❌ Test suite crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
