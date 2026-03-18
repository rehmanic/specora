"use client";

import { useEffect, useState } from "react";
import { getResponses } from "@/api/feedback";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { deleteResponse } from "@/api/feedback";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function FeedbackResults({ feedbackId, formStructure }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!responseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResponse(responseToDelete);
      setResponses((prev) => prev.filter((r) => r.id !== responseToDelete));
      setResponseToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete response");
    } finally {
      setIsDeleting(false);
    }
  };

  const getQuestionTitle = (name) => {
    if (!formStructure || !formStructure.pages) return name;
    for (const page of formStructure.pages) {
      const element = page.elements?.find((e) => e.name === name);
      if (element) return element.title || element.name;
    }
    return name;
  };

  const getPreview = (responseObj) => {
    const entries = Object.entries(responseObj);
    if (entries.length === 0) return "Empty response";
    const [key, value] = entries[0];
    const title = getQuestionTitle(key);
    const displayValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${title}: ${displayValue}`;
  };

  if (loading) return <Skeleton className="h-40 w-full" />;

  if (responses.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">No responses yet.</div>;
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
                <TableCell className="text-muted-foreground max-w-[300px] truncate">
                  {getPreview(res.response)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedResponse(res)} title="View Response">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setResponseToDelete(res.id)}
                    title="Delete Response"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse && format(new Date(selectedResponse.created_at), "PPP p")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedResponse &&
              Object.entries(selectedResponse.response).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <span className="text-muted-foreground mb-1 block text-sm font-semibold">
                    {getQuestionTitle(key)}
                  </span>
                  <div className="text-sm whitespace-pre-wrap">
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!responseToDelete}
        onOpenChange={(open) => !open && setResponseToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Response"
        description="Are you sure you want to delete this response? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
