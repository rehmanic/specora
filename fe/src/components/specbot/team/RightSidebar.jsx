"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RightSidebar() {
  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      {/* Content Area - Empty for now */}
      <div className="flex-1 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <div className="mt-4 text-sm text-muted-foreground">
          Chat details will appear here
        </div>
      </div>

      {/* Extract Button at Bottom */}
      <div className="border-t border-border p-4">
        <Button
          className="w-full justify-start gap-2 bg-transparent"
          variant="outline"
          size="lg"
        >
          <FileDown className="h-5 w-5" />
          <span className="font-medium">Extract</span>
        </Button>
      </div>
    </div>
  );
}
