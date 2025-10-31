import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

console.log('🔄 Initializing Redis/Bull queue system...');

// Create real Bull queues with error handling
let emailQueue, aiQueue;

try {
  emailQueue = new Queue('email-notifications', REDIS_URL, {
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

  aiQueue = new Queue('ai-processing', REDIS_URL, {
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

  aiQueue.on('completed', (job) => {
    console.log(`✓ AI job completed: ${job.id}`);
  });

  aiQueue.on('failed', (job, err) => {
    console.error(`✗ AI job failed: ${job.id}`, err.message);
  });

  console.log('✅ Redis/Bull queues initialized successfully');

} catch (error) {
  console.error('❌ Failed to initialize Redis/Bull queues:', error.message);
  console.error('   Falling back to mock queue system');

  // Fallback to mock queues
  class MockQueue {
    constructor(name) {
      this.name = name;
      this.processors = {};
    }

    async add(jobName, data) {
      console.log(`📦 Mock Queue [${this.name}]: Would queue job "${jobName}"`, {
        data: Object.keys(data)
      });
      return { id: `mock-${Date.now()}`, data };
    }

    process(jobName, processor) {
      this.processors[jobName] = processor;
      console.log(`🔧 Mock Queue [${this.name}]: Registered processor for "${jobName}"`);
    }

    on(event, handler) {
      // Just log event registrations
    }

    async close() {
      console.log(`🔌 Mock Queue [${this.name}]: Closed`);
    }
  }

  emailQueue = new MockQueue('email-notifications');
  aiQueue = new MockQueue('ai-processing');
}

// Health check
export async function isQueueHealthy() {
  try {
    if (emailQueue && typeof emailQueue.isReady === 'function') {
      await emailQueue.isReady();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Redis queue health check failed:', error.message);
    return false;
  }
}

// Graceful shutdown
export async function closeQueues() {
  try {
    if (emailQueue && typeof emailQueue.close === 'function') {
      await emailQueue.close();
    }
    if (aiQueue && typeof aiQueue.close === 'function') {
      await aiQueue.close();
    }
    console.log('🔌 Queues closed gracefully');
  } catch (error) {
    console.error('Error closing queues:', error.message);
  }
}

export { emailQueue, aiQueue };

export default {
  emailQueue,
  aiQueue,
  isQueueHealthy,
  closeQueues
};
