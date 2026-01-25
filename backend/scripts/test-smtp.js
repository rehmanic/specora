import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testSMTP() {
  console.log('🔍 Testing SMTP Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  Secure: ${process.env.SMTP_SECURE}\n`);

  try {
    console.log('Connecting to SMTP server...');
    const verified = await transporter.verify();
    
    if (verified) {
      console.log('✅ SMTP connection verified successfully!\n');
      console.log('📧 Sending test email...');
      
      const result = await transporter.sendMail({
        from: `"Specora Test" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Send to self
        subject: '✅ Specora SMTP Test - Connection Successful',
        html: `
          <h2>Hello,</h2>
          <p>This is a test email from Specora Meetings to verify your SMTP configuration is working correctly.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Host: ${process.env.SMTP_HOST}</li>
            <li>Port: ${process.env.SMTP_PORT}</li>
            <li>User: ${process.env.SMTP_USER}</li>
          </ul>
          <p>If you received this email, your SMTP setup is ready for production use!</p>
          <p>Best regards,<br/>Specora Meetings Team</p>
        `
      });

      console.log(`✅ Test email sent successfully!`);
      console.log(`   Message ID: ${result.messageId}\n`);
      console.log('🎉 Your SMTP is configured and ready to send meeting invitations!\n');
      process.exit(0);
    } else {
      console.log('❌ SMTP verification failed\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ SMTP connection failed:');
    console.error(`   Error: ${error.message}\n`);
    console.log('Troubleshooting tips:');
    console.log('  1. Verify SMTP_USER and SMTP_PASS are correct');
    console.log('  2. Make sure app password is used (not account password)');
    console.log('  3. Ensure 2FA is enabled on your Gmail account');
    console.log('  4. Check that port 587 is not blocked by firewall');
    process.exit(1);
  }
}

testSMTP();
