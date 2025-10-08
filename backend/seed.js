import sequelize from "./config/database.js";
import Meeting from "./database/models/meeting.js";

async function seedMeetings() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ force: true });
    console.log("✅ Database tables created");

    const meetings = [
      // Upcoming meeting with shareable link (already started once)
      {
        name: "Sprint Planning - Q1 2025",
        description: "Discuss requirements gathering strategies for the new e-commerce module and prioritize features for the upcoming sprint.",
        stakeholders: ["alice@specora.com", "bob@specora.com", "charlie@specora.com"],
        scheduled_by: "John Doe",
        scheduled_at: new Date(Date.now() + 86400000),
        is_completed: false,
        meeting_link: "http://localhost:3000/meetings/room/room_1_1705839234567",
        room_id: "room_1_1705839234567",
      },
      {
        name: "Client Requirements Review",
        description: "Review and validate requirements with stakeholders to ensure alignment with business objectives.",
        stakeholders: ["client@company.com", "manager@specora.com"],
        scheduled_by: "Jane Smith",
        scheduled_at: new Date(Date.now() + 172800000),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      {
        name: "Technical Feasibility Discussion",
        description: "Assess technical constraints and architecture decisions for the proposed system design.",
        stakeholders: ["tech-lead@specora.com", "architect@specora.com"],
        scheduled_by: "John Doe",
        scheduled_at: new Date(Date.now() + 259200000),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      {
        name: "Stakeholder Alignment Meeting",
        description: "Ensure all stakeholders are aligned on project goals, timelines, and deliverables.",
        stakeholders: ["pm@specora.com", "cto@specora.com", "client@company.com"],
        scheduled_by: "Sarah Johnson",
        scheduled_at: new Date(Date.now() + 345600000),
        is_completed: false,
        meeting_link: null,
        room_id: null,
      },
      {
        name: "Initial Requirements Workshop",
        description: "Kickoff meeting to gather initial requirements from all stakeholders and define project scope.",
        stakeholders: ["stakeholder1@company.com", "stakeholder2@company.com"],
        scheduled_by: "John Doe",
        scheduled_at: new Date(Date.now() - 604800000),
        is_completed: true,
        recording_link: "/recordings/recording_1696123456789.webm",
        transcript_summary: "Discussed initial project scope, identified 15 functional requirements, and established communication protocols.",
        meeting_link: null,
        room_id: "room_4_1696123456789",
      },
      {
        name: "Requirement Prioritization Session",
        description: "Prioritize features based on business value and technical complexity using MoSCoW method.",
        stakeholders: ["product-owner@specora.com", "scrum-master@specora.com"],
        scheduled_by: "Jane Smith",
        scheduled_at: new Date(Date.now() - 1209600000),
        is_completed: true,
        recording_link: "/recordings/recording_1696987654321.webm",
        transcript_summary: "Prioritized 25 requirements into Must-have, Should-have, Could-have, and Won't-have categories.",
        meeting_link: null,
        room_id: "room_5_1696987654321",
      },
      {
        name: "Architecture Review Board",
        description: "Technical deep-dive into proposed system architecture and design patterns.",
        stakeholders: ["architect@specora.com", "senior-dev@specora.com", "tech-lead@specora.com"],
        scheduled_by: "Mike Chen",
        scheduled_at: new Date(Date.now() - 1814400000),
        is_completed: true,
        recording_link: "/recordings/recording_1695876543210.webm",
        transcript_summary: "Reviewed microservices architecture, approved API gateway pattern, and discussed database sharding strategy.",
        meeting_link: null,
        room_id: "room_6_1695876543210",
      },
    ];

    await Meeting.bulkCreate(meetings);
    console.log(`✅ Seeded ${meetings.length} meetings`);
    console.log(`   - ${meetings.filter(m => !m.is_completed).length} upcoming`);
    console.log(`   - ${meetings.filter(m => m.is_completed).length} completed`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seedMeetings();
