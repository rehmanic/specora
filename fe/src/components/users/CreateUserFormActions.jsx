"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import ErrorBox from "@/components/common/ErrorBox";

export function CreateUserFormActions({ error, handleCancel, isSubmitting, isCreateUser }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      {error && <ErrorBox message={error} />}

      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="cursor-pointer gap-2 bg-transparent"
        disabled={isSubmitting}
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>

      <Button type="submit" className="cursor-pointer gap-2" disabled={isSubmitting}>
        <Save className="h-4 w-4" />
        {isSubmitting ? (isCreateUser ? "Creating..." : "Updating...") : isCreateUser ? "Create" : "Update"}
      </Button>
    </div>
  );
}
