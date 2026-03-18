"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Check, X, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export function ExtractedRequirementsModal({ isOpen, onClose, requirements = [], onImport, isImporting = false }) {
  const [localReqs, setLocalReqs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);

  useEffect(() => {
    if (isOpen && requirements.length > 0) {
      // Initialize with temporary IDs for selection and editing
      const initReqs = requirements.map((req, i) => ({
        ...req,
        _tempId: `req-${i}-${Date.now()}`,
      }));
      setLocalReqs(initReqs);
      setSelectedIds(new Set(initReqs.map((r) => r._tempId)));
      setEditingId(null);
    } else if (!isOpen) {
      setLocalReqs([]);
      setSelectedIds(new Set());
    }
  }, [isOpen, requirements]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(localReqs.map((r) => r._tempId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const startEdit = (req) => {
    setEditingId(req._tempId);
    setEditForm({
      title: req.title,
      description: req.description,
      priority: req.priority || "mid",
      tags: req.tags ? req.tags.join(", ") : "",
    });
  };

  const saveEdit = (id) => {
    setLocalReqs((prev) =>
      prev.map((req) => {
        if (req._tempId === id) {
          return {
            ...req,
            title: editForm.title,
            description: editForm.description,
            priority: editForm.priority,
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          };
        }
        return req;
      })
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleImportClick = () => {
    setConfirmImportOpen(true);
  };

  const confirmImport = () => {
    const toImport = localReqs
      .filter((r) => selectedIds.has(r._tempId))
      .map((r) => {
        // Remove temp id
        const { _tempId, ...rest } = r;
        return {
          ...rest,
          status: "draft", // Enforce draft status for imported AI requirements
        };
      });
    onImport(toImport);
    setConfirmImportOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isImporting && !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle>Review Extracted Requirements</DialogTitle>
          <DialogDescription>
            AI extracted {requirements.length} requirements. Review, edit, and select which ones to import into the
            project as drafts.
          </DialogDescription>
        </DialogHeader>

        <div className="flex shrink-0 items-center space-x-2 py-4">
          <Checkbox
            id="select-all"
            checked={localReqs.length > 0 && selectedIds.size === localReqs.length}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All ({selectedIds.size} / {localReqs.length})
          </label>
        </div>

        <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6">
          <div className="space-y-4 pb-4">
            {localReqs.map((req) => {
              const isEditing = editingId === req._tempId;
              const isSelected = selectedIds.has(req._tempId);

              return (
                <div
                  key={req._tempId}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${isSelected ? "bg-primary/5 border-primary/20" : "bg-background hover:bg-muted/50"}`}
                >
                  <div className="pt-1">
                    <Checkbox checked={isSelected} onCheckedChange={() => handleToggleSelect(req._tempId)} />
                  </div>

                  <div className="flex-1 space-y-2 overflow-hidden">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Requirement Title"
                          className="font-semibold"
                        />
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Detailed description..."
                          rows={3}
                        />
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              value={editForm.tags}
                              onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))}
                              placeholder="Tags (comma separated)..."
                            />
                          </div>
                          <div className="w-[150px]">
                            <Select
                              value={editForm.priority}
                              onValueChange={(val) => setEditForm((f) => ({ ...f, priority: val }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="mid">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(req._tempId)}>
                            <Check className="mr-2 h-4 w-4" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="flex items-center gap-2 text-base font-semibold">
                              {req.title}
                              <Badge
                                variant="outline"
                                className={`${getPriorityColor(req.priority)} text-[10px] uppercase`}
                              >
                                {req.priority}
                              </Badge>
                            </h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => startEdit(req)}
                          >
                            <Edit2 className="text-muted-foreground h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap">{req.description}</p>
                        {req.tags && req.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {req.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="flex items-center gap-1 text-[10px] font-normal"
                              >
                                <Tag className="h-3 w-3" /> {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {localReqs.length === 0 && (
              <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center">
                No requirements were extracted.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            onClick={handleImportClick}
            disabled={isImporting || selectedIds.size === 0 || localReqs.length === 0}
          >
            {isImporting ? "Importing..." : `Import ${selectedIds.size} Requirements`}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmationDialog
        open={confirmImportOpen}
        onOpenChange={setConfirmImportOpen}
        onConfirm={confirmImport}
        title="Import Requirements"
        description={`Are you sure you want to import ${selectedIds.size} requirements? They will be saved as drafts in your project.`}
        confirmText="Import"
      />
    </Dialog>
  );
}
