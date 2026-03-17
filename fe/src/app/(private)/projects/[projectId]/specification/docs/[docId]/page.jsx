"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, FileText, Check, Link, Trash2, X, Info } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { getDocById, updateDoc, updateDocRequirements, deleteDoc } from "@/api/docs";
import { getRequirements } from "@/api/requirements";
import RichTextEditor from "@/components/docs/RichTextEditor";
import useProjectsStore from "@/store/projectsStore";
import RequirementLinker from "@/components/prototyping/RequirementLinker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";

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
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const [requirements, setRequirements] = useState([]);
    const [linkedRequirementIds, setLinkedRequirementIds] = useState([]);
    const [isRightOpen, setIsRightOpen] = useState(true);

    const setEntityTitle = useProjectsStore(state => state.setEntityTitle);

    const titleInputRef = useRef(null);

    useEffect(() => {
        if (!projectId || !docId || !token) return;

        async function fetchData() {
            try {
                // Fetch Doc
                const data = await getDocById(projectId, docId);
                const d = data.doc;
                if (!d) throw new Error("Document not found");

                setDoc(d);
                setTitle(d.title || "");
                setContent(d.content || "");
                setType(d.type || "general");
                setEntityTitle(docId, d.title || "Document");
                
                const linked = (d.requirement_links || []).map(l => l.requirement?.id || l.requirement_id);
                setLinkedRequirementIds(linked);

                // Fetch Requirements for linker
                const reqData = await getRequirements(projectId);
                setRequirements(reqData.requirements || []);
            } catch (err) {
                console.error("Error loading document:", err);
                toast.error("Failed to load document.");
                router.push(`/projects/${projectId}/specification/docs`);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [projectId, docId, token, router, setEntityTitle]);

    const handleSave = async () => {
        if (!title.trim() || saving) return;

        setSaving(true);
        try {
            await updateDoc(projectId, docId, {
                title: title.trim(),
                content,
                type
            });
            setEntityTitle(docId, title.trim());
            setLastSaved(new Date());
            toast.success("Document saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to save document.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteDoc(projectId, docId);
            toast.success("Document deleted.");
            router.push(`/projects/${projectId}/specification/docs`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleToggleRequirement = async (reqId) => {
        const newIds = linkedRequirementIds.includes(reqId)
            ? linkedRequirementIds.filter(id => id !== reqId)
            : [...linkedRequirementIds, reqId];
        
        setLinkedRequirementIds(newIds);
        try {
            await updateDocRequirements(projectId, docId, newIds);
        } catch (err) {
            toast.error("Failed to update requirement links.");
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
                <header className="flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 z-10 shrink-0">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => router.push(`/projects/${projectId}/specification/docs`)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg flex-1 max-w-xl group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input
                                ref={titleInputRef}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-7 border-0 bg-transparent px-1 font-semibold focus-visible:ring-0 shadow-none text-base"
                                placeholder="Untitled Document"
                            />
                        </div>
                        <Badge variant="outline" className="hidden md:flex ml-2 h-6 text-[10px] uppercase tracking-wider font-bold bg-primary/5 text-primary border-primary/20">
                            {type}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                        <div className="hidden lg:flex items-center gap-2 mr-2">
                            {lastSaved && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md uppercase tracking-tight">
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={saving || !title.trim()}
                            size="sm"
                            className="gap-2 shadow-sm rounded-lg px-4 h-8"
                        >
                            {saving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            <span className="text-sm font-medium">Save</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden bg-background">
                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/5 scrollbar-thin">
                            <div className="max-w-4xl mx-auto bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden min-h-[85vh]">
                                {doc && (
                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Requirements Sidebar */}
                    {type === "use_case" && (
                        <div className={`transition-all duration-300 ease-in-out border-l border-border/50 bg-background flex flex-col ${isRightOpen ? 'w-[320px]' : 'w-10'}`}>
                            {isRightOpen ? (
                                <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-muted/5">
                                        <div className="flex items-center gap-2">
                                            <Link className="h-4 w-4 text-primary" />
                                            <h3 className="font-semibold text-sm">Traceability</h3>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsRightOpen(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-hidden p-3">
                                        <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
                                            <CardContent className="flex-1 p-0 overflow-hidden">
                                                {loading ? (
                                                    <div className="h-full flex items-center justify-center">
                                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                    </div>
                                                ) : requirements.length > 0 ? (
                                                    <div className="h-full rounded-lg overflow-hidden border border-border/50 bg-card/50">
                                                        <RequirementLinker
                                                            requirements={requirements}
                                                            linkedIds={linkedRequirementIds}
                                                            onToggle={handleToggleRequirement}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-dashed border-border/50 rounded-lg space-y-2">
                                                       <Info className="h-8 w-8 opacity-20" />
                                                       <p className="text-xs font-medium">No requirements available to link.</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-6 h-full cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setIsRightOpen(true)}>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 mb-4">
                                        <Link className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <div className="flex-1 flex items-center justify-center [writing-mode:vertical-lr] text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 select-none">
                                        Requirement Traceability
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <ConfirmationDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={handleDelete}
                    title="Delete Document"
                    description={`Are you sure you want to delete "${title}"? This action is permanent.`}
                    confirmText={deleting ? "Deleting..." : "Delete Permanently"}
                    variant="destructive"
                    loading={deleting}
                />
            </div>
        </ProtectedRoute>
    );
}
