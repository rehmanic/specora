"use client";

import { useState, useEffect } from "react";
import { useParams as useNextParams } from "next/navigation";
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
import {
    Loader2, Plus, MessageSquare, History, Link as LinkIcon,
    Send, RotateCcw, Trash2, Settings2, ArrowRight, ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    deleteTraceabilityLink
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
        } catch (e) { toast.error("Failed to load history"); }
        finally { setHistoryLoading(false); }
    };

    const loadComments = async () => {
        if (!initialData?.id) return;
        setCommentsLoading(true);
        try {
            const res = await getRequirementComments(projectId, initialData.id);
            setComments(res.comments || []);
        } catch (e) { toast.error("Failed to load comments"); }
        finally { setCommentsLoading(false); }
    };

    const loadLinks = async () => {
        if (!initialData?.id) return;
        setLinksLoading(true);
        try {
            const [linksRes, reqsRes] = await Promise.all([
                getTraceabilityLinks(projectId, initialData.id),
                import("@/api/requirements").then(api => api.getRequirements(projectId))
            ]);
            setLinks(linksRes.links || []);
            setAllRequirements((reqsRes.requirements || []).filter(r => r.id !== initialData.id));
        } catch (e) { toast.error("Failed to load dependencies"); }
        finally { setLinksLoading(false); }
    };



    const handleAddLink = async () => {
        if (!selectedTarget) return;

        // Prevent duplicate dependency
        const alreadyExists = links.some(l =>
            (l.source_requirement_id === initialData.id && l.target_requirement_id === selectedTarget) ||
            (l.target_requirement_id === initialData.id && l.source_requirement_id === selectedTarget)
        );

        if (alreadyExists) {
            toast.error("This dependency already exists");
            return;
        }

        try {
            await createTraceabilityLink(projectId, initialData.id, {
                target_type: 'requirement',
                target_id: selectedTarget,
                link_type: 'depends_on'
            });
            toast.success("Dependency added");
            setSelectedTarget("");
            setIsAddingLink(false);
            loadLinks();
            onSubmit({}); // Refresh grid without closing
        } catch (e) { toast.error("Failed to add dependency"); }
    };

    const handleDeleteLink = async (linkId) => {
        if (!confirm("Remove this dependency?")) return;
        try {
            await deleteTraceabilityLink(projectId, linkId);
            toast.success("Dependency removed");
            loadLinks();
            onSubmit({});
        } catch (e) { toast.error("Failed to remove dependency"); }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await addRequirementComment(projectId, initialData.id, { content: newComment });
            setNewComment("");
            loadComments();
        } catch (e) { toast.error("Failed to add comment"); }
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
            title, description, priority, status, tags, category,
            change_reason: changeReason
        });
    };

    const isEditing = !!initialData?.id;
    const isChild = !!initialData?.parent_id;
    const visibleNavItems = NAV_ITEMS.filter(item => {
        if (item.id === "dependency" && isChild) return false;
        return true;
    });

    // ── Section Renderers ──────────────────────────────────

    const renderGeneral = () => (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title <span className="text-destructive">*</span></Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="h-10" placeholder="Requirement title" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description <span className="text-destructive">*</span></Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Describe the requirement in detail..." className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {PRIORITIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Functional, UX, Security" className="h-10" />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</Label>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-normal rounded-full">
                                {tag}
                                <button type="button" className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity" onClick={() => setTags(tags.filter(t => t !== tag))}>×</button>
                            </Badge>
                        ))}
                    </div>
                )}
                <Input placeholder="Type a tag and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} className="h-10" />
            </div>
            {isEditing && (
                <div className="space-y-1.5 pt-4 border-t border-border">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Change Reason</Label>
                    <Input placeholder="Why are you making this change?" value={changeReason} onChange={(e) => setChangeReason(e.target.value)} className="h-10" />
                </div>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-3">
            {!isEditing ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/60">
                    <History className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">History is not available yet</p>
                    <p className="text-xs mt-1">Create the requirement to track versions.</p>
                </div>
            ) : historyLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <History className="h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm">No version history yet</p>
                </div>
            ) : history.map(h => (
                <div key={h.id} className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">v{h.version}</span>
                                    <p className="text-sm font-medium line-clamp-1">{h.title}</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded italic font-medium">By {h.changer_username}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-muted-foreground">{format(new Date(h.created_at), 'MMM d, yyyy · h:mm a')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg mt-2 border border-border/50 italic">"{h.change_reason || 'No reason provided'}"</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="h-4" /> {/* Spacer for bottom padding */}
        </div>
    );

    const renderComments = () => (
        <div className="flex flex-col h-full min-h-0">
            {!isEditing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground/60">
                    <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Comments are locked</p>
                    <p className="text-xs mt-1">Create the requirement to start a discussion.</p>
                </div>
            ) : (
                <div className="flex-1 space-y-4">
                    {commentsLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
                            <p className="text-sm">No comments yet</p>
                            <p className="text-xs opacity-60 mt-1">Start a conversation below</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map(c => (
                                <div key={c.id} className="flex gap-4 group">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold uppercase overflow-hidden shrink-0 ring-2 ring-background">
                                        {c.author?.profile_pic_url ? <img src={c.author.profile_pic_url} alt="" className="w-full h-full object-cover" /> : (c.author?.username?.[0] || '?')}
                                    </div>
                                    <div className="flex-1 bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border/50">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-xs font-bold text-foreground/90">{c.author?.display_name || c.author?.username}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(c.created_at), 'MMM d, h:mm a')}</p>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
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
        <div className="space-y-6 animate-in fade-in duration-300">
            {!initialData?.id ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground/60">
                    <LinkIcon className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Dependencies are locked</p>
                    <p className="text-xs mt-1">Create the requirement to define relationships.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-amber-500" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Dependencies (Fan-out)</p>
                        </div>
                        {!isAddingLink && (
                            <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5 text-xs rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => setIsAddingLink(true)}>
                                <Plus className="h-3.5 w-3.5" /> Add
                            </Button>
                        )}
                    </div>

                    {isAddingLink && (
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">This requirement depends on</Label>
                                <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                                    <SelectTrigger className="bg-background h-10">
                                        <SelectValue placeholder="Select a requirement..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allRequirements.filter(r => r.id !== initialData.id).map(r => (
                                            <SelectItem key={r.id} value={r.id}>
                                                <span className="font-mono text-xs text-muted-foreground mr-1">{r.readable_id}</span> {r.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setIsAddingLink(false)}>Cancel</Button>
                                <Button type="button" size="sm" className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddLink} disabled={!selectedTarget}>Add Dependency</Button>
                            </div>
                        </div>
                    )}

                    {linksLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <div className="space-y-6">
                            {/* Section: Dependencies (Fan-out) */}
                            <div className="space-y-2">
                                {links.filter(l => l.source_requirement_id === initialData.id).length === 0 ? (
                                    <div className="text-center py-4 rounded-xl border border-dashed border-border/50 text-muted-foreground/60 italic text-xs">
                                        No outgoing dependencies
                                    </div>
                                ) : (
                                    links.filter(l => l.source_requirement_id === initialData.id).map(l => {
                                        const targetReq = allRequirements.find(r => r.id === l.target_requirement_id);
                                        return (
                                            <div key={l.id} className="group p-3 rounded-xl border border-border flex items-center justify-between bg-card hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase">Depends On</span>
                                                            {targetReq && (
                                                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                    {targetReq.readable_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground truncate max-w-[250px] font-medium">
                                                            {targetReq ? targetReq.title : "Requirement"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all font-bold" onClick={() => handleDeleteLink(l.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Section: Dependents (Fan-in) */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-t border-border pt-4">
                                    <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Dependents (Fan-in)</p>
                                </div>
                                <div className="space-y-2">
                                    {links.filter(l => l.target_requirement_id === initialData.id).length === 0 ? (
                                        <div className="text-center py-4 rounded-xl border border-dashed border-border/50 text-muted-foreground/60 italic text-xs">
                                            No incoming dependents
                                        </div>
                                    ) : (
                                        links.filter(l => l.target_requirement_id === initialData.id).map(l => {
                                            const sourceReq = allRequirements.find(r => r.id === l.source_requirement_id);
                                            return (
                                                <div key={l.id} className="group p-3 rounded-xl border border-border flex items-center justify-between bg-card hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                                            <ArrowDownLeft className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded uppercase">Depended By</span>
                                                                {sourceReq && (
                                                                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                        {sourceReq.readable_id}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground truncate max-w-[250px] font-medium">
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
            <DialogContent className="sm:max-w-[820px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border bg-muted/20 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-lg font-bold">
                                    {isEditing ? initialData.readable_id : "New Requirement"}
                                </DialogTitle>
                                {initialData?.parent_id && (
                                    <Badge variant="secondary" className="text-[10px] rounded-full px-2">Child</Badge>
                                )}
                            </div>
                            {isEditing && (
                                <span className="text-sm text-muted-foreground truncate max-w-[300px]">— {initialData.title}</span>
                            )}
                        </div>
                    </div>

                    {/* Body: Sidebar + Content */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-[180px] shrink-0 border-r border-border bg-muted/10 py-3 px-2 flex flex-col gap-0.5">
                            {visibleNavItems.map(item => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveSection(item.id)}
                                        className={`
                                            flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left
                                            ${isActive
                                                ? "bg-primary/10 text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }
                                        `}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background/50">
                            <ScrollArea className="h-full w-full">
                                <div className="p-6">
                                    {sectionRenderers[activeSection]?.()}
                                </div>
                            </ScrollArea>

                            {/* Sticky Comment Input */}
                            {activeSection === 'comments' && isEditing && (
                                <div className="px-6 py-4 border-t border-border bg-background shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(e)}
                                            className="h-10 rounded-xl bg-muted/20"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95"
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
                    <div className="px-6 py-3 border-t border-border flex justify-end gap-2 bg-muted/10 shrink-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="h-9 px-4 text-sm">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title || !description || loading} className="h-9 px-5 text-sm gradient-primary border-0">
                            {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                            {isEditing ? "Save Changes" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
