"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFeedback } from "@/api/feedback";
import useAuthStore from "@/store/authStore";
import FeedbackViewer from "@/components/feedback/FeedbackViewer";
import FeedbackResults from "@/components/feedback/FeedbackResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import useProjectsStore from "@/store/projectsStore";

export default function FeedbackDetailsPage() {
  const { projectId, feedbackId } = useParams();
  const { user } = useAuthStore();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await getFeedback(feedbackId);
        setFeedback(data.feedback);
        if (data.feedback?.title) {
          useProjectsStore.getState().setEntityTitle(feedbackId, data.feedback.title);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (feedbackId) fetchFeedback();
  }, [feedbackId]);

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!feedback) return <div className="p-8">Feedback not found</div>;

  const isManager = ["manager", "requirements_engineer"].includes(user?.role);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <h2 className="truncate text-3xl font-bold tracking-tight">{feedback.title}</h2>
        </div>
        {isManager && (
          <Button asChild>
            <Link href={`/projects/${projectId}/feedback/${feedbackId}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Form
            </Link>
          </Button>
        )}
      </div>

      {isManager ? (
        <div className="space-y-4">
          <FeedbackResults feedbackId={feedbackId} formStructure={feedback.form_structure} />
        </div>
      ) : (
        <div className="mt-6">
          <FeedbackViewer feedback={feedback} projectId={projectId} />
        </div>
      )}
    </div>
  );
}
