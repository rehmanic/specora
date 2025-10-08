import dotenv from 'dotenv';
import sequelize from './config/database.js';
import Meeting from './database/models/meeting.js';

dotenv.config();

console.log('\n================================================');
console.log('   Specora - Database Setup & Verification');
console.log('================================================\n');

async function setupDatabase() {
  try {
    // Step 1: Test connection
    console.log('📡 Step 1: Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Step 2: Sync models
    console.log('🔄 Step 2: Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('✅ Database models synced!\n');

    // Step 3: Seed data
    console.log('🌱 Step 3: Seeding database with sample meetings...');
    
    const meetings = [
      // Upcoming meeting with pre-generated link
      {
        name: "Sprint Planning - Q1 2025",
        description: "Discuss requirements gathering strategies for the new e-commerce module and prioritize features for the upcoming sprint.",
        stakeholders: ["alice@specora.com", "bob@specora.com", "charlie@specora.com"],
        scheduled_by: "John Doe",
        scheduled_at: new Date('2025-10-08T10:00:00'),
        is_completed: false,
        meeting_link: "http://localhost:3000/meetings/room/room_1_1705839234567",
        room_id: "room_1_1705839234567",
      },
      {
        name: "Client Requirements Review",
        description: "Review and validate requirements with stakeholders to ensure alignment with business objectives.",
        stakeholders: ["client@company.com", "manager@specora.com"],
        scheduled_by: "Jane Smith",
        scheduled_at: new Date('2025-10-09T14:00:00'),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      {
        name: "Technical Feasibility Discussion",
        description: "Assess technical constraints and architecture decisions for the proposed system design.",
        stakeholders: ["tech-lead@specora.com", "architect@specora.com"],
        scheduled_by: "John Doe",
        scheduled_at: new Date('2025-10-10T11:00:00'),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      {
        name: "Stakeholder Alignment Meeting",
        description: "Ensure all stakeholders are aligned on project goals, timelines, and deliverables.",
        stakeholders: ["pm@specora.com", "cto@specora.com", "client@company.com"],
        scheduled_by: "Sarah Johnson",
        scheduled_at: new Date('2025-10-11T15:00:00'),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      // Completed meetings with recordings
      {
        name: "Initial Requirements Workshop",
        description: "Kickoff workshop to gather initial requirements and understand stakeholder needs.",
        stakeholders: ["product@specora.com", "design@specora.com", "dev@specora.com"],
        scheduled_by: "Alex Morgan",
        scheduled_at: new Date('2025-10-01T09:00:00'),
        is_completed: true,
        recording_link: "/api/video/recordings/meeting_1_recording.webm",
        transcript_summary: "Discussed core features including user authentication, dashboard analytics, and reporting modules.",
        requirement_extraction: "FR1: User login system, FR2: Dashboard with charts, FR3: Export reports to PDF",
        room_id: "room_1_completed",
        meeting_link: "http://localhost:3000/meetings/room/room_1_completed",
      },
      {
        name: "Requirements Prioritization Session",
        description: "Prioritize requirements using MoSCoW method and assign story points.",
        stakeholders: ["scrum-master@specora.com", "team@specora.com"],
        scheduled_by: "Chris Taylor",
        scheduled_at: new Date('2025-10-03T13:00:00'),
        is_completed: true,
        recording_link: "/api/video/recordings/meeting_2_recording.webm",
        transcript_summary: "Prioritized 25 requirements. Must-have: 10, Should-have: 8, Could-have: 5, Won't-have: 2",
        requirement_extraction: "High Priority: Authentication, Search, Notifications. Medium: Analytics, Reports. Low: Themes, Customization",
        room_id: "room_2_completed",
        meeting_link: "http://localhost:3000/meetings/room/room_2_completed",
      },
      {
        name: "System Architecture Review",
        description: "Review proposed system architecture and discuss scalability concerns.",
        stakeholders: ["architect@specora.com", "tech-lead@specora.com", "devops@specora.com"],
        scheduled_by: "Jordan Lee",
        scheduled_at: new Date('2025-10-05T16:00:00'),
        is_completed: true,
        recording_link: "/api/video/recordings/meeting_3_recording.webm",
        transcript_summary: "Decided on microservices architecture with Docker containers, PostgreSQL database, and Redis caching.",
        requirement_extraction: "NFR1: System should handle 10k concurrent users, NFR2: Response time < 200ms, NFR3: 99.9% uptime",
        room_id: "room_3_completed",
        meeting_link: "http://localhost:3000/meetings/room/room_3_completed",
      },
    ];

    await Meeting.bulkCreate(meetings);
    console.log(`✅ Seeded ${meetings.length} meetings successfully!\n`);

    // Step 4: Verify data
    console.log('🔍 Step 4: Verifying seeded data...');
    const upcomingCount = await Meeting.count({ where: { is_completed: false } });
    const completedCount = await Meeting.count({ where: { is_completed: true } });
    
    console.log(`   📅 Upcoming meetings: ${upcomingCount}`);
    console.log(`   ✅ Completed meetings: ${completedCount}`);
    console.log(`   📊 Total meetings: ${upcomingCount + completedCount}\n`);

    // Step 5: Show sample data
    console.log('📋 Sample meetings:');
    const sampleMeetings = await Meeting.findAll({ limit: 3 });
    sampleMeetings.forEach((meeting, idx) => {
      console.log(`   ${idx + 1}. ${meeting.name}`);
      console.log(`      Date: ${meeting.scheduled_at.toLocaleDateString()}`);
      console.log(`      Link: ${meeting.meeting_link || 'Not generated yet'}`);
      console.log(`      Status: ${meeting.is_completed ? 'Completed' : 'Upcoming'}\n`);
    });

    console.log('================================================');
    console.log('   ✅ Database setup complete!');
    console.log('================================================\n');
    
    console.log('Next steps:');
    console.log('  1. Start backend: npm start');
    console.log('  2. Start frontend: cd ../frontend && npm run dev');
    console.log('  3. Open: http://localhost:3000/meetings\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Setup failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    
    if (error.message.includes('password authentication failed')) {
      console.error('  • Check DB_PASSWORD in backend/.env file');
      console.error('  • Verify PostgreSQL password using: psql -U postgres');
      console.error('  • Try common passwords: postgres, admin, root');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('  • Create database using: psql -U postgres -c "CREATE DATABASE specora;"');
      console.error('  • Or use pgAdmin to create database manually');
    } else if (error.message.includes('connect')) {
      console.error('  • Ensure PostgreSQL service is running');
      console.error('  • Check Windows Services for "postgresql-x64-14"');
      console.error('  • Verify DB_HOST and DB_PORT in .env file');
    } else {
      console.error('  • Check backend/.env configuration');
      console.error('  • Ensure all required packages are installed: npm install');
    }
    
    console.error('\n');
    process.exit(1);
  }
}

setupDatabase();
