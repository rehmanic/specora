import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Display configuration
  console.log('📧 Email Configuration:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Password: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'}`);
  console.log('');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    debug: true, // Enable debug output
    logger: true  // Log to console
  });

  try {
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Specora Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: '✅ Specora Email Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">🎉 Email Configuration Successful!</h2>
          <p>This is a test email from your Specora application.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>✓ Your email service is working correctly!</strong></p>
            <p style="margin: 10px 0 0 0; color: #6b7280;">You should now receive meeting invitations when you create meetings.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated test message from Specora.<br>
            If you received this, your SMTP configuration is correct!
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log('\n📬 Check your inbox at: ' + process.env.SMTP_USER);
    console.log('   (It may take a few seconds to arrive)\n');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔑 Authentication Error:');
      console.error('   Your Gmail credentials may be incorrect.');
      console.error('   Or you may need to use an App Password instead of your regular password.');
      console.error('   Generate an App Password at: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n🌐 Network Error:');
      console.error('   Cannot reach the SMTP server. Check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n⏱️ Timeout Error:');
      console.error('   Connection timed out. Check your firewall or proxy settings.');
    }
    
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure you are using a Gmail App Password (not your regular password)');
    console.error('   2. Enable "Less secure app access" or use App Passwords');
    console.error('   3. Check your .env file has the correct SMTP credentials');
    console.error('   4. Make sure your internet connection is working');
    
    process.exit(1);
  }
}

testEmail();
