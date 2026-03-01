"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

export default function NewDiagramDialog({ onSubmit }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await onSubmit({ title: title.trim() });
            setTitle("");
            setOpen(false);
        } catch {
            // error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> New Diagram
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Diagram</DialogTitle>
                        <DialogDescription>
                            Give your diagram a name. You can add Mermaid code in the editor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="diagram-title">Title</Label>
                            <Input
                                id="diagram-title"
                                placeholder="e.g. System Architecture"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                autoFocus
                            />
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
