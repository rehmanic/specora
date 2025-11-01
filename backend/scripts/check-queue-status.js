import { emailQueue, isQueueHealthy } from '../core/services/queueService.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkQueueStatus() {
  console.log('🔍 Checking Email Queue Status...\n');
  
  // Check if queue is healthy
  console.log('Queue Health:', isQueueHealthy() ? '✅ Healthy' : '❌ Not Healthy');
  console.log('Queue Type:', emailQueue.constructor.name);
  console.log('');
  
  if (emailQueue.constructor.name === 'MockQueue') {
    console.log('⚠️  Using MockQueue - Redis is not available');
    console.log('   Emails will NOT be sent!');
    console.log('   Please start Redis: docker start specora-redis');
    return;
  }
  
  try {
    // Get job counts
    const waiting = await emailQueue.getWaitingCount();
    const active = await emailQueue.getActiveCount();
    const completed = await emailQueue.getCompletedCount();
    const failed = await emailQueue.getFailedCount();
    
    console.log('📊 Queue Statistics:');
    console.log(`   Waiting jobs: ${waiting}`);
    console.log(`   Active jobs: ${active}`);
    console.log(`   Completed jobs: ${completed}`);
    console.log(`   Failed jobs: ${failed}`);
    console.log('');
    
    // Get recent failed jobs
    if (failed > 0) {
      console.log('❌ Recent Failed Jobs:');
      const failedJobs = await emailQueue.getFailed(0, 10);
      
      for (const job of failedJobs) {
        console.log(`\n   Job ID: ${job.id}`);
        console.log(`   Type: ${job.name}`);
        console.log(`   Data:`, JSON.stringify(job.data, null, 2));
        console.log(`   Error: ${job.failedReason}`);
        console.log(`   Stack: ${job.stacktrace?.join('\n')}`);
      }
    }
    
    // Get recent completed jobs
    if (completed > 0) {
      console.log('✅ Recent Completed Jobs:');
      const completedJobs = await emailQueue.getCompleted(0, 5);
      
      for (const job of completedJobs) {
        console.log(`\n   Job ID: ${job.id}`);
        console.log(`   Type: ${job.name}`);
        console.log(`   Completed at: ${new Date(job.finishedOn).toLocaleString()}`);
      }
    }
    
    // Get waiting jobs
    if (waiting > 0) {
      console.log('\n⏳ Waiting Jobs:');
      const waitingJobs = await emailQueue.getWaiting(0, 5);
      
      for (const job of waitingJobs) {
        console.log(`\n   Job ID: ${job.id}`);
        console.log(`   Type: ${job.name}`);
        console.log(`   Data:`, JSON.stringify(job.data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking queue:', error.message);
  }
  
  process.exit(0);
}

checkQueueStatus();
