"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["draft", "pending", "approved", "rejected"];
const PRIORITIES = ["low", "mid", "high"];

export default function RequirementDialog({ open, onOpenChange, onSubmit, initialData = null, loading = false }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("mid");
    const [status, setStatus] = useState("draft");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    // Initialize state when dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setTitle(initialData.title || "");
                setDescription(initialData.description || "");
                setPriority(initialData.priority || "mid");
                setStatus(initialData.status || "draft");
                setTags(initialData.tags || []);
            } else {
                setTitle("");
                setDescription("");
                setPriority("mid");
                setStatus("draft");
                setTags([]);
            }
            setTagInput("");
        }
    }, [open, initialData]);

    const handleTagInputKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            priority,
            status,
            tags
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{initialData ? "Edit Requirement" : "New Requirement"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                placeholder="E.g., User Authentication System"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="description"
                                placeholder="Detailed description of the requirement..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={5}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRIORITIES.map(p => (
                                            <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map(s => (
                                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="gap-1 px-2 py-0.5">
                                        {tag}
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:text-foreground ml-1 font-bold"
                                            onClick={() => removeTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                id="tags"
                                placeholder="Type a tag and press Enter or comma"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title || !description || loading} className="gradient-primary border-0">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Save Changes" : "Create Requirement"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
