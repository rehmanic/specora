"use client";

import FeedbackBuilder from "@/components/feedback/FeedbackBuilder";
import { useParams } from "next/navigation";

export default function CreateFeedbackPage() {
  const { projectId } = useParams();

  return (
    <div className="h-full bg-white">
      {" "}
      {/* Ensure white background for SurveyJS */}
      <FeedbackBuilder projectId={projectId} />
    </div>
  );
}
