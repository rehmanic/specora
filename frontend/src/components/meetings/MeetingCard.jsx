"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Link2, Video, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MeetingCard({ meeting, type }) {
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
          {type === "completed" && (
            <Badge variant="secondary" className="ml-2">
              Completed
            </Badge>
          )}
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {type === "upcoming" && meeting.meeting_link && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => window.open(meeting.meeting_link, "_blank")}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
          )}
          
          {type === "completed" && meeting.recording_link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(meeting.recording_link, "_blank")}
            >
              <Video className="w-4 h-4 mr-2" />
              View Recording
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(meeting.meeting_link, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
