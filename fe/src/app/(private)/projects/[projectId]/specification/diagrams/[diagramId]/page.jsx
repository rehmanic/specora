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
    Minimize2
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getDiagram,
    updateDiagram,
    generateDiagram,
    editDiagram,
    updateDiagramRequirements,
} from "@/api/diagrams";
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
        code: "graph TD\n  A[Start] --> B{Is it?}\n  B -- Yes --> C[OK]\n  B -- No --> D[Result]"
    },
    {
        name: "Sequence Diagram",
        code: "sequenceDiagram\n  Alice->>John: Hello John!\n  John-->>Alice: Hi Alice!"
    },
    {
        name: "Class Diagram",
        code: "classDiagram\n  Class01 <|-- AveryLongClass\n  Class01 : size()\n  Class01 : int chimp"
    },
    {
        name: "State Diagram",
        code: "stateDiagram-v2\n  [*] --> Still\n  Still --> [*]\n  Still --> Moving\n  Moving --> Still"
    },
    {
        name: "Entity Relationship",
        code: "erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains"
    }
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
    const setEntityTitle = useProjectsStore(state => state.setEntityTitle);
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
                    const linked = (data.requirement_links || []).map(l => l.requirement?.id || l.requirement_id);
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
        return () => { cancelled = true; };
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
            <div className="flex flex-col h-full min-h-0 p-6 lg:p-8 animate-fade-in overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold font-display">
                                {loadLoading ? "…" : diagramTitle || "Untitled diagram"}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Mermaid editor · Preview updates as you type
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Syntax Help
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Mermaid Syntax Guide</DialogTitle>
                                    <DialogDescription>
                                        Common diagram types and their syntax.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    {MERMAID_SYNTAX_EXAMPLES.map((ex) => (
                                        <div key={ex.name} className="space-y-2">
                                            <h4 className="font-semibold text-sm">{ex.name}</h4>
                                            <pre className="p-3 bg-muted rounded text-xs font-mono overflow-x-auto">
                                                {ex.code}
                                            </pre>
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
                                    <div className="pt-2 border-t text-xs text-muted-foreground">
                                        For more details, visit the <a href="https://mermaid.js.org/intro/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Mermaid documentation</a>.
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={handleSave}
                            disabled={saveLoading || loadLoading}
                        >
                            {saveLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 gap-4 mt-6 overflow-hidden min-h-0 relative">
                    {/* Left Panel: Code & AI */}
                    <div 
                        className={`flex flex-col gap-4 transition-all duration-300 ease-in-out min-h-0 ${
                            isLeftOpen ? "w-[400px] opacity-100" : "w-12 opacity-100"
                        }`}
                    >
                        {isLeftOpen ? (
                            <div className="flex flex-col flex-1 gap-4 min-h-0 overflow-hidden">
                                <Card className="border-border flex flex-col flex-1 min-h-0 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm group/card">
                                    <CardHeader className="py-2 px-4 shrink-0 flex flex-row items-center justify-between space-y-0">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-sm font-semibold">Mermaid Editor</CardTitle>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                            onClick={() => setIsLeftOpen(false)}
                                        >
                                            <PanelLeftClose className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col min-h-0 pt-0 overflow-hidden p-3">
                                        {loadLoading ? (
                                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full gap-2">
                                                <Input
                                                    placeholder="Diagram title"
                                                    value={diagramTitle}
                                                    onChange={(e) => setDiagramTitle(e.target.value)}
                                                    className="h-8 text-sm font-medium bg-muted/30 border-none focus-visible:ring-1"
                                                />
                                                <Textarea
                                                    value={mermaidCode}
                                                    onChange={(e) => setMermaidCode(e.target.value)}
                                                    placeholder="flowchart LR&#10;  A --> B"
                                                    className="flex-1 min-h-0 font-mono text-xs resize-none bg-muted/20 border-border/50 p-3 leading-relaxed"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-border shrink-0 bg-card/50 backdrop-blur-sm shadow-sm">
                                    <CardHeader className="py-2 px-4 space-y-0">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold py-1">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            AI assistant
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 p-3 pt-0">
                                        <Tabs defaultValue="generate" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2 h-8">
                                                <TabsTrigger value="generate" className="text-xs">Generate</TabsTrigger>
                                                <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="generate" className="space-y-2 pt-2">
                                                <Textarea
                                                    value={aiDescription}
                                                    onChange={(e) => setAiDescription(e.target.value)}
                                                    placeholder="e.g. A flowchart showing login..."
                                                    className="min-h-[60px] text-xs bg-muted/20"
                                                />
                                                <Button
                                                    onClick={handleGenerate}
                                                    disabled={generateLoading || !aiDescription.trim()}
                                                    size="sm"
                                                    className="w-full h-8 text-xs"
                                                >
                                                    {generateLoading ? (
                                                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                                    ) : (
                                                        <Sparkles className="h-3 w-3 mr-2" />
                                                    )}
                                                    Generate
                                                </Button>
                                            </TabsContent>
                                            <TabsContent value="edit" className="space-y-2 pt-2">
                                                <Input
                                                    value={editInstruction}
                                                    onChange={(e) => setEditInstruction(e.target.value)}
                                                    placeholder="e.g. Add a node for Admin"
                                                    className="h-8 text-xs bg-muted/20"
                                                />
                                                <Button
                                                    onClick={handleEdit}
                                                    disabled={editLoading || !editInstruction.trim() || !mermaidCode.trim()}
                                                    size="sm"
                                                    className="w-full h-8 text-xs font-medium"
                                                >
                                                    {editLoading ? (
                                                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                                    ) : (
                                                        <Pencil className="h-3 w-3 mr-2" />
                                                    )}
                                                    Apply edit
                                                </Button>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4 h-full bg-muted/10 border border-border/50 rounded-xl">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 mb-4 hover:bg-primary/10"
                                    onClick={() => setIsLeftOpen(true)}
                                >
                                    <PanelLeftOpen className="h-5 w-5 text-muted-foreground" />
                                </Button>
                                <div className="flex-1 flex items-center justify-center [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest text-[10px] font-bold text-muted-foreground/60 select-none">
                                    Editor Content
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center Panel: Preview */}
                    <div 
                        className={`flex flex-col transition-all duration-300 ease-in-out min-h-0 ${
                            isPreviewOpen ? "flex-[2]" : "w-12"
                        }`}
                    >
                        {isPreviewOpen ? (
                            <Card className="flex-1 border-border flex flex-col min-h-0 overflow-hidden bg-card/40 shadow-sm group/preview">
                                <CardHeader className="py-2 px-4 shrink-0 flex flex-row items-center justify-between space-y-0 border-b border-border/10 bg-muted/5">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                            onClick={() => setIsPreviewOpen(false)}
                                        >
                                            <Minimize2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-0 p-0 flex flex-col overflow-hidden relative border-none">
                                    {previewError ? (
                                        <div className="m-4 flex-1 rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3 text-destructive text-sm shadow-sm">
                                            <AlertCircle className="h-5 w-5 shrink-0" />
                                            <span>{previewError}</span>
                                        </div>
                                    ) : previewSvg ? (
                                        <div className="flex-1 overflow-hidden relative group flex flex-col bg-grid-white/[0.02]">
                                            <TransformWrapper
                                                initialScale={1}
                                                minScale={0.1}
                                                maxScale={4}
                                                centerOnInit
                                                centerZoomedOut
                                            >
                                                {({ zoomIn, zoomOut, resetTransform }) => (
                                                    <>
                                                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                            <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg bg-card/80 hover:bg-card border-none" onClick={() => zoomIn()}>
                                                                <ZoomIn className="h-5 w-5" />
                                                            </Button>
                                                            <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg bg-card/80 hover:bg-card border-none" onClick={() => zoomOut()}>
                                                                <ZoomOut className="h-5 w-5" />
                                                            </Button>
                                                            <Button variant="secondary" size="icon" className="h-9 w-9 shadow-lg bg-card/80 hover:bg-card border-none" onClick={() => resetTransform()}>
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
                                                                justifyContent: "center" 
                                                            }}
                                                        >
                                                            <div
                                                                className="mermaid-preview-wrap flex items-center justify-center p-8 cursor-move w-full h-full"
                                                                dangerouslySetInnerHTML={{ __html: previewSvg }}
                                                            />
                                                        </TransformComponent>
                                                    </>
                                                )}
                                            </TransformWrapper>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 space-y-3">
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
                                        filter: drop-shadow(0 0 10px rgba(0,0,0,0.2));
                                    }
                                `}</style>
                            </Card>
                        ) : (
                            <div className="flex flex-col items-center py-4 h-full bg-muted/10 border border-border/50 rounded-xl">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 mb-4 hover:bg-primary/10"
                                    onClick={() => setIsPreviewOpen(true)}
                                >
                                    <Maximize2 className="h-5 w-5 text-muted-foreground" />
                                </Button>
                                <div className="flex-1 flex items-center justify-center [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest text-[10px] font-bold text-muted-foreground/60 select-none">
                                    Diagram Preview
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Requirements */}
                    <div 
                        className={`flex flex-col transition-all duration-300 ease-in-out min-h-0 ${
                            isRightOpen ? "w-[320px] opacity-100" : "w-12 opacity-100"
                        }`}
                    >
                        {isRightOpen ? (
                            <Card className="flex-1 border-border flex flex-col min-h-0 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm group/req">
                                <CardHeader className="py-2 px-4 shrink-0 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-semibold text-primary font-display">Requirements</CardTitle>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 opacity-0 group-hover/req:opacity-100 transition-opacity"
                                        onClick={() => setIsRightOpen(false)}
                                    >
                                        <PanelRightClose className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-0 p-3 pt-0 overflow-hidden">
                                    {loadLoading ? (
                                        <div className="flex-1 flex items-center justify-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : requirements.length > 0 ? (
                                        <div className="h-full border border-border/50 rounded-lg overflow-hidden bg-muted/10">
                                            <RequirementLinker
                                                requirements={requirements}
                                                linkedIds={linkedRequirementIds}
                                                onToggle={handleToggleRequirement}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border border-dashed border-border/50 rounded-lg space-y-2 bg-muted/5">
                                            <p className="text-xs font-medium">No requirements</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col items-center py-4 h-full bg-muted/10 border border-border/50 rounded-xl">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 mb-4 hover:bg-primary/10"
                                    onClick={() => setIsRightOpen(true)}
                                >
                                    <PanelRightOpen className="h-5 w-5 text-muted-foreground" />
                                </Button>
                                <div className="flex-1 flex items-center justify-center [writing-mode:vertical-lr] text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 select-none">
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
