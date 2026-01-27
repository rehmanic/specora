"use client";

import FeedbackList from "@/components/feedback/FeedbackList";
import { useParams } from "next/navigation";

export default function FeedbackPage() {
  const { projectId } = useParams();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <FeedbackList projectId={projectId} />
    </div>
  );
}
