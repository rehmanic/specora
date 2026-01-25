#!/usr/bin/env node

/**
 * Test meeting creation via HTTP API
 * This tests the full flow: meeting creation → email sending
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_URL = process.env.API_URL || 'http://localhost:5001';

async function testMeetingViaAPI() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TESTING MEETING CREATION VIA API');
  console.log('='.repeat(70) + '\n');

  console.log(`📍 API URL: ${API_URL}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}\n`);

  // First, create a user and get auth (simulated with hardcoded userId)
  const userId = 'test-user-' + Date.now();
  
  const meetingPayload = {
    title: '🎯 Specora Email Test Meeting',
    description: 'This is an automated test to verify email delivery. Please check your inboxes.',
    name: '🎯 Specora Email Test Meeting', // frontend sends 'name'
    scheduled_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    durationMinutes: 60,
    duration: 60,
    location: 'Virtual',
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

  console.log('📋 Meeting payload:');
  console.log(JSON.stringify(meetingPayload, null, 2));
  console.log('\n');

  try {
    console.log('📨 Sending POST request to /api/meetings...\n');
    
    const response = await fetch(`${API_URL}/api/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Id': userId // Simulate authenticated user
      },
      body: JSON.stringify(meetingPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error (${response.status}):`, data);
      process.exit(1);
    }

    console.log('✅ Meeting created successfully!\n');
    console.log('📊 Response:');
    console.log(JSON.stringify(data, null, 2));

    if (data.data) {
      const meeting = data.data;
      console.log('\n' + '='.repeat(70));
      console.log('📧 EMAIL SENDING STATUS');
      console.log('='.repeat(70));
      console.log(`Meeting ID: ${meeting.id}`);
      console.log(`Meeting Link: ${meeting.meetingLink}`);
      console.log(`Participants: ${meeting.participants?.length || 0}`);
      console.log('\n⏳ Waiting 2 seconds for email processing...\n');

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Test complete!\n');
      console.log('📋 INSTRUCTIONS:');
      console.log('1. Check these email inboxes:');
      console.log('   • bilalrazaswe@gmail.com');
      console.log('   • bilalrazaprotoit@gmail.com');
      console.log('2. Look for an email from: ' + process.env.EMAIL_FROM_ADDRESS);
      console.log('3. Subject should be: "Meeting Invitation: ' + meetingPayload.title + '"');
      console.log('4. Email should contain:');
      console.log('   ✓ Meeting title and description');
      console.log('   ✓ Date and time: ' + new Date(meetingPayload.scheduled_at).toLocaleString());
      console.log('   ✓ Duration: ' + meetingPayload.duration + ' minutes');
      console.log('   ✓ List of participants');
      console.log('   ✓ Button to join meeting: ' + meeting.meetingLink);
      console.log('   ✓ Calendar invite file (.ics) as attachment');
      console.log('5. Click the join button to verify the link works\n');

      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testMeetingViaAPI();
