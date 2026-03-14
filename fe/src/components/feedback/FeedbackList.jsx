"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjectFeedbacks } from "@/api/feedback";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, MessageSquare, Edit, Trash2, Eye } from "lucide-react";
import { deleteFeedback } from "@/api/feedback";
import Link from "next/link";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import PageBanner from "@/components/layout/PageBanner";
import { MessageCircleQuestion } from "lucide-react";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";

export default function FeedbackList({ projectId }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Check if user is Manager or Requirements Engineer
    const canCreate = ["manager", "requirements_engineer"].includes(user?.role);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const data = await getProjectFeedbacks(projectId);
                setFeedbacks(data.feedbacks || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchFeedbacks();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <PageBanner
                title="Feedback Forms"
                description="Manage feedback forms and view responses."
                icon={MessageCircleQuestion}
            />

            <SearchCreateHeader 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search feedback..."
                linkTo="./feedback/create"
                showButton={canCreate}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Responses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No feedback forms found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            feedbacks
                                .filter(f => f.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((item) => (
                                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`./feedback/${item.id}`)}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            item.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(item.created_at), "PPP")}</TableCell>
                                    <TableCell>{item._count?.feedback_response || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {canCreate && (
                                                <>
                                                    <Button variant="ghost" size="icon" asChild onClick={(e) => e.stopPropagation()} title="Edit">
                                                        <Link href={`./feedback/${item.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
                                                            try {
                                                                await deleteFeedback(item.id);
                                                                setFeedbacks(prev => prev.filter(f => f.id !== item.id));
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert("Failed to delete form");
                                                            }
                                                        }
                                                    }} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="ghost" size="icon" asChild title="View">
                                                <Link href={`./feedback/${item.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
