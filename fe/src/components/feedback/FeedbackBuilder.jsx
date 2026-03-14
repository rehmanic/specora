"use client";

import { useEffect, useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createFeedback, updateFeedback, getFeedback } from "@/api/feedback";
import { toast } from "sonner";

export default function FeedbackBuilder({ projectId, feedbackId }) {
    const router = useRouter();
    const [creator, setCreator] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!feedbackId); // Load if editing

    useEffect(() => {
        const options = {
            showLogicTab: true,
            isAutoSave: false,
            showJSONEditorTab: false,
        };
        const newCreator = new SurveyCreator(options);
        newCreator.saveSurveyFunc = (saveNo, callback) => callback(saveNo, true);

        setCreator(newCreator);
    }, []);

    // Load existing feedback if editing
    useEffect(() => {
        const fetchFeedbackData = async () => {
            if (!feedbackId || !creator) return;

            try {
                const data = await getFeedback(feedbackId);
                const feedback = data.feedback;

                if (feedback) {
                    creator.JSON = feedback.form_structure;
                    creator.text = JSON.stringify(feedback.form_structure);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load feedback form");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbackData();
    }, [feedbackId, creator]);

    const handleSave = async () => {
        if (!creator) return;

        setSaving(true);
        try {
            const json = creator.JSON;
            const title = json.title || "Untitled Feedback Form";
            const description = json.description || "";

            // Use title from JSON or fallback
            // Note: SurveyJS stores title inside the JSON object as "title" property

            if (feedbackId) {
                await updateFeedback(feedbackId, {
                    title,
                    description,
                    formStructure: json,
                    status: "edited"
                });
                toast.success("Feedback form updated successfully");
            } else {
                await createFeedback({
                    projectId,
                    title,
                    description,
                    formStructure: json,
                    status: "created"
                });
                toast.success("Feedback form created successfully");
            }

            router.push(`/projects/${projectId}/feedback`);

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to save feedback form");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !creator) return <div className="p-8 flex items-center"><Loader2 className="mr-2 animate-spin" /> Loading Editor...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">

                    <h2 className="text-xl font-semibold">{feedbackId ? "Edit Feedback Form" : "Create Feedback Form"}</h2>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {feedbackId ? "Update Form" : "Save Form"}
                </Button>
            </div>
            <div className="flex-1 overflow-auto">
                <SurveyCreatorComponent creator={creator} />
            </div>
        </div>
    );
}
