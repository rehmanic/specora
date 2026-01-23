"use client";
import MeetingCard from "./MeetingCard";
import { Video, Calendar } from "lucide-react";

// Loading Skeleton
function MeetingSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded skeleton-shimmer" />
          <div className="h-4 w-20 rounded skeleton-shimmer" />
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full skeleton-shimmer" />
          ))}
        </div>
        <div className="h-9 w-full rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function MeetingList({ meetings, isLoading, type }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <MeetingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          {type === "upcoming" ? (
            <Calendar className="w-8 h-8 text-primary" />
          ) : (
            <Video className="w-8 h-8 text-primary" />
          )}
        </div>
        <h3 className="text-lg font-semibold font-display mb-1">
          No {type} meetings
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {type === "upcoming"
            ? "Schedule your first meeting to get started collaborating with your team"
            : "Completed meetings will appear here with recordings"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {meetings.map((meeting, index) => (
        <div
          key={meeting.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <MeetingCard meeting={meeting} type={type} />
        </div>
      ))}
    </div>
  );
}
