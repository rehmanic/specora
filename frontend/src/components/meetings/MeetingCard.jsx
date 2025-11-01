"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Users, Video, ExternalLink, Play, Copy, Check, Trash2, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import VideoPlayer from "@/components/video/VideoPlayer";

export default function MeetingCard({ meeting, type, onDelete }) {
  const router = useRouter();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    // If meeting link already exists, open it directly
    if (meeting.meeting_link) {
      window.open(meeting.meeting_link, '_blank');
      return;
    }

    // Otherwise, start the meeting first
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      // Call the start meeting endpoint to create Daily.co room
      const response = await fetch(
        `${API_URL}/api/meetings/${meeting.id}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const meetingData = result.data || result.meeting;
        
        // Open the Daily.co meeting link directly in a new tab
        if (meetingData?.meeting_link) {
          window.open(meetingData.meeting_link, '_blank');
          // Reload the page to show the updated meeting with the link
          window.location.reload();
        } else {
          console.error("No meeting link in response:", result);
          alert("Failed to get meeting link. Please try again.");
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to start meeting"}`);
      }
    } catch (error) {
      console.error("Error starting meeting:", error);
      alert("Failed to start meeting. Please try again.");
    }
  };

  const copyMeetingLink = async () => {
    if (meeting.meeting_link) {
      await navigator.clipboard.writeText(meeting.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!confirm(`Are you sure you want to delete "${meeting.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${API_URL}/api/meetings/${meeting.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Call the parent component's onDelete callback to refresh the list
        if (onDelete) {
          onDelete(meeting.id);
        } else {
          // Fallback: reload the page
          window.location.reload();
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to delete meeting"}`);
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to delete meeting. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {meeting.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {meeting.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {type === "completed" && (
              <Badge variant="secondary">
                Completed
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeleteMeeting}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Meeting"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scheduled Date & Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(meeting.scheduled_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(meeting.scheduled_at)}</span>
          </div>
        </div>

        {/* Scheduled By */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Scheduled by {meeting.scheduled_by}</span>
        </div>

        {/* Stakeholders */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Stakeholders</p>
          <div className="flex -space-x-2">
            {meeting.stakeholders.slice(0, 5).map((stakeholder, idx) => (
              <Avatar
                key={idx}
                className="border-2 border-background w-8 h-8"
                title={stakeholder}
              >
                <AvatarFallback className="text-xs">
                  {getInitials(stakeholder)}
                </AvatarFallback>
              </Avatar>
            ))}
            {meeting.stakeholders.length > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
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
              <code className="flex-1 text-xs bg-background px-2 py-1 rounded border truncate">
                {meeting.meeting_link}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyMeetingLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => window.open(meeting.meeting_link, '_blank')}
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
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleJoinMeeting}
            >
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
          )}
          
          {type === "completed" && meeting.recording_link && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowVideoPlayer(!showVideoPlayer)}
              >
                <Play className="w-4 h-4 mr-2" />
                {showVideoPlayer ? "Hide Recording" : "View Recording"}
              </Button>
            </>
          )}
        </div>

        {showVideoPlayer && meeting.recording_link && (
          <div className="mt-4">
            <VideoPlayer
              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${meeting.recording_link}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
