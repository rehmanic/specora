"use client";

import { useEffect, useState } from "react";
import { getResponses } from "@/api/feedback";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { deleteResponse } from "@/api/feedback"; // Ensure this is exported

export default function FeedbackResults({ feedbackId }) {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState(null);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                setLoading(true);
                const data = await getResponses(feedbackId);
                setResponses(data.responses || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResponses();
    }, [feedbackId]);

    const handleDelete = async (responseId) => {
        if (!confirm("Delete this response?")) return;
        try {
            await deleteResponse(responseId);
            setResponses(prev => prev.filter(r => r.id !== responseId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete response");
        }
    };

    if (loading) return <Skeleton className="h-40 w-full" />;

    if (responses.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No responses yet.</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Responses ({responses.length})</h3>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Response Preview</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {responses.map((res) => (
                            <TableRow key={res.id}>
                                <TableCell>{format(new Date(res.created_at), "PPP p")}</TableCell>
                                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                                    {JSON.stringify(res.response)}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedResponse(res)} title="View Response">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(res.id)} title="Delete Response">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Response Details</DialogTitle>
                        <DialogDescription>
                            Submitted on {selectedResponse && format(new Date(selectedResponse.created_at), "PPP p")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedResponse && Object.entries(selectedResponse.response).map(([key, value]) => (
                            <div key={key} className="border-b pb-2">
                                <span className="font-semibold block text-sm text-muted-foreground mb-1">{key}</span>
                                <div className="text-sm whitespace-pre-wrap">
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
