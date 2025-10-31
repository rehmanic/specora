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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const upcomingResponse = await fetch(`${API_URL}/api/meetings/upcoming`);
      const completedResponse = await fetch(`${API_URL}/api/meetings/completed`);

      if (upcomingResponse.ok && completedResponse.ok) {
        const upcoming = await upcomingResponse.json();
        const completed = await completedResponse.json();
        setUpcomingMeetings(upcoming.meetings || upcoming);
        setCompletedMeetings(completed.meetings || completed);
      } else {
        setUpcomingMeetings(getMockUpcomingMeetings());
        setCompletedMeetings(getMockCompletedMeetings());
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setUpcomingMeetings(getMockUpcomingMeetings());
      setCompletedMeetings(getMockCompletedMeetings());
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleMeeting = async (meetingData) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        const result = await response.json();
        const newMeeting = result.meeting || result;
        
        setUpcomingMeetings([newMeeting, ...upcomingMeetings]);
        setIsScheduleModalOpen(false);
        
        await fetch(`${API_URL}/api/meetings/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetingId: newMeeting.id }),
        });
        
        alert("Meeting scheduled successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to schedule meeting"}`);
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Please try again.");
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
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      is_completed: false,
    },
    {
      id: 2,
      name: "Client Requirements Review",
      description: "Review and validate requirements with stakeholders",
      stakeholders: ["client@company.com", "manager@specora.com"],
      scheduled_by: "Jane Smith",
      scheduled_at: new Date(Date.now() + 172800000).toISOString(),
      is_completed: false,
    },
    {
      id: 3,
      name: "Technical Feasibility Discussion",
      description: "Assess technical constraints and architecture decisions",
      stakeholders: ["tech-lead@specora.com", "architect@specora.com"],
      scheduled_by: "John Doe",
      scheduled_at: new Date(Date.now() + 259200000).toISOString(),
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
      recording_link: "/recordings/recording_1696123456789.webm",
      scheduled_at: new Date(Date.now() - 604800000).toISOString(),
      is_completed: true,
    },
    {
      id: 5,
      name: "Requirement Prioritization Session",
      description: "Prioritize features based on business value and technical complexity",
      stakeholders: ["product-owner@specora.com", "scrum-master@specora.com"],
      scheduled_by: "Jane Smith",
      recording_link: "/recordings/recording_1696987654321.webm",
      scheduled_at: new Date(Date.now() - 1209600000).toISOString(),
      is_completed: true,
    },
  ];
}
