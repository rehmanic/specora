"use client";

import FeedbackList from "@/components/feedback/FeedbackList";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function FeedbackPage() {
  const { projectId } = useParams();

  return (
    <ProtectedRoute requiredPermissions={["view_feedback_forms"]}>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <FeedbackList projectId={projectId} />
      </div>
    </ProtectedRoute>
  );
}
