"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getAllFeedback } from "@/api/feedback";
import useAuthStore from "@/store/authStore";

export function FeedbackTable({ isClient }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllFeedback(token);
        setFeedbacks(data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  if (loading) {
    return <p className="p-4 text-muted-foreground">Loading feedbacks...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">Error: {error}</p>;
  }

  if (feedbacks.length === 0) {
    return (
      <p className="p-4 text-muted-foreground">
        No feedback found. {isClient && "Create your first feedback to get started!"}
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th
              scope="col"
              className="px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {feedbacks.map((item) => (
            <tr key={item.id} className="bg-card">
              <td className="px-4 py-3 text-sm">{item.title || "Untitled"}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs",
                    item.status?.toLowerCase() === "open" &&
                    "bg-accent text-accent-foreground",
                    item.status?.toLowerCase() === "in progress" &&
                    "bg-secondary text-secondary-foreground",
                    item.status?.toLowerCase() === "closed" && "bg-muted text-muted-foreground"
                  )}
                >
                  {item.status || "Open"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Open actions menu for feedback ${item.id}`}
                    >
                      <span aria-hidden="true" className="text-lg leading-none">
                        ⋮
                      </span>
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      View
                    </DropdownMenuItem>
                    {!isClient && (
                      <>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
