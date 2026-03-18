"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video, ExternalLink, Play, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

export default function MeetingCard({ meeting, type }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (email) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const handleJoinMeeting = async () => {
    // Navigate to the project-scoped meeting room
    const projectId = meeting.project_id;

    if (meeting.meeting_link) {
      const roomId = meeting.meeting_link.split("/").pop();
      router.push(`/projects/${projectId}/meetings/room/${roomId}`);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/video/create-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingId: meeting.id,
            hostId: "user_123",
            hostName: meeting.scheduled_by,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        router.push(`/projects/${projectId}/meetings/room/${data.roomId}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const copyMeetingLink = async () => {
    if (meeting.meeting_link) {
      await navigator.clipboard.writeText(meeting.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExtractRequirements = () => {
    // Navigate to the meeting review page and switch to requirements tab
    router.push(`/projects/${meeting.project_id}/meetings/${meeting.id}?tab=requirements`);
  };

  return (
    <Card className="card-interactive overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="group-hover:text-primary font-display mb-1 truncate text-lg transition-colors">
              {meeting.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm">{meeting.description}</CardDescription>
          </div>
          <Badge
            variant={type === "completed" ? "secondary" : "default"}
            className={type === "upcoming" ? "bg-success/15 text-success border-success/30" : ""}
          >
            {type === "completed" ? "Completed" : "Upcoming"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scheduled Date & Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <span>{formatDate(meeting.scheduled_at)}</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <Clock className="text-primary h-4 w-4" />
            <span>{formatTime(meeting.scheduled_at)}</span>
          </div>
        </div>

        {/* Scheduled By */}
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span>
            Scheduled by <span className="text-foreground font-medium">{meeting.scheduled_by}</span>
          </span>
        </div>

        {/* Stakeholders */}
        <div>
          <p className="text-muted-foreground mb-2 text-xs">Participants</p>
          <div className="flex -space-x-2">
            {meeting.stakeholders.slice(0, 5).map((stakeholder, idx) => (
              <Avatar
                key={idx}
                className="border-card h-8 w-8 border-2 transition-transform hover:z-10 hover:scale-110"
                title={stakeholder}
              >
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(stakeholder)}
                </AvatarFallback>
              </Avatar>
            ))}
            {meeting.stakeholders.length > 5 && (
              <div className="bg-muted border-card flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                +{meeting.stakeholders.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Meeting Link (if exists) */}
        {meeting.meeting_link && (
          <div className="bg-muted/50 space-y-2 rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-medium">Meeting Link</p>
            <div className="flex items-center gap-2">
              <code className="bg-card flex-1 truncate rounded border px-2 py-1.5 text-xs">{meeting.meeting_link}</code>
              <Button variant="ghost" size="sm" onClick={copyMeetingLink} className="h-8 w-8 shrink-0 p-0">
                {copied ? <Check className="text-success h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="link" size="sm" className="text-primary h-auto p-0 text-xs" onClick={handleJoinMeeting}>
              <ExternalLink className="mr-1 h-3 w-3" />
              Click to join meeting
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {type === "upcoming" && (
            <Button size="sm" className="gradient-primary flex-1 gap-2 border-0" onClick={handleJoinMeeting}>
              <Video className="h-4 w-4" />
              Start Meeting
            </Button>
          )}

          {type === "completed" && meeting.recording_url && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => router.push(`/projects/${meeting.project_id}/meetings/${meeting.id}`)}
            >
              <Video className="h-4 w-4" />
              View Recording
            </Button>
          )}

          {type === "completed" && (
            <Button
              variant="secondary"
              size="sm"
              className="border-primary/20 hover:bg-primary/5 flex-1 gap-2 transition-colors"
              onClick={handleExtractRequirements}
            >
              <Settings className="h-4 w-4" />
              Requirements
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
