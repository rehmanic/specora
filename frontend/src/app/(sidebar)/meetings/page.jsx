"use client";
import { useState, useEffect } from "react";
import MeetingList from "@/components/meetings/MeetingList";
import ScheduleMeetingModal from "@/components/meetings/ScheduleMeetingModal";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function MeetingsPage() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch meetings on mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API calls
      const upcomingResponse = await fetch("/api/meetings/upcoming");
      const completedResponse = await fetch("/api/meetings/completed");

      if (upcomingResponse.ok && completedResponse.ok) {
        const upcoming = await upcomingResponse.json();
        const completed = await completedResponse.json();
        setUpcomingMeetings(upcoming);
        setCompletedMeetings(completed);
      } else {
        // Use mock data for development
        setUpcomingMeetings(getMockUpcomingMeetings());
        setCompletedMeetings(getMockCompletedMeetings());
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      // Fallback to mock data
      setUpcomingMeetings(getMockUpcomingMeetings());
      setCompletedMeetings(getMockCompletedMeetings());
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleMeeting = async (meetingData) => {
    try {
      const response = await fetch("/api/meetings/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        const newMeeting = await response.json();
        setUpcomingMeetings([...upcomingMeetings, newMeeting]);
        setIsScheduleModalOpen(false);
        
        // Send email invitations
        await fetch("/api/meetings/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMeeting),
        });
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    }
  };

  return (
    <section className="flex flex-col h-screen w-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
          <p className="text-muted-foreground mt-1">
            Manage and schedule meetings with your team and stakeholders
          </p>
        </div>
        <Button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Upcoming Meetings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Upcoming Meetings
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {upcomingMeetings.length}
          </span>
        </div>
        <MeetingList
          meetings={upcomingMeetings}
          isLoading={isLoading}
          type="upcoming"
        />
      </div>

      {/* Completed Meetings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Completed Meetings
          </h2>
          <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            {completedMeetings.length}
          </span>
        </div>
        <MeetingList
          meetings={completedMeetings}
          isLoading={isLoading}
          type="completed"
        />
      </div>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleMeeting}
      />
    </section>
  );
}

// Mock data for development
function getMockUpcomingMeetings() {
  return [
    {
      id: 1,
      name: "Sprint Planning - Q1 2025",
      description:
        "Discuss requirements gathering strategies for the new e-commerce module",
      stakeholders: ["alice@specora.com", "bob@specora.com", "charlie@specora.com"],
      scheduled_by: "John Doe",
      meeting_link: "https://meet.google.com/abc-defg-hij",
      scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      is_completed: false,
    },
    {
      id: 2,
      name: "Client Requirements Review",
      description: "Review and validate requirements with stakeholders",
      stakeholders: ["client@company.com", "manager@specora.com"],
      scheduled_by: "Jane Smith",
      meeting_link: "https://zoom.us/j/123456789",
      scheduled_at: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
      is_completed: false,
    },
    {
      id: 3,
      name: "Technical Feasibility Discussion",
      description: "Assess technical constraints and architecture decisions",
      stakeholders: ["tech-lead@specora.com", "architect@specora.com"],
      scheduled_by: "John Doe",
      meeting_link: "https://teams.microsoft.com/l/meetup-join/xyz",
      scheduled_at: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      is_completed: false,
    },
  ];
}

function getMockCompletedMeetings() {
  return [
    {
      id: 4,
      name: "Initial Requirements Workshop",
      description: "Kickoff meeting to gather initial requirements from all stakeholders",
      stakeholders: ["stakeholder1@company.com", "stakeholder2@company.com"],
      scheduled_by: "John Doe",
      meeting_link: "https://meet.google.com/past-meeting-1",
      recording_link: "https://drive.google.com/file/d/recording123",
      scheduled_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      is_completed: true,
    },
    {
      id: 5,
      name: "Requirement Prioritization Session",
      description: "Prioritize features based on business value and technical complexity",
      stakeholders: ["product-owner@specora.com", "scrum-master@specora.com"],
      scheduled_by: "Jane Smith",
      meeting_link: "https://zoom.us/j/987654321",
      recording_link: "https://drive.google.com/file/d/recording456",
      scheduled_at: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
      is_completed: true,
    },
  ];
}
