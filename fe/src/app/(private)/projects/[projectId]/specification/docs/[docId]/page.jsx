"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, FileText, Check } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { getDocById, updateDoc } from "@/api/docs";
import RichTextEditor from "@/components/docs/RichTextEditor";

export default function DocEditorPage() {
    const { projectId, docId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [doc, setDoc] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("general");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const titleInputRef = useRef(null);

    useEffect(() => {
        if (!projectId || !docId || !token) return;

        async function fetchDoc() {
            try {
                const data = await getDocById(projectId, docId);
                const d = data.doc;
                if (!d) throw new Error("Document not found");

                setDoc(d);
                setTitle(d.title || "");
                setContent(d.content || "");
                setType(d.type || "general");
            } catch (err) {
                console.error("Error loading document:", err);
                toast.error("Failed to load document.");
                router.push(`/projects/${projectId}/specification/docs`);
            } finally {
                setLoading(false);
            }
        }

        fetchDoc();
    }, [projectId, docId, token, router]);

    const handleSave = async () => {
        if (!title.trim() || saving) return;

        setSaving(true);
        try {
            await updateDoc(projectId, docId, {
                title: title.trim(),
                content,
                type
            });
            setLastSaved(new Date());
            toast.success("Document saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save document.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Header Navbar */}
                <header className="flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1 min-w-0">


                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg flex-1 max-w-xl group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input
                                ref={titleInputRef}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-7 border-0 bg-transparent px-1 font-medium focus-visible:ring-0 shadow-none sm:text-lg"
                                placeholder="Untitled Document"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                        <div className="hidden sm:flex items-center gap-2">
                            {lastSaved && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                    <Check className="h-3 w-3" />
                                    Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={saving || !title.trim()}
                            size="sm"
                            className="gap-2 shadow-sm rounded-full px-4"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">Save</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    <div className="flex-1 w-full bg-muted/10 p-4 md:p-8 overflow-y-auto">
                        <div className="max-w-4xl mx-auto shadow-sm overflow-hidden flex flex-col">
                            {doc && (
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
