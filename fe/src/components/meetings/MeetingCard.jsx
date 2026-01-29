"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video, ExternalLink, Play, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import VideoPlayer from "@/components/video/VideoPlayer";

export default function MeetingCard({ meeting, type }) {
  const router = useRouter();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
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
      const roomId = meeting.meeting_link.split('/').pop();
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

  return (
    <Card className="card-interactive overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 truncate group-hover:text-primary transition-colors font-display">
              {meeting.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {meeting.description}
            </CardDescription>
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(meeting.scheduled_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(meeting.scheduled_at)}</span>
          </div>
        </div>

        {/* Scheduled By */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Scheduled by <span className="font-medium text-foreground">{meeting.scheduled_by}</span></span>
        </div>

        {/* Stakeholders */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Participants</p>
          <div className="flex -space-x-2">
            {meeting.stakeholders.slice(0, 5).map((stakeholder, idx) => (
              <Avatar
                key={idx}
                className="border-2 border-card w-8 h-8 hover:z-10 transition-transform hover:scale-110"
                title={stakeholder}
              >
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(stakeholder)}
                </AvatarFallback>
              </Avatar>
            ))}
            {meeting.stakeholders.length > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-card text-xs font-medium">
                +{meeting.stakeholders.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Meeting Link (if exists) */}
        {meeting.meeting_link && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Meeting Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-card px-2 py-1.5 rounded border truncate">
                {meeting.meeting_link}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyMeetingLink}
                className="shrink-0 h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              onClick={handleJoinMeeting}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Click to join meeting
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {type === "upcoming" && (
            <Button
              size="sm"
              className="flex-1 gap-2 gradient-primary border-0"
              onClick={handleJoinMeeting}
            >
              <Video className="w-4 h-4" />
              Start Meeting
            </Button>
          )}

          {type === "completed" && meeting.recording_link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setShowVideoPlayer(!showVideoPlayer)}
            >
              <Play className="w-4 h-4" />
              {showVideoPlayer ? "Hide Recording" : "View Recording"}
            </Button>
          )}
        </div>

        {showVideoPlayer && meeting.recording_link && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <VideoPlayer
              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${meeting.recording_link}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
