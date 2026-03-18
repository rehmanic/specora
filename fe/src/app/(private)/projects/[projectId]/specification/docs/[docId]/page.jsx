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

  const setEntityTitle = useProjectsStore((state) => state.setEntityTitle);

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

        const linked = (d.requirement_links || []).map((l) => l.requirement?.id || l.requirement_id);
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
        type,
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
      ? linkedRequirementIds.filter((id) => id !== reqId)
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        {/* Header Navbar */}
        <header className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/60 z-10 flex shrink-0 items-center justify-between border-b px-4 py-2 backdrop-blur">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              onClick={() => router.push(`/projects/${projectId}/specification/docs`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="bg-muted/30 group focus-within:ring-primary/20 flex max-w-xl flex-1 items-center gap-2 rounded-lg px-3 py-1 transition-all focus-within:ring-2">
              <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
              <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-7 border-0 bg-transparent px-1 text-base font-semibold shadow-none focus-visible:ring-0"
                placeholder="Untitled Document"
              />
            </div>
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 ml-2 hidden h-6 text-[10px] font-bold tracking-wider uppercase md:flex"
            >
              {type}
            </Badge>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-3">
            <div className="mr-2 hidden items-center gap-2 lg:flex">
              {lastSaved && (
                <span className="text-muted-foreground bg-muted/50 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] tracking-tight uppercase">
                  <Check className="h-3 w-3 text-emerald-500" />
                  Last saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              size="sm"
              className="h-8 gap-2 rounded-lg px-4 shadow-sm"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span className="text-sm font-medium">Save</span>
            </Button>
          </div>
        </header>

        <main className="bg-background flex flex-1 overflow-hidden">
          {/* Editor Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="bg-muted/5 scrollbar-thin flex-1 overflow-y-auto p-4 md:p-8">
              <div className="bg-card border-border/50 mx-auto min-h-[85vh] max-w-4xl overflow-hidden rounded-xl border shadow-sm">
                {doc && <RichTextEditor content={content} onChange={setContent} />}
              </div>
            </div>
          </div>

          {/* Requirements Sidebar */}
          {type === "use_case" && (
            <div
              className={`border-border/50 bg-background flex flex-col border-l transition-all duration-300 ease-in-out ${isRightOpen ? "w-[320px]" : "w-10"}`}
            >
              {isRightOpen ? (
                <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col overflow-hidden duration-300">
                  <div className="border-border/50 bg-muted/5 flex shrink-0 items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                      <Link className="text-primary h-4 w-4" />
                      <h3 className="text-sm font-semibold">Traceability</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsRightOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-hidden p-3">
                    <Card className="flex h-full flex-col border-none bg-transparent shadow-none">
                      <CardContent className="flex-1 overflow-hidden p-0">
                        {loading ? (
                          <div className="flex h-full items-center justify-center">
                            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                          </div>
                        ) : requirements.length > 0 ? (
                          <div className="border-border/50 bg-card/50 h-full overflow-hidden rounded-lg border">
                            <RequirementLinker
                              requirements={requirements}
                              linkedIds={linkedRequirementIds}
                              onToggle={handleToggleRequirement}
                            />
                          </div>
                        ) : (
                          <div className="text-muted-foreground border-border/50 flex h-full flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-6 text-center">
                            <Info className="h-8 w-8 opacity-20" />
                            <p className="text-xs font-medium">No requirements available to link.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div
                  className="hover:bg-muted/30 flex h-full cursor-pointer flex-col items-center py-6 transition-colors"
                  onClick={() => setIsRightOpen(true)}
                >
                  <Button variant="ghost" size="icon" className="mb-4 h-7 w-7">
                    <Link className="text-muted-foreground h-4 w-4" />
                  </Button>
                  <div className="text-muted-foreground/60 flex flex-1 items-center justify-center text-[10px] font-bold tracking-widest uppercase select-none [writing-mode:vertical-lr]">
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
