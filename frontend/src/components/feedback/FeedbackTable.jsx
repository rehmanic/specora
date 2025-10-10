"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const DUMMY_DATA = [
  { id: 1, title: "Improve onboarding flow", status: "Open" },
  { id: 2, title: "Dark mode contrast tweaks", status: "In Progress" },
  { id: 3, title: "Export to CSV feature", status: "Closed" },
  { id: 4, title: "Add keyboard shortcuts", status: "Open" },
  { id: 5, title: "Enhance mobile responsiveness", status: "In Progress" },
];

export function FeedbackTable({ isClient }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th
              scope="col"
              className="px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              id
            </th>
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {DUMMY_DATA.map((item) => (
            <tr key={item.id} className="bg-card">
              <td className="px-4 py-3 text-sm">{item.id}</td>
              <td className="px-4 py-3 text-sm">{item.title}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs",
                    item.status === "Open" &&
                      "bg-accent text-accent-foreground",
                    item.status === "In Progress" &&
                      "bg-secondary text-secondary-foreground",
                    item.status === "Closed" && "bg-muted text-muted-foreground"
                  )}
                >
                  {item.status}
                </span>
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
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      View
                    </DropdownMenuItem>
                    {!isClient && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Delete
                      </DropdownMenuItem>
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
