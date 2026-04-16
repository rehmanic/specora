"use client";

import FeedbackBuilder from "@/components/feedback/FeedbackBuilder";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateFeedbackPage() {
  const { projectId } = useParams();

  return (
    <ProtectedRoute requiredPermissions={["create_feedback_form"]}>
      <div className="h-full bg-white">
        {" "}
        {/* Ensure white background for SurveyJS */}
        <FeedbackBuilder projectId={projectId} />
      </div>
    </ProtectedRoute>
  );
}
