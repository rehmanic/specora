"use client";

import FeedbackBuilder from "@/components/feedback/FeedbackBuilder";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EditFeedbackPage() {
  const { projectId, feedbackId } = useParams();

  return (
    <ProtectedRoute requiredPermissions={["update_feedback_form"]}>
      <div className="h-full bg-white">
        <FeedbackBuilder projectId={projectId} feedbackId={feedbackId} />
      </div>
    </ProtectedRoute>
  );
}
