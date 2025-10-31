import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create queues
export const emailQueue = new Queue('email', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

export const notificationQueue = new Queue('notification', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true
  }
});

export const aiQueue = new Queue('ai-processing', REDIS_URL, {
  defaultJobOptions: {
    attempts: 2,
    timeout: 60000, // 1 minute timeout for AI operations
    removeOnComplete: true
  }
});

// Queue event handlers
emailQueue.on('completed', (job) => {
  console.log(`✓ Email job completed: ${job.id}`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`✗ Email job failed: ${job.id}`, err.message);
});

notificationQueue.on('completed', (job) => {
  console.log(`✓ Notification job completed: ${job.id}`);
});

aiQueue.on('completed', (job) => {
  console.log(`✓ AI job completed: ${job.id}`);
});

aiQueue.on('failed', (job, err) => {
  console.error(`✗ AI job failed: ${job.id}`, err.message);
});

console.log('✓ Queue system initialized');
