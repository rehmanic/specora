import meetingsService from "../../../../modules/meetings/service.js";
import meetingsRepository from "../../../../modules/meetings/repository.js";

// Mock the repository
jest.mock("../../../../modules/meetings/repository.js");

describe("MeetingsService Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUpcomingMeetings", () => {
    it("should call repository.getUpcomingMeetings", async () => {
      const mockMeetings = [
        { id: 1, name: "Test Meeting", is_completed: false },
      ];
      meetingsRepository.getUpcomingMeetings.mockResolvedValue(mockMeetings);

      const result = await meetingsService.getUpcomingMeetings();

      expect(meetingsRepository.getUpcomingMeetings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMeetings);
    });

    it("should handle errors from repository", async () => {
      meetingsRepository.getUpcomingMeetings.mockRejectedValue(
        new Error("Database error")
      );

      await expect(meetingsService.getUpcomingMeetings()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getCompletedMeetings", () => {
    it("should call repository.getCompletedMeetings", async () => {
      const mockMeetings = [
        { id: 1, name: "Completed Meeting", is_completed: true },
      ];
      meetingsRepository.getCompletedMeetings.mockResolvedValue(mockMeetings);

      const result = await meetingsService.getCompletedMeetings();

      expect(meetingsRepository.getCompletedMeetings).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMeetings);
    });
  });

  describe("getMeetingById", () => {
    it("should return meeting when found", async () => {
      const mockMeeting = { id: 1, name: "Test Meeting" };
      meetingsRepository.getMeetingById.mockResolvedValue(mockMeeting);

      const result = await meetingsService.getMeetingById(1);

      expect(meetingsRepository.getMeetingById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMeeting);
    });

    it("should throw error when meeting not found", async () => {
      meetingsRepository.getMeetingById.mockResolvedValue(null);

      await expect(meetingsService.getMeetingById(999)).rejects.toThrow(
        "Meeting not found"
      );
    });
  });

  describe("scheduleMeeting", () => {
    it("should create meeting with scheduled_by field", async () => {
      const meetingData = {
        name: "Test Meeting",
        description: "Test description",
        stakeholders: ["test@example.com"],
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date().toISOString(),
      };

      const expectedData = {
        ...meetingData,
        scheduled_by: "John Doe",
      };

      meetingsRepository.createMeeting.mockResolvedValue(expectedData);

      const result = await meetingsService.scheduleMeeting(
        meetingData,
        "John Doe"
      );

      expect(meetingsRepository.createMeeting).toHaveBeenCalledWith(
        expectedData
      );
      expect(result.scheduled_by).toBe("John Doe");
    });

    it("should use default scheduled_by when not provided", async () => {
      const meetingData = {
        name: "Test Meeting",
        description: "Test description",
        stakeholders: ["test@example.com"],
        meeting_link: "https://meet.google.com/test",
        scheduled_at: new Date().toISOString(),
      };

      meetingsRepository.createMeeting.mockResolvedValue({
        ...meetingData,
        scheduled_by: "System",
      });

      const result = await meetingsService.scheduleMeeting(meetingData);

      expect(result.scheduled_by).toBe("System");
    });
  });

  describe("updateMeeting", () => {
    it("should update meeting successfully", async () => {
      const updateData = { name: "Updated Name" };
      const mockUpdatedMeeting = { id: 1, name: "Updated Name" };

      meetingsRepository.updateMeeting.mockResolvedValue(mockUpdatedMeeting);

      const result = await meetingsService.updateMeeting(1, updateData);

      expect(meetingsRepository.updateMeeting).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(result).toEqual(mockUpdatedMeeting);
    });
  });

  describe("markAsCompleted", () => {
    it("should mark meeting as completed with recording link", async () => {
      const mockMeeting = {
        id: 1,
        is_completed: true,
        recording_link: "https://recording.com",
      };

      meetingsRepository.markAsCompleted.mockResolvedValue(mockMeeting);

      const result = await meetingsService.markAsCompleted(
        1,
        "https://recording.com"
      );

      expect(meetingsRepository.markAsCompleted).toHaveBeenCalledWith(
        1,
        "https://recording.com"
      );
      expect(result.is_completed).toBe(true);
    });

    it("should mark meeting as completed without recording link", async () => {
      const mockMeeting = { id: 1, is_completed: true };

      meetingsRepository.markAsCompleted.mockResolvedValue(mockMeeting);

      const result = await meetingsService.markAsCompleted(1);

      expect(meetingsRepository.markAsCompleted).toHaveBeenCalledWith(1, null);
      expect(result.is_completed).toBe(true);
    });
  });

  describe("deleteMeeting", () => {
    it("should delete meeting successfully", async () => {
      meetingsRepository.deleteMeeting.mockResolvedValue(true);

      const result = await meetingsService.deleteMeeting(1);

      expect(meetingsRepository.deleteMeeting).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });

  describe("searchMeetings", () => {
    it("should search meetings by query", async () => {
      const mockResults = [
        { id: 1, name: "Sprint Planning" },
        { id: 2, name: "Sprint Review" },
      ];

      meetingsRepository.searchMeetings.mockResolvedValue(mockResults);

      const result = await meetingsService.searchMeetings("Sprint");

      expect(meetingsRepository.searchMeetings).toHaveBeenCalledWith("Sprint");
      expect(result).toEqual(mockResults);
    });
  });
});
