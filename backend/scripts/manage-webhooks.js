import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * List and Delete Daily.co Webhooks
 * This script helps manage your Daily.co webhooks
 */

async function manageWebhooks() {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  
  if (!DAILY_API_KEY) {
    console.error('❌ DAILY_API_KEY not found in .env file');
    process.exit(1);
  }

  try {
    // List all webhooks
    console.log('🔍 Fetching all Daily.co webhooks...\n');
    const response = await axios.get('https://api.daily.co/v1/webhooks', {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const webhooks = response.data.data || [];

    if (webhooks.length === 0) {
      console.log('📭 No webhooks found.');
      return;
    }

    console.log(`📋 Found ${webhooks.length} webhook(s):\n`);
    
    webhooks.forEach((webhook, index) => {
      console.log(`${index + 1}. Webhook ID: ${webhook.id}`);
      console.log(`   URL: ${webhook.url}`);
      console.log(`   State: ${webhook.state}`);
      console.log(`   Event Types: ${webhook.event_types.join(', ')}`);
      console.log(`   Created: ${new Date(webhook.created_at).toLocaleString()}`);
      console.log('');
    });

    // Instructions to delete
    console.log('💡 To delete a webhook, run:');
    console.log('   node scripts/delete-webhook.js <webhook-id>');
    console.log('');
    console.log('   Or use curl:');
    webhooks.forEach(webhook => {
      console.log(`   curl -X DELETE https://api.daily.co/v1/webhooks/${webhook.id} \\`);
      console.log(`        -H "Authorization: Bearer $DAILY_API_KEY"`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error fetching webhooks:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.error || error.response.data?.info || error.message);
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// If webhook ID is provided as argument, delete it
const webhookId = process.argv[2];

if (webhookId) {
  deleteWebhook(webhookId);
} else {
  manageWebhooks();
}

async function deleteWebhook(webhookId) {
  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  
  if (!DAILY_API_KEY) {
    console.error('❌ DAILY_API_KEY not found in .env file');
    process.exit(1);
  }

  try {
    console.log(`🗑️  Deleting webhook: ${webhookId}...\n`);
    
    await axios.delete(`https://api.daily.co/v1/webhooks/${webhookId}`, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    console.log('✅ Webhook deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting webhook:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.error || error.response.data?.info || error.message);
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}
