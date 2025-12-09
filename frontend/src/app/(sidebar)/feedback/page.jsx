"use client";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function FeedbackPage() {
    const { user } = useAuthStore();
    const isClient = user?.role === "client";

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Feedback</h1>
                    <p className="text-muted-foreground mt-1">
                        {isClient
                            ? "View and manage your feedback submissions"
                            : "Manage all feedback from clients"}
                    </p>
                </div>

                {isClient && (
                    <Link href="/feedback/create-feedback">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Feedback
                        </Button>
                    </Link>
                )}
            </div>

            <FeedbackTable isClient={isClient} />
        </div>
    );
}
