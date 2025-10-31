import dailyVideoService from './core/services/dailyVideoService.js';
import { emailQueue, aiQueue, isQueueHealthy } from './core/services/queueService.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🧪 Testing Specora Backend Services...\n');

async function testServices() {
  const results = {
    redis: false,
    dailyCo: false,
    emailQueue: false,
    aiQueue: false
  };

  // Test 1: Redis Connection
  console.log('1️⃣  Testing Redis Connection...');
  try {
    results.redis = isQueueHealthy();
    if (results.redis) {
      console.log('   ✅ Redis: Connected');
    } else {
      console.log('   ⏳ Redis: Connecting...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      results.redis = isQueueHealthy();
      console.log(results.redis ? '   ✅ Redis: Connected' : '   ❌ Redis: Not available');
    }
  } catch (error) {
    console.log('   ❌ Redis: Error -', error.message);
  }

  // Test 2: Daily.co Connection
  console.log('\n2️⃣  Testing Daily.co API...');
  try {
    results.dailyCo = await dailyVideoService.testConnection();
    if (results.dailyCo) {
      console.log('   ✅ Daily.co: API key valid');
      
      // Create a test room
      console.log('   🎥 Creating test room...');
      const testRoom = await dailyVideoService.createRoom('test-room-' + Date.now(), {
        maxParticipants: 10,
        enableRecording: 'cloud'
      });
      console.log('   ✅ Test room created:', testRoom.url);
      
      // Clean up test room
      console.log('   🗑️  Cleaning up test room...');
      await dailyVideoService.deleteRoom(testRoom.roomId);
      console.log('   ✅ Test room deleted');
    } else {
      console.log('   ❌ Daily.co: API key not configured or invalid');
    }
  } catch (error) {
    console.log('   ❌ Daily.co: Error -', error.message);
  }

  // Test 3: Email Queue
  console.log('\n3️⃣  Testing Email Queue...');
  try {
    if (results.redis) {
      const job = await emailQueue.add('send-invitation', {
        to: 'test@example.com',
        meetingData: {
          title: 'Test Meeting',
          scheduledAt: new Date().toISOString()
        }
      });
      console.log('   ✅ Email queue: Job added (#' + job.id + ')');
      results.emailQueue = true;
      
      // Wait for job to process
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('   ⏭️  Email queue: Skipped (Redis not available)');
    }
  } catch (error) {
    console.log('   ❌ Email queue: Error -', error.message);
  }

  // Test 4: AI Queue
  console.log('\n4️⃣  Testing AI Queue...');
  try {
    if (results.redis) {
      const job = await aiQueue.add('generate-summary', {
        meetingId: 'test-123',
        transcript: 'This is a test transcript for AI processing.'
      });
      console.log('   ✅ AI queue: Job added (#' + job.id + ')');
      results.aiQueue = true;
      
      // Wait for job to process
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('   ⏭️  AI queue: Skipped (Redis not available)');
    }
  } catch (error) {
    console.log('   ❌ AI queue: Error -', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('='.repeat(50));
  console.log(`Redis Connection:     ${results.redis ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Daily.co API:         ${results.dailyCo ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Email Queue:          ${results.emailQueue ? '✅ PASS' : results.redis ? '❌ FAIL' : '⏭️  SKIP'}`);
  console.log(`AI Queue:             ${results.aiQueue ? '✅ PASS' : results.redis ? '❌ FAIL' : '⏭️  SKIP'}`);
  console.log('='.repeat(50));

  const allPassed = results.redis && results.dailyCo && results.emailQueue && results.aiQueue;
  console.log(allPassed ? '\n🎉 All tests passed!' : '\n⚠️  Some tests failed - check logs above');
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
testServices().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});
