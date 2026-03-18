"use client";

import FeedbackBuilder from "@/components/feedback/FeedbackBuilder";
import { useParams } from "next/navigation";

export default function EditFeedbackPage() {
  const { projectId, feedbackId } = useParams();

  return (
    <div className="h-full bg-white">
      <FeedbackBuilder projectId={projectId} feedbackId={feedbackId} />
    </div>
  );
}
