import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Setup Daily.co Webhook
 * This script creates a webhook in Daily.co to receive events when:
 * - A room ends (meeting finishes)
 * - A recording is ready to download
 */

async function setupDailyWebhook() {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  const BACKEND_URL = process.env.WEBHOOK_URL || process.env.BACKEND_URL || 'http://localhost:5000';
  
  if (!DAILY_API_KEY) {
    console.error('❌ DAILY_API_KEY not found in .env file');
    process.exit(1);
  }

  const webhookUrl = `${BACKEND_URL}/api/meetings/webhook/daily`;

  console.log('🔧 Setting up Daily.co webhook...');
  console.log(`📡 Webhook URL: ${webhookUrl}`);
  console.log('');

  try {
    // First, let's list existing webhooks to avoid duplicates
    console.log('🔍 Checking for existing webhooks...');
    const listResponse = await axios.get('https://api.daily.co/v1/webhooks', {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingWebhook = listResponse.data.data?.find(
      webhook => webhook.url === webhookUrl
    );

    if (existingWebhook) {
      console.log('⚠️  Webhook already exists with ID:', existingWebhook.id);
      console.log('📋 Current event types:', existingWebhook.event_types);
      
      // Ask if user wants to update
      console.log('\n💡 To update this webhook, delete it first and run this script again.');
      console.log(`   DELETE URL: https://api.daily.co/v1/webhooks/${existingWebhook.id}`);
      return;
    }

    // Create new webhook
    console.log('📝 Creating new webhook...');
    const response = await axios.post(
      'https://api.daily.co/v1/webhooks',
      {
        url: webhookUrl,
        event_types: [
          'room.exp-updated',      // When room expiry is updated
          'room.ended',            // When room ends (meeting finishes)
          'recording.started',     // When recording starts
          'recording.ready-to-download' // When recording is ready
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Webhook created successfully!');
    console.log('📋 Webhook Details:');
    console.log('   ID:', response.data.id);
    console.log('   URL:', response.data.url);
    console.log('   Event Types:', response.data.event_types);
    console.log('   State:', response.data.state);
    console.log('');
    console.log('🎉 Your Daily.co webhook is now configured!');
    console.log('');
    console.log('📝 Note: Make sure your backend is accessible at:', webhookUrl);
    console.log('   For local development, use ngrok or similar to expose your localhost.');
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up webhook:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.error || error.response.data?.info || error.message);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the setup
setupDailyWebhook();
