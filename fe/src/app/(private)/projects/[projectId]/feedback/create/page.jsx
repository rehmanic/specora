"use client";

import FeedbackBuilder from "@/components/feedback/FeedbackBuilder";
import { useParams } from "next/navigation";

export default function CreateFeedbackPage() {
  const { projectId } = useParams();

  return (
    <div className="bg-white h-full"> {/* Ensure white background for SurveyJS */}
      <FeedbackBuilder projectId={projectId} />
    </div>
  );
}
