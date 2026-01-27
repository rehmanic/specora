"use client";

import { useEffect, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { submitResponse, getUserResponse } from "@/api/feedback";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function FeedbackViewer({ feedback, projectId }) {
    const router = useRouter();
    const [survey, setSurvey] = useState(null);

    const { user } = useAuthStore();

    useEffect(() => {
        const initSurvey = async () => {
            if (!feedback || !feedback.form_structure) return;

            const surveyModel = new Model(feedback.form_structure);

            // If user is client, fetch existing response
            if (user?.role === 'client') {
                try {

                    // Actually better to define import at top. But here is fine.
                    const data = await getUserResponse(feedback.id);
                    if (data && data.response) {
                        // User has already responded, load data
                        surveyModel.data = data.response.response;
                        // Keep mode as 'edit' to allow them to "edit" it as per requirement
                    }
                } catch (e) {
                    console.log("No existing response or error:", e);
                }
            } else {
                // Non-clients (managers) view in display mode
                surveyModel.mode = 'display';
            }

            surveyModel.onComplete.add(async (sender, options) => {
                // Display loading or prevent double submit?
                // options.showSaveInProgress(); or similar if needed.

                try {
                    await submitResponse(feedback.id, sender.data);
                    toast.success("Thank you! Your feedback has been submitted/updated.");

                    // Redirect to list after short delay?
                    setTimeout(() => {
                        router.push(`/projects/${projectId}/feedback`);
                    }, 2000);

                } catch (error) {
                    console.error(error);
                    toast.error("Failed to submit feedback. Please try again.");
                    // options.showSaveError();
                }
            });

            setSurvey(surveyModel);
        }

        initSurvey();
    }, [feedback, projectId, router, user]);

    if (!survey) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white p-6 rounded-md shadow-sm border max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{feedback.title}</h1>
                {feedback.description && <p className="text-muted-foreground">{feedback.description}</p>}
            </div>
            <Survey model={survey} />
        </div>
    );
}
