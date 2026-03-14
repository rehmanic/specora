"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { getTemplateForType } from "@/utils/docTemplates";

export default function NewDocDialog({ onSubmit, open, onOpenChange }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("general");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const initialContent = getTemplateForType(type);
            await onSubmit({ title: title.trim(), type, content: initialContent });
            setTitle("");
            setType("general");
            onOpenChange(false);
        } catch {
            // error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Document</DialogTitle>
                        <DialogDescription>
                            Give your document a title and select its type. You can add content in the editor later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="doc-title">Title</Label>
                            <Input
                                id="doc-title"
                                placeholder="e.g. My First SRS"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-type">Document Type</Label>
                            <select
                                id="doc-type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="general">General Note</option>
                                <option value="srs">SRS (Software Requirements Spec)</option>
                                <option value="use_case">Textual Use Case</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !title.trim()} className="gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
