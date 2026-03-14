"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) {
  const indexOfFirstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const indexOfLastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-semibold">{indexOfFirstItem}</span>{" "}
        to{" "}
        <span className="font-semibold">{indexOfLastItem}</span>{" "}
        of{" "}
        <span className="font-semibold">{totalItems}</span>{" "}
        results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border/50 bg-background/50 hover:bg-background transition-colors"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className={`h-8 w-8 text-xs transition-all duration-300 ${
              currentPage === page
                ? "gradient-primary border-0 shadow-lg shadow-primary/25 scale-105"
                : "border-border/50 bg-background/50 hover:bg-background"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border/50 bg-background/50 hover:bg-background transition-colors"
          onClick={() => onPageChange(Math.min(Math.max(1, totalPages), currentPage + 1))}
          disabled={currentPage === Math.max(1, totalPages) || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
