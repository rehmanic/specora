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
import { Loader2 } from "lucide-react";

export default function NewChatDialog({ open, onOpenChange, onCreateChat, loading }) {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const validateTitle = (value) => {
        if (!value.trim()) {
            return "Chat title is required";
        }
        if (value.trim().length < 3) {
            return "Title must be at least 3 characters";
        }
        if (value.trim().length > 100) {
            return "Title must be less than 100 characters";
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationError = validateTitle(title);
        if (validationError) {
            setError(validationError);
            return;
        }

        onCreateChat(title.trim());
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);

        // Clear error when user starts typing
        if (error) {
            setError("");
        }
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen && !loading) {
            // Reset form when dialog closes
            setTitle("");
            setError("");
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                        Give your chat a descriptive title. You can change it later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Chat Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="e.g., Project Requirements Discussion"
                                value={title}
                                onChange={handleTitleChange}
                                disabled={loading}
                                className={error ? "border-destructive" : ""}
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {title.length}/100 characters
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !title.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Chat"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
