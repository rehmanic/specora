"use client";

import { useState, useEffect } from "react";
import { useParams as useNextParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Plus,
  MessageSquare,
  History,
  Link as LinkIcon,
  Send,
  RotateCcw,
  Trash2,
  Settings2,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  getRequirementHistory,
  rollbackRequirement,
  getRequirementComments,
  addRequirementComment,
  getTraceabilityLinks,
  createTraceabilityLink,
  deleteTraceabilityLink,
} from "@/api/requirements";

const STATUSES = ["draft", "pending", "approved", "rejected"];
const PRIORITIES = ["low", "mid", "high"];

const NAV_ITEMS = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "history", label: "History", icon: History },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "dependency", label: "Dependency", icon: LinkIcon },
];

export default function RequirementDialog({ open, onOpenChange, onSubmit, initialData = null, loading = false }) {
  const { projectId } = useNextParams();
  const [activeSection, setActiveSection] = useState("general");

  // General State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("mid");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("");
  const [changeReason, setChangeReason] = useState("");

  // History State
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Comments State
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Dependency State
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [allRequirements, setAllRequirements] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveSection("general");
      if (initialData?.id) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setPriority(initialData.priority || "mid");
        setStatus(initialData.status || "draft");
        setTags(initialData.tags || []);
        setCategory(initialData.category || "");
        setChangeReason("");
        loadHistory();
        loadComments();
        loadLinks();
      } else {
        setTitle("");
        setDescription("");
        setPriority("mid");
        setStatus("pending");
        setTags([]);
        setCategory("");
        setChangeReason("");
      }
      setTagInput("");
    }
  }, [open, initialData]);

  const loadHistory = async () => {
    if (!initialData?.id) return;
    setHistoryLoading(true);
    try {
      const res = await getRequirementHistory(projectId, initialData.id);
      setHistory(res.history || []);
    } catch (e) {
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadComments = async () => {
    if (!initialData?.id) return;
    setCommentsLoading(true);
    try {
      const res = await getRequirementComments(projectId, initialData.id);
      setComments(res.comments || []);
    } catch (e) {
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadLinks = async () => {
    if (!initialData?.id) return;
    setLinksLoading(true);
    try {
      const [linksRes, reqsRes] = await Promise.all([
        getTraceabilityLinks(projectId, initialData.id),
        import("@/api/requirements").then((api) => api.getRequirements(projectId)),
      ]);
      setLinks(linksRes.links || []);
      setAllRequirements((reqsRes.requirements || []).filter((r) => r.id !== initialData.id));
    } catch (e) {
      toast.error("Failed to load dependencies");
    } finally {
      setLinksLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!selectedTarget) return;

    // Prevent duplicate dependency
    const alreadyExists = links.some(
      (l) =>
        (l.source_requirement_id === initialData.id && l.target_requirement_id === selectedTarget) ||
        (l.target_requirement_id === initialData.id && l.source_requirement_id === selectedTarget)
    );

    if (alreadyExists) {
      toast.error("This dependency already exists");
      return;
    }

    try {
      await createTraceabilityLink(projectId, initialData.id, {
        target_type: "requirement",
        target_id: selectedTarget,
        link_type: "depends_on",
      });
      toast.success("Dependency added");
      setSelectedTarget("");
      setIsAddingLink(false);
      loadLinks();
      onSubmit({}); // Refresh grid without closing
    } catch (e) {
      toast.error("Failed to add dependency");
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm("Remove this dependency?")) return;
    try {
      await deleteTraceabilityLink(projectId, linkId);
      toast.success("Dependency removed");
      loadLinks();
      onSubmit({});
    } catch (e) {
      toast.error("Failed to remove dependency");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addRequirementComment(projectId, initialData.id, { content: newComment });
      setNewComment("");
      loadComments();
    } catch (e) {
      toast.error("Failed to add comment");
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status,
      tags,
      category,
      change_reason: changeReason,
    });
  };

  const isEditing = !!initialData?.id;
  const isChild = !!initialData?.parent_id;
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.id === "dependency" && isChild) return false;
    return true;
  });

  // ── Section Renderers ──────────────────────────────────

  const renderGeneral = () => (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-10"
          placeholder="Requirement title"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Describe the requirement in detail..."
          className="resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Category</Label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Functional, UX, Security"
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Tags</Label>
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 rounded-full px-2.5 py-1 text-xs font-normal">
                {tag}
                <button
                  type="button"
                  className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          className="h-10"
        />
      </div>
      {isEditing && (
        <div className="border-border space-y-1.5 border-t pt-4">
          <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Change Reason</Label>
          <Input
            placeholder="Why are you making this change?"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            className="h-10"
          />
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-3">
      {!isEditing ? (
        <div className="text-muted-foreground/60 flex flex-col items-center justify-center py-16">
          <History className="mb-3 h-12 w-12 opacity-20" />
          <p className="text-sm font-medium">History is not available yet</p>
          <p className="mt-1 text-xs">Create the requirement to track versions.</p>
        </div>
      ) : historyLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
          <History className="mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm">No version history yet</p>
        </div>
      ) : (
        history.map((h) => (
          <div
            key={h.id}
            className="group border-border bg-card hover:border-primary/30 rounded-xl border p-4 shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-primary bg-primary/10 rounded-full px-2 py-0.5 text-xs font-bold">
                      v{h.version}
                    </span>
                    <p className="line-clamp-1 text-sm font-medium">{h.title}</p>
                  </div>
                  <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-[10px] font-medium italic">
                    By {h.changer_username}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-muted-foreground text-[11px]">
                    {format(new Date(h.created_at), "MMM d, yyyy · h:mm a")}
                  </span>
                </div>
                <p className="text-muted-foreground bg-muted/30 border-border/50 mt-2 rounded-lg border p-2 text-xs italic">
                  "{h.change_reason || "No reason provided"}"
                </p>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="h-4" /> {/* Spacer for bottom padding */}
    </div>
  );

  const renderComments = () => (
    <div className="flex h-full min-h-0 flex-col">
      {!isEditing ? (
        <div className="text-muted-foreground/60 flex flex-1 flex-col items-center justify-center py-16">
          <MessageSquare className="mb-3 h-12 w-12 opacity-20" />
          <p className="text-sm font-medium">Comments are locked</p>
          <p className="mt-1 text-xs">Create the requirement to start a discussion.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {commentsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
              <MessageSquare className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">No comments yet</p>
              <p className="mt-1 text-xs opacity-60">Start a conversation below</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="group flex gap-4">
                  <div className="bg-primary/10 ring-background flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold uppercase ring-2">
                    {c.author?.profile_pic_url ? (
                      <img src={c.author.profile_pic_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      c.author?.username?.[0] || "?"
                    )}
                  </div>
                  <div className="bg-muted/30 border-border/50 flex-1 rounded-2xl rounded-tl-none border p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-foreground/90 text-xs font-bold">
                        {c.author?.display_name || c.author?.username}
                      </p>
                      <p className="text-muted-foreground text-[10px] font-medium">
                        {format(new Date(c.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTraceability = () => (
    <div className="animate-in fade-in space-y-6 duration-300">
      {!initialData?.id ? (
        <div className="text-muted-foreground/60 flex flex-1 flex-col items-center justify-center py-16">
          <LinkIcon className="mb-3 h-12 w-12 opacity-20" />
          <p className="text-sm font-medium">Dependencies are locked</p>
          <p className="mt-1 text-xs">Create the requirement to define relationships.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-amber-500" />
              <p className="text-muted-foreground text-sm font-bold tracking-wider uppercase">Dependencies (Fan-out)</p>
            </div>
            {!isAddingLink && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 hover:text-primary h-8 gap-1.5 rounded-lg text-xs transition-colors"
                onClick={() => setIsAddingLink(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            )}
          </div>

          {isAddingLink && (
            <div className="border-primary/20 bg-primary/5 animate-in slide-in-from-top-2 space-y-3 rounded-xl border p-4 duration-200">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs">This requirement depends on</Label>
                <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue placeholder="Select a requirement..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allRequirements
                      .filter((r) => r.id !== initialData.id)
                      .map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          <span className="text-muted-foreground mr-1 font-mono text-xs">{r.readable_id}</span>{" "}
                          {r.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => setIsAddingLink(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
                  onClick={handleAddLink}
                  disabled={!selectedTarget}
                >
                  Add Dependency
                </Button>
              </div>
            </div>
          )}

          {linksLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Section: Dependencies (Fan-out) */}
              <div className="space-y-2">
                {links.filter((l) => l.source_requirement_id === initialData.id).length === 0 ? (
                  <div className="border-border/50 text-muted-foreground/60 rounded-xl border border-dashed py-4 text-center text-xs italic">
                    No outgoing dependencies
                  </div>
                ) : (
                  links
                    .filter((l) => l.source_requirement_id === initialData.id)
                    .map((l) => {
                      const targetReq = allRequirements.find((r) => r.id === l.target_requirement_id);
                      return (
                        <div
                          key={l.id}
                          className="group border-border bg-card flex items-center justify-between rounded-xl border p-3 transition-all duration-200 hover:border-amber-500/30 hover:bg-amber-500/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="mb-0.5 flex items-center gap-2">
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 uppercase">
                                  Depends On
                                </span>
                                {targetReq && (
                                  <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                                    {targetReq.readable_id}
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground max-w-[250px] truncate text-[11px] font-medium">
                                {targetReq ? targetReq.title : "Requirement"}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-7 w-7 font-bold opacity-0 transition-all group-hover:opacity-100"
                            onClick={() => handleDeleteLink(l.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Section: Dependents (Fan-in) */}
              <div className="space-y-3">
                <div className="border-border flex items-center gap-2 border-t pt-4">
                  <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                  <p className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                    Dependents (Fan-in)
                  </p>
                </div>
                <div className="space-y-2">
                  {links.filter((l) => l.target_requirement_id === initialData.id).length === 0 ? (
                    <div className="border-border/50 text-muted-foreground/60 rounded-xl border border-dashed py-4 text-center text-xs italic">
                      No incoming dependents
                    </div>
                  ) : (
                    links
                      .filter((l) => l.target_requirement_id === initialData.id)
                      .map((l) => {
                        const sourceReq = allRequirements.find((r) => r.id === l.source_requirement_id);
                        return (
                          <div
                            key={l.id}
                            className="group border-border bg-card flex items-center justify-between rounded-xl border p-3 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <ArrowDownLeft className="h-3.5 w-3.5" />
                              </div>
                              <div>
                                <div className="mb-0.5 flex items-center gap-2">
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                                    Depended By
                                  </span>
                                  {sourceReq && (
                                    <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                                      {sourceReq.readable_id}
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground max-w-[250px] truncate text-[11px] font-medium">
                                  {sourceReq ? sourceReq.title : "Requirement"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const sectionRenderers = {
    general: renderGeneral,
    history: renderHistory,
    comments: renderComments,
    dependency: renderTraceability,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[820px]">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border bg-muted/20 shrink-0 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold">
                  {isEditing ? initialData.readable_id : "New Requirement"}
                </DialogTitle>
                {initialData?.parent_id && (
                  <Badge variant="secondary" className="rounded-full px-2 text-[10px]">
                    Child
                  </Badge>
                )}
              </div>
              {isEditing && (
                <span className="text-muted-foreground max-w-[300px] truncate text-sm">— {initialData.title}</span>
              )}
            </div>
          </div>

          {/* Body: Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="border-border bg-muted/10 flex w-[180px] shrink-0 flex-col gap-0.5 border-r px-2 py-3">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    } `}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="bg-background/50 flex min-h-0 min-w-0 flex-1 flex-col">
              <ScrollArea className="h-full w-full">
                <div className="p-6">{sectionRenderers[activeSection]?.()}</div>
              </ScrollArea>

              {/* Sticky Comment Input */}
              {activeSection === "comments" && isEditing && (
                <div className="border-border bg-background shrink-0 border-t px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment(e)}
                      className="bg-muted/20 h-10 rounded-xl"
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="bg-primary hover:bg-primary/90 h-10 w-10 shrink-0 rounded-xl shadow-md transition-all active:scale-95"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-border bg-muted/10 flex shrink-0 justify-end gap-2 border-t px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-9 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !description || loading}
              className="gradient-primary h-9 border-0 px-5 text-sm"
            >
              {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
