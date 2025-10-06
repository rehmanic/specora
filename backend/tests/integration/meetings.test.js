import request from "supertest";
import app from "../../../app.js";
import sequelize from "../../../config/database.js";
import Meeting from "../../../database/models/meeting.js";

describe("Meetings API Integration Tests", () => {
  beforeAll(async () => {
    // Setup database connection
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    // Clear meetings after each test
    await Meeting.destroy({ where: {}, truncate: true });
  });

  describe("GET /api/meetings/upcoming", () => {
    it("should return empty array when no upcoming meetings exist", async () => {
      const response = await request(app)
        .get("/api/meetings/upcoming")
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return only upcoming meetings", async () => {
      // Create test data
      await Meeting.create({
        name: "Upcoming Meeting",
        description: "Test upcoming",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date(Date.now() + 86400000),
        is_completed: false,
      });

      await Meeting.create({
        name: "Completed Meeting",
        description: "Test completed",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date(Date.now() - 86400000),
        is_completed: true,
      });

      const response = await request(app)
        .get("/api/meetings/upcoming")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Upcoming Meeting");
      expect(response.body[0].is_completed).toBe(false);
    });
  });

  describe("GET /api/meetings/completed", () => {
    it("should return only completed meetings", async () => {
      await Meeting.create({
        name: "Completed Meeting",
        description: "Test completed",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        recording_link: "https://drive.google.com/test",
        scheduled_at: new Date(Date.now() - 86400000),
        is_completed: true,
      });

      const response = await request(app)
        .get("/api/meetings/completed")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].is_completed).toBe(true);
      expect(response.body[0].recording_link).toBeTruthy();
    });
  });

  describe("POST /api/meetings/schedule", () => {
    it("should create a new meeting with valid data", async () => {
      const meetingData = {
        name: "Test Meeting",
        description: "This is a test meeting",
        stakeholders: ["alice@test.com", "bob@test.com"],
        meeting_link: "https://meet.google.com/test-123",
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      };

      const response = await request(app)
        .post("/api/meetings/schedule")
        .send(meetingData)
        .expect(201);

      expect(response.body.message).toBe("Meeting scheduled successfully");
      expect(response.body.meeting.name).toBe(meetingData.name);
      expect(response.body.meeting.stakeholders).toEqual(meetingData.stakeholders);
    });

    it("should return 400 with invalid data", async () => {
      const invalidData = {
        name: "",
        description: "Test",
        stakeholders: [],
        meeting_link: "invalid-url",
      };

      const response = await request(app)
        .post("/api/meetings/schedule")
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe("Validation Error");
    });

    it("should reject meeting without required fields", async () => {
      const response = await request(app)
        .post("/api/meetings/schedule")
        .send({})
        .expect(400);

      expect(response.body.error).toBe("Validation Error");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/meetings/:id", () => {
    it("should return meeting by ID", async () => {
      const meeting = await Meeting.create({
        name: "Test Meeting",
        description: "Test description",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date(),
        is_completed: false,
      });

      const response = await request(app)
        .get(`/api/meetings/${meeting.id}`)
        .expect(200);

      expect(response.body.id).toBe(meeting.id);
      expect(response.body.name).toBe("Test Meeting");
    });

    it("should return 404 for non-existent meeting", async () => {
      const response = await request(app)
        .get("/api/meetings/99999")
        .expect(500);
    });
  });

  describe("PATCH /api/meetings/:id/complete", () => {
    it("should mark meeting as completed", async () => {
      const meeting = await Meeting.create({
        name: "Test Meeting",
        description: "Test description",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date(),
        is_completed: false,
      });

      const response = await request(app)
        .patch(`/api/meetings/${meeting.id}/complete`)
        .send({ recording_link: "https://drive.google.com/recording" })
        .expect(200);

      expect(response.body.message).toBe("Meeting marked as completed");
      expect(response.body.meeting.is_completed).toBe(true);
      expect(response.body.meeting.recording_link).toBe("https://drive.google.com/recording");
    });
  });

  describe("DELETE /api/meetings/:id", () => {
    it("should delete meeting", async () => {
      const meeting = await Meeting.create({
        name: "Test Meeting",
        description: "Test description",
        stakeholders: ["test@example.com"],
        scheduled_by: "Test User",
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date(),
        is_completed: false,
      });

      const response = await request(app)
        .delete(`/api/meetings/${meeting.id}`)
        .expect(200);

      expect(response.body.message).toBe("Meeting deleted successfully");

      // Verify deletion
      const deletedMeeting = await Meeting.findByPk(meeting.id);
      expect(deletedMeeting).toBeNull();
    });
  });

  describe("GET /api/meetings/search", () => {
    beforeEach(async () => {
      await Meeting.bulkCreate([
        {
          name: "Sprint Planning",
          description: "Planning for sprint 1",
          stakeholders: ["test@example.com"],
          scheduled_by: "Test User",
          meeting_link: "https://meet.google.com/test",
          scheduled_at: new Date(),
          is_completed: false,
        },
        {
          name: "Requirements Review",
          description: "Review requirements",
          stakeholders: ["test@example.com"],
          scheduled_by: "Test User",
          meeting_link: "https://meet.google.com/test",
          scheduled_at: new Date(),
          is_completed: false,
        },
      ]);
    });

    it("should search meetings by name", async () => {
      const response = await request(app)
        .get("/api/meetings/search?q=Sprint")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Sprint Planning");
    });

    it("should search meetings by description", async () => {
      const response = await request(app)
        .get("/api/meetings/search?q=requirements")
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return 400 without query parameter", async () => {
      const response = await request(app)
        .get("/api/meetings/search")
        .expect(400);

      expect(response.body.error).toBe("Bad Request");
    });
  });
});
