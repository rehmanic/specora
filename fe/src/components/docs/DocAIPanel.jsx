"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Loader2,
  X,
  RefreshCw,
  Check,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateDoc, editDocWithAI } from "@/api/docs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Strip markdown code fences that Gemini sometimes wraps around HTML
function stripMarkdownFences(text) {
  if (!text || typeof text !== "string") return text;
  let cleaned = text.trim();
  // Remove ```html ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:html)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  return cleaned.trim();
}

const MODE_GENERATE = "generate";
const MODE_EDIT = "edit";

export default function DocAIPanel({ projectId, docId, docType, currentContent, onApply, onClose }) {
  const [mode, setMode] = useState(MODE_GENERATE);
  const [editInstructions, setEditInstructions] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const docTypeLabel = docType === "srs" ? "SRS" : "Use Case";

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedContent(null);
    setApplied(false);
    try {
      const res = await generateDoc(projectId, docId);
      setGeneratedContent(stripMarkdownFences(res.content));
      if (res.cycle_time) {
        toast.success(`Document generated in ${(res.cycle_time / 1000).toFixed(2)}s! Review and apply it below.`);
      } else {
        toast.success("Document generated! Review and apply it below.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate document.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editInstructions.trim()) {
      toast.error("Please describe what you want to change.");
      return;
    }
    setLoading(true);
    setGeneratedContent(null);
    setApplied(false);
    try {
      const res = await editDocWithAI(projectId, docId, {
        editInstructions,
        currentContent,
      });
      setGeneratedContent(stripMarkdownFences(res.content));
      if (res.cycle_time) {
        toast.success(`Edit applied by AI in ${(res.cycle_time / 1000).toFixed(2)}s! Review and accept below.`);
      } else {
        toast.success("Edit applied by AI! Review and accept below.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to apply AI edit.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedContent) return;
    onApply(generatedContent);
    setApplied(true);
    toast.success("Content applied to editor. Don't forget to save!");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border/50 bg-muted/5 flex shrink-0 items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <h3 className="text-sm font-semibold">AI Document Assistant</h3>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold tracking-wider uppercase"
          >
            {docTypeLabel}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mode tabs */}
      <div className="border-border/50 flex shrink-0 gap-1 border-b p-2">
        <button
          onClick={() => {
            setMode(MODE_GENERATE);
            setGeneratedContent(null);
            setApplied(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === MODE_GENERATE
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <Wand2 className="h-3.5 w-3.5" />
          Generate
        </button>
        <button
          onClick={() => {
            setMode(MODE_EDIT);
            setGeneratedContent(null);
            setApplied(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === MODE_EDIT
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Edit with AI
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {mode === MODE_GENERATE ? (
          <div className="space-y-3">
            <div className="border-border/50 rounded-lg border bg-amber-500/5 p-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                {docType === "use_case" ? (
                  <>
                    Gemini will analyse <strong>all project requirements</strong> and automatically pick the most important <strong>uncovered use case scenario</strong> — one that hasn&apos;t been generated in any of your other use case docs.
                  </>
                ) : (
                  <>
                    Gemini will read <strong>all project requirements</strong> and craft a complete <strong>SRS</strong> document following the standard IEEE template structure.
                  </>
                )}
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full gap-2"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wand2 className="h-3.5 w-3.5" />
              )}
              {loading ? "Generating…" : "Generate Document"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-border/50 rounded-lg border bg-blue-500/5 p-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                Describe the changes you want. Gemini will apply them to the{" "}
                <strong>current document content</strong> while maintaining the{" "}
                <strong>{docTypeLabel}</strong> template structure.
              </p>
            </div>

            <Textarea
              placeholder='e.g. "Expand section 2.2 with more detail about the admin role. Add a new section on performance requirements."'
              value={editInstructions}
              onChange={(e) => setEditInstructions(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />

            <Button
              onClick={handleEdit}
              disabled={loading || !editInstructions.trim()}
              className="w-full gap-2"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {loading ? "Applying edits…" : "Apply with AI"}
            </Button>
          </div>
        )}

        {/* Result ready — compact status card */}
        {generatedContent && (
          <div className="border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-3 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold">
                  {mode === MODE_GENERATE ? "Document generated" : "Edits applied"}
                </p>
                <p className="text-muted-foreground text-[10px]">Review before applying to editor</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={mode === MODE_GENERATE ? handleGenerate : handleEdit}
                disabled={loading}
                title="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button
              onClick={handleApply}
              disabled={applied}
              size="sm"
              className={`w-full gap-2 ${
                applied ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              {applied ? "Applied — Save to keep" : "Apply to Editor"}
            </Button>
          </div>
        )}

        {/* Full-screen preview dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 p-0">
            <DialogHeader className="border-border/50 flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText className="text-primary h-4 w-4" />
                <DialogTitle className="text-base font-semibold">Document Preview</DialogTitle>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold tracking-wider uppercase"
                >
                  {docTypeLabel}
                </Badge>
              </div>
            </DialogHeader>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto bg-white px-10 py-8 dark:bg-zinc-950">
              <div
                className="prose prose-zinc dark:prose-invert max-w-none
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-0
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                  [&_p]:text-sm [&_p]:leading-relaxed [&_p]:my-2
                  [&_ul]:text-sm [&_ul]:my-2 [&_ol]:text-sm [&_ol]:my-2
                  [&_li]:my-1
                  [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:my-4
                  [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top
                  [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:bg-muted/40
                  [&_hr]:border-border [&_hr]:my-6
                "
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </div>

            <DialogFooter className="border-border/50 flex shrink-0 items-center justify-between border-t px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={mode === MODE_GENERATE ? handleGenerate : handleEdit}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Regenerate
              </Button>
              <Button
                size="sm"
                className={`gap-2 ${applied ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
                onClick={() => { handleApply(); setShowPreview(false); }}
                disabled={applied}
              >
                <Check className="h-3.5 w-3.5" />
                {applied ? "Already Applied" : "Apply to Editor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading && (
          <div className="border-border/50 flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
            <p className="text-muted-foreground text-xs">
              {mode === MODE_GENERATE
                ? "Reading requirements and drafting your document…"
                : "Applying your edits…"}
            </p>
            <p className="text-muted-foreground/60 text-[10px]">This may take 10–20 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}
