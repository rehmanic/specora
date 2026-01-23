"use client";
import { useState, useEffect } from "react";
import MeetingList from "@/components/meetings/MeetingList";
import ScheduleMeetingModal from "@/components/meetings/ScheduleMeetingModal";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Clock, Users, Plus } from "lucide-react";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover-lift cursor-default">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

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

      const response = await fetch(`${API_URL}/api/meetings/schedule`, {
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

  // Calculate total meeting hours (mock)
  const totalHours = (upcomingMeetings.length + completedMeetings.length) * 0.75;

  return (
    <section className="flex flex-col w-full p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold font-display">Meetings</h1>
            <p className="text-muted-foreground mt-1">
              Schedule and manage meetings with your team and stakeholders
            </p>
          </div>
          <Button
            onClick={() => setIsScheduleModalOpen(true)}
            className="gap-2 gradient-primary border-0"
          >
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatsCard
            icon={Calendar}
            label="Upcoming"
            value={upcomingMeetings.length}
            color="primary"
          />
          <StatsCard
            icon={Video}
            label="Completed"
            value={completedMeetings.length}
            color="success"
          />
          <StatsCard
            icon={Clock}
            label="Total Hours"
            value={totalHours.toFixed(1)}
            color="accent"
          />
          <StatsCard
            icon={Users}
            label="Participants"
            value={upcomingMeetings.reduce((acc, m) => acc + (m.stakeholders?.length || 0), 0)}
            color="warning"
          />
        </div>

        {/* Upcoming Meetings Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold font-display">
              Upcoming Meetings
            </h2>
            <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
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
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold font-display">
              Completed Meetings
            </h2>
            <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
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
      </div>
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
