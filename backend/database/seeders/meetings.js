import sequelize from "../config/database.js";
import Meeting from "../database/models/meeting.js";

async function seedMeetings() {
  try {
    console.log("🌱 Seeding meetings data...");

    // Clear existing data (only in development)
    if (process.env.NODE_ENV === "development") {
      await Meeting.destroy({ where: {}, truncate: true });
      console.log("✅ Cleared existing meetings");
    }

    // Upcoming meetings
    const upcomingMeetings = [
      {
        name: "Sprint Planning - Q1 2025",
        description:
          "Discuss requirements gathering strategies for the new e-commerce module and prioritize user stories for the upcoming sprint.",
        stakeholders: [
          "alice@specora.com",
          "bob@specora.com",
          "charlie@specora.com",
        ],
        scheduled_by: "John Doe",
        meeting_link: "https://meet.google.com/abc-defg-hij",
        scheduled_at: new Date(Date.now() + 86400000), // Tomorrow
        is_completed: false,
      },
      {
        name: "Client Requirements Review",
        description:
          "Review and validate requirements with stakeholders to ensure alignment with business objectives.",
        stakeholders: ["client@company.com", "manager@specora.com"],
        scheduled_by: "Jane Smith",
        meeting_link: "https://zoom.us/j/123456789",
        scheduled_at: new Date(Date.now() + 172800000), // 2 days from now
        is_completed: false,
      },
      {
        name: "Technical Feasibility Discussion",
        description:
          "Assess technical constraints, architecture decisions, and infrastructure requirements for the new features.",
        stakeholders: ["tech-lead@specora.com", "architect@specora.com"],
        scheduled_by: "John Doe",
        meeting_link: "https://teams.microsoft.com/l/meetup-join/xyz",
        scheduled_at: new Date(Date.now() + 259200000), // 3 days from now
        is_completed: false,
      },
      {
        name: "Stakeholder Alignment Workshop",
        description:
          "Align all stakeholders on project vision, goals, and success criteria for the upcoming quarter.",
        stakeholders: [
          "ceo@company.com",
          "cto@company.com",
          "product@specora.com",
        ],
        scheduled_by: "Jane Smith",
        meeting_link: "https://meet.google.com/stakeholder-align",
        scheduled_at: new Date(Date.now() + 432000000), // 5 days from now
        is_completed: false,
      },
    ];

    // Completed meetings
    const completedMeetings = [
      {
        name: "Initial Requirements Workshop",
        description:
          "Kickoff meeting to gather initial requirements from all stakeholders and establish communication channels.",
        stakeholders: ["stakeholder1@company.com", "stakeholder2@company.com"],
        scheduled_by: "John Doe",
        meeting_link: "https://meet.google.com/past-meeting-1",
        recording_link: "https://drive.google.com/file/d/recording123",
        scheduled_at: new Date(Date.now() - 604800000), // 1 week ago
        is_completed: true,
        transcript_summary:
          "Discussed initial project scope, identified key stakeholders, and established communication protocols.",
      },
      {
        name: "Requirement Prioritization Session",
        description:
          "Prioritize features based on business value, technical complexity, and dependencies using MoSCoW method.",
        stakeholders: [
          "product-owner@specora.com",
          "scrum-master@specora.com",
        ],
        scheduled_by: "Jane Smith",
        meeting_link: "https://zoom.us/j/987654321",
        recording_link: "https://drive.google.com/file/d/recording456",
        scheduled_at: new Date(Date.now() - 1209600000), // 2 weeks ago
        is_completed: true,
        transcript_summary:
          "Prioritized 25 user stories, identified 8 must-have features, and created initial sprint backlog.",
      },
      {
        name: "Architecture Review Meeting",
        description:
          "Review proposed system architecture and discuss scalability, security, and performance considerations.",
        stakeholders: [
          "architect@specora.com",
          "senior-dev@specora.com",
          "devops@specora.com",
        ],
        scheduled_by: "John Doe",
        meeting_link: "https://teams.microsoft.com/l/arch-review",
        recording_link: "https://drive.google.com/file/d/recording789",
        scheduled_at: new Date(Date.now() - 1814400000), // 3 weeks ago
        is_completed: true,
        transcript_summary:
          "Approved microservices architecture, discussed API design patterns, and planned infrastructure setup.",
      },
    ];

    // Insert seed data
    await Meeting.bulkCreate([...upcomingMeetings, ...completedMeetings]);

    console.log(`✅ Seeded ${upcomingMeetings.length} upcoming meetings`);
    console.log(`✅ Seeded ${completedMeetings.length} completed meetings`);
    console.log("🎉 Seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Run seeder if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMeetings()
    .then(() => {
      console.log("Disconnecting from database...");
      sequelize.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      sequelize.close();
      process.exit(1);
    });
}

export default seedMeetings;
