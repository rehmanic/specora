import redis from 'redis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function diagnoseRedis() {
  console.log('🔍 Diagnosing Redis Connection...\n');
  
  const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    socket: {
      reconnectStrategy: () => false // Stop retrying immediately
    }
  });

  client.on('error', (err) => {
    console.error('❌ Redis Error:', err.message);
  });

  try {
    console.log('Configuration:');
    console.log(`  Host: ${process.env.REDIS_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.REDIS_PORT || 6379}`);
    console.log(`  URL: ${process.env.REDIS_URL || 'redis://127.0.0.1:6379'}\n`);

    console.log('Attempting to connect...');
    await client.connect();
    
    console.log('✅ Connected to Redis!\n');

    const pong = await client.ping();
    console.log(`Ping response: ${pong}`);

    const info = await client.info('server');
    console.log('\n📊 Redis Server Info:');
    info.split('\r\n').slice(0, 5).forEach(line => {
      if (line && !line.startsWith('#')) {
        console.log(`  ${line}`);
      }
    });

    const keys = await client.keys('bull:*');
    console.log(`\n📦 Job Queues Found: ${keys.length}`);
    if (keys.length > 0) {
      keys.slice(0, 5).forEach(key => {
        console.log(`  - ${key}`);
      });
    }

    console.log('\n✅ Redis is healthy and ready for Bull queues!\n');
    await client.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Redis Connection Failed!');
    console.error(`Error: ${error.message}\n`);
    
    console.log('Troubleshooting:');
    console.log('  1. Is Redis running? Check with: redis-cli ping');
    console.log('  2. Is Redis on the correct host/port?');
    console.log('  3. Is the firewall blocking port 6379?');
    console.log('  4. Start Redis: redis-server (or use your platform method)\n');
    
    process.exit(1);
  }
}

diagnoseRedis();
