"use client";
import MeetingCard from "./MeetingCard";
import { Video, Calendar } from "lucide-react";

// Loading Skeleton
function MeetingSkeleton() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="space-y-4 p-6">
        <div className="skeleton-shimmer h-5 w-3/4 rounded" />
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="flex gap-4">
          <div className="skeleton-shimmer h-4 w-24 rounded" />
          <div className="skeleton-shimmer h-4 w-20 rounded" />
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-shimmer h-8 w-8 rounded-full" />
          ))}
        </div>
        <div className="skeleton-shimmer h-9 w-full rounded" />
      </div>
    </div>
  );
}

export default function MeetingList({ meetings, isLoading, type }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <MeetingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="border-border bg-card animate-fade-in flex flex-col items-center justify-center rounded-xl border py-16 text-center">
        <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          {type === "upcoming" ? (
            <Calendar className="text-primary h-8 w-8" />
          ) : (
            <Video className="text-primary h-8 w-8" />
          )}
        </div>
        <h3 className="font-display mb-1 text-lg font-semibold">No {type} meetings</h3>
        <p className="text-muted-foreground max-w-xs text-sm">
          {type === "upcoming"
            ? "Schedule your first meeting to get started collaborating with your team"
            : "Completed meetings will appear here with recordings"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {meetings.map((meeting, index) => (
        <div key={meeting.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <MeetingCard meeting={meeting} type={type} />
        </div>
      ))}
    </div>
  );
}
