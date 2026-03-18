"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Sparkles,
  Pencil,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Columns2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDiagram, updateDiagram, generateDiagram, editDiagram, updateDiagramRequirements } from "@/api/diagrams";
import { getRequirements } from "@/api/requirements";
import mermaid from "mermaid";
import useProjectsStore from "@/store/projectsStore";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import RequirementLinker from "@/components/prototyping/RequirementLinker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MERMAID_SYNTAX_EXAMPLES = [
  {
    name: "Flowchart",
    code: "graph TD\n  A[Start] --> B{Is it?}\n  B -- Yes --> C[OK]\n  B -- No --> D[Result]",
  },
  {
    name: "Sequence Diagram",
    code: "sequenceDiagram\n  Alice->>John: Hello John!\n  John-->>Alice: Hi Alice!",
  },
  {
    name: "Class Diagram",
    code: "classDiagram\n  Class01 <|-- AveryLongClass\n  Class01 : size()\n  Class01 : int chimp",
  },
  {
    name: "State Diagram",
    code: "stateDiagram-v2\n  [*] --> Still\n  Still --> [*]\n  Still --> Moving\n  Moving --> Still",
  },
  {
    name: "Entity Relationship",
    code: "erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains",
  },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

export default function DiagramEditorPage() {
  const { projectId, diagramId } = useParams();
  const router = useRouter();
  const [mermaidCode, setMermaidCode] = useState("");
  const [diagramTitle, setDiagramTitle] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [previewSvg, setPreviewSvg] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [editInstruction, setEditInstruction] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [linkedRequirementIds, setLinkedRequirementIds] = useState([]);
  const setEntityTitle = useProjectsStore((state) => state.setEntityTitle);
  const renderIdRef = useRef(0);

  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const debouncedCode = useDebounce(mermaidCode, 600);

  useEffect(() => {
    if (!projectId || !diagramId) return;
    let cancelled = false;
    setLoadLoading(true);

    const loadData = async () => {
      try {
        const data = await getDiagram(projectId, diagramId);
        if (!cancelled) {
          setMermaidCode(data.mermaid_code ?? "");
          setDiagramTitle(data.title ?? "");
          setEntityTitle(diagramId, data.title ?? "Diagram");
          const linked = (data.requirement_links || []).map((l) => l.requirement?.id || l.requirement_id);
          setLinkedRequirementIds(linked);
        }

        const reqData = await getRequirements(projectId);
        if (!cancelled) {
          setRequirements(reqData.requirements || []);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error("Error loading diagram data.");
          router.push(`/projects/${projectId}/specification/diagrams`);
        }
      } finally {
        if (!cancelled) setLoadLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [projectId, diagramId, router, setEntityTitle]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#8b5cf6",
        primaryTextColor: "#1e1b4b",
        primaryBorderColor: "#6d28d9",
        lineColor: "#6d28d9",
        secondaryColor: "#e9d5ff",
        tertiaryColor: "#f5f3ff",
      },
      securityLevel: "loose",
    });
  }, []);

  const renderPreview = useCallback(async (code) => {
    if (!code?.trim()) {
      setPreviewSvg("");
      setPreviewError("");
      return;
    }
    const id = `mermaid-preview-${++renderIdRef.current}`;
    setPreviewError("");
    try {
      const { svg } = await mermaid.render(id, code);
      setPreviewSvg(svg);
    } catch (err) {
      setPreviewError(err?.message || "Invalid Mermaid syntax");
      setPreviewSvg("");
    }
  }, []);

  useEffect(() => {
    renderPreview(debouncedCode);
  }, [debouncedCode, renderPreview]);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await updateDiagram(projectId, diagramId, {
        mermaid_code: mermaidCode,
        title: diagramTitle || undefined,
      });
      setEntityTitle(diagramId, diagramTitle);
      toast.success("Diagram saved.");
    } catch (err) {
      toast.error(err.message || "Failed to save diagram.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!aiDescription.trim()) {
      toast.info("Enter a description first.");
      return;
    }
    setGenerateLoading(true);
    try {
      const { mermaid_code } = await generateDiagram(projectId, {
        description: aiDescription.trim(),
      });
      setMermaidCode(mermaid_code || "");
      setAiDescription("");
      toast.success("Diagram generated.");
    } catch (err) {
      toast.error(err.message || "Failed to generate diagram.");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editInstruction.trim()) {
      toast.info("Enter an edit instruction first.");
      return;
    }
    if (!mermaidCode.trim()) {
      toast.info("Add or generate a diagram first.");
      return;
    }
    setEditLoading(true);
    try {
      const { mermaid_code } = await editDiagram(projectId, {
        current_mermaid_code: mermaidCode,
        edit_instruction: editInstruction.trim(),
      });
      setMermaidCode(mermaid_code || "");
      setEditInstruction("");
      toast.success("Diagram updated.");
    } catch (err) {
      toast.error(err.message || "Failed to apply edit.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleRequirement = async (reqId) => {
    const newIds = linkedRequirementIds.includes(reqId)
      ? linkedRequirementIds.filter((id) => id !== reqId)
      : [...linkedRequirementIds, reqId];

    setLinkedRequirementIds(newIds);
    try {
      await updateDiagramRequirements(projectId, diagramId, newIds);
    } catch (err) {
      toast.error("Failed to update requirement links.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
      <div className="animate-fade-in flex h-full min-h-0 flex-col overflow-hidden p-6 lg:p-8">
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold">
                {loadLoading ? "…" : diagramTitle || "Untitled diagram"}
              </h1>
              <p className="text-muted-foreground text-sm">Mermaid editor · Preview updates as you type</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Syntax Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Mermaid Syntax Guide</DialogTitle>
                  <DialogDescription>Common diagram types and their syntax.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {MERMAID_SYNTAX_EXAMPLES.map((ex) => (
                    <div key={ex.name} className="space-y-2">
                      <h4 className="text-sm font-semibold">{ex.name}</h4>
                      <pre className="bg-muted overflow-x-auto rounded p-3 font-mono text-xs">{ex.code}</pre>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setMermaidCode(ex.code);
                          toast.success(`${ex.name} template applied!`);
                        }}
                      >
                        Use this template
                      </Button>
                    </div>
                  ))}
                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    For more details, visit the{" "}
                    <a
                      href="https://mermaid.js.org/intro/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Mermaid documentation
                    </a>
                    .
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={saveLoading || loadLoading}>
              {saveLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>

        <div className="relative mt-6 flex min-h-0 flex-1 gap-4 overflow-hidden">
          {/* Left Panel: Code & AI */}
          <div
            className={`flex min-h-0 flex-col gap-4 transition-all duration-300 ease-in-out ${
              isLeftOpen ? "w-[400px] opacity-100" : "w-12 opacity-100"
            }`}
          >
            {isLeftOpen ? (
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                <Card className="border-border bg-card/50 group/card flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm backdrop-blur-sm">
                  <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">Mermaid Editor</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover/card:opacity-100"
                      onClick={() => setIsLeftOpen(false)}
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 pt-0">
                    {loadLoading ? (
                      <div className="text-muted-foreground flex flex-1 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex h-full flex-col gap-2">
                        <Input
                          placeholder="Diagram title"
                          value={diagramTitle}
                          onChange={(e) => setDiagramTitle(e.target.value)}
                          className="bg-muted/30 h-8 border-none text-sm font-medium focus-visible:ring-1"
                        />
                        <Textarea
                          value={mermaidCode}
                          onChange={(e) => setMermaidCode(e.target.value)}
                          placeholder="flowchart LR&#10;  A --> B"
                          className="bg-muted/20 border-border/50 min-h-0 flex-1 resize-none p-3 font-mono text-xs leading-relaxed"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 shrink-0 shadow-sm backdrop-blur-sm">
                  <CardHeader className="space-y-0 px-4 py-2">
                    <CardTitle className="flex items-center gap-2 py-1 text-sm font-semibold">
                      <Sparkles className="text-primary h-4 w-4" />
                      AI assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 pt-0">
                    <Tabs defaultValue="generate" className="w-full">
                      <TabsList className="grid h-8 w-full grid-cols-2">
                        <TabsTrigger value="generate" className="text-xs">
                          Generate
                        </TabsTrigger>
                        <TabsTrigger value="edit" className="text-xs">
                          Edit
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="generate" className="space-y-2 pt-2">
                        <Textarea
                          value={aiDescription}
                          onChange={(e) => setAiDescription(e.target.value)}
                          placeholder="e.g. A flowchart showing login..."
                          className="bg-muted/20 min-h-[60px] text-xs"
                        />
                        <Button
                          onClick={handleGenerate}
                          disabled={generateLoading || !aiDescription.trim()}
                          size="sm"
                          className="h-8 w-full text-xs"
                        >
                          {generateLoading ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-3 w-3" />
                          )}
                          Generate
                        </Button>
                      </TabsContent>
                      <TabsContent value="edit" className="space-y-2 pt-2">
                        <Input
                          value={editInstruction}
                          onChange={(e) => setEditInstruction(e.target.value)}
                          placeholder="e.g. Add a node for Admin"
                          className="bg-muted/20 h-8 text-xs"
                        />
                        <Button
                          onClick={handleEdit}
                          disabled={editLoading || !editInstruction.trim() || !mermaidCode.trim()}
                          size="sm"
                          className="h-8 w-full text-xs font-medium"
                        >
                          {editLoading ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : (
                            <Pencil className="mr-2 h-3 w-3" />
                          )}
                          Apply edit
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="bg-muted/10 border-border/50 flex h-full flex-col items-center rounded-xl border py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 mb-4 h-8 w-8"
                  onClick={() => setIsLeftOpen(true)}
                >
                  <PanelLeftOpen className="text-muted-foreground h-5 w-5" />
                </Button>
                <div className="text-muted-foreground/60 flex flex-1 rotate-180 items-center justify-center text-[10px] font-bold tracking-widest uppercase select-none [writing-mode:vertical-lr]">
                  Editor Content
                </div>
              </div>
            )}
          </div>

          {/* Center Panel: Preview */}
          <div
            className={`flex min-h-0 flex-col transition-all duration-300 ease-in-out ${
              isPreviewOpen ? "flex-[2]" : "w-12"
            }`}
          >
            {isPreviewOpen ? (
              <Card className="border-border bg-card/40 group/preview flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm">
                <CardHeader className="border-border/10 bg-muted/5 flex shrink-0 flex-row items-center justify-between space-y-0 border-b px-4 py-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover/preview:opacity-100"
                      onClick={() => setIsPreviewOpen(false)}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-none p-0">
                  {previewError ? (
                    <div className="border-destructive/20 bg-destructive/5 text-destructive m-4 flex flex-1 items-center gap-3 rounded-lg border p-4 text-sm shadow-sm">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{previewError}</span>
                    </div>
                  ) : previewSvg ? (
                    <div className="group bg-grid-white/[0.02] relative flex flex-1 flex-col overflow-hidden">
                      <TransformWrapper initialScale={1} minScale={0.1} maxScale={4} centerOnInit centerZoomedOut>
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <>
                            <div className="absolute top-4 right-4 z-10 flex scale-95 flex-col gap-2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-card/80 hover:bg-card h-9 w-9 border-none shadow-lg"
                                onClick={() => zoomIn()}
                              >
                                <ZoomIn className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-card/80 hover:bg-card h-9 w-9 border-none shadow-lg"
                                onClick={() => zoomOut()}
                              >
                                <ZoomOut className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="bg-card/80 hover:bg-card h-9 w-9 border-none shadow-lg"
                                onClick={() => resetTransform()}
                              >
                                <RefreshCw className="h-5 w-5" />
                              </Button>
                            </div>
                            <TransformComponent
                              wrapperStyle={{ width: "100%", height: "100%" }}
                              contentStyle={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                className="mermaid-preview-wrap flex h-full w-full cursor-move items-center justify-center p-8"
                                dangerouslySetInnerHTML={{ __html: previewSvg }}
                              />
                            </TransformComponent>
                          </>
                        )}
                      </TransformWrapper>
                    </div>
                  ) : (
                    <div className="text-muted-foreground bg-muted/5 flex flex-1 flex-col items-center justify-center space-y-3">
                      <Columns2 className="h-10 w-10 opacity-20" />
                      <p className="text-sm font-medium opacity-60">No diagram to display</p>
                    </div>
                  )}
                </CardContent>
                <style jsx global>{`
                  .mermaid-preview-wrap svg {
                    max-width: 100% !important;
                    max-height: 100% !important;
                    height: auto !important;
                    width: auto !important;
                    display: block;
                    margin: auto;
                    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
                  }
                `}</style>
              </Card>
            ) : (
              <div className="bg-muted/10 border-border/50 flex h-full flex-col items-center rounded-xl border py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 mb-4 h-8 w-8"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Maximize2 className="text-muted-foreground h-5 w-5" />
                </Button>
                <div className="text-muted-foreground/60 flex flex-1 rotate-180 items-center justify-center text-[10px] font-bold tracking-widest uppercase select-none [writing-mode:vertical-lr]">
                  Diagram Preview
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Requirements */}
          <div
            className={`flex min-h-0 flex-col transition-all duration-300 ease-in-out ${
              isRightOpen ? "w-[320px] opacity-100" : "w-12 opacity-100"
            }`}
          >
            {isRightOpen ? (
              <Card className="border-border bg-card/50 group/req flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm backdrop-blur-sm">
                <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 px-4 py-2">
                  <CardTitle className="text-primary font-display text-sm font-semibold">Requirements</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover/req:opacity-100"
                    onClick={() => setIsRightOpen(false)}
                  >
                    <PanelRightClose className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden p-3 pt-0">
                  {loadLoading ? (
                    <div className="flex h-full flex-1 items-center justify-center">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  ) : requirements.length > 0 ? (
                    <div className="border-border/50 bg-muted/10 h-full overflow-hidden rounded-lg border">
                      <RequirementLinker
                        requirements={requirements}
                        linkedIds={linkedRequirementIds}
                        onToggle={handleToggleRequirement}
                      />
                    </div>
                  ) : (
                    <div className="text-muted-foreground border-border/50 bg-muted/5 flex h-full flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-6 text-center">
                      <p className="text-xs font-medium">No requirements</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="bg-muted/10 border-border/50 flex h-full flex-col items-center rounded-xl border py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 mb-4 h-8 w-8"
                  onClick={() => setIsRightOpen(true)}
                >
                  <PanelRightOpen className="text-muted-foreground h-5 w-5" />
                </Button>
                <div className="text-muted-foreground/60 flex flex-1 items-center justify-center text-[10px] font-bold tracking-widest uppercase select-none [writing-mode:vertical-lr]">
                  Traceability
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
