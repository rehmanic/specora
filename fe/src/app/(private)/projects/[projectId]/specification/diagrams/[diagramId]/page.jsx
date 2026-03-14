"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Workflow, Save, Loader2, Sparkles, Pencil, AlertCircle } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getDiagram,
    updateDiagram,
    generateDiagram,
    editDiagram,
} from "@/api/diagrams";
import mermaid from "mermaid";

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
    const renderIdRef = useRef(0);

    const debouncedCode = useDebounce(mermaidCode, 600);

    useEffect(() => {
        if (!projectId || !diagramId) return;
        let cancelled = false;
        setLoadLoading(true);
        getDiagram(projectId, diagramId)
            .then((data) => {
                if (!cancelled) {
                    setMermaidCode(data.mermaid_code ?? "");
                    setDiagramTitle(data.title ?? "");
                }
            })
            .catch(() => {
                if (!cancelled) {
                    toast.error("Diagram not found.");
                    router.push(`/projects/${projectId}/specification/diagrams`);
                }
            })
            .finally(() => {
                if (!cancelled) setLoadLoading(false);
            });
        return () => { cancelled = true; };
    }, [projectId, diagramId, router]);

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

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <div className="flex flex-col h-full min-h-0 p-6 lg:p-8 animate-fade-in">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 mt-6">
                    {/* Left: Mermaid syntax + AI below */}
                    <div className="flex flex-col min-h-0 gap-6">
                        <Card className="border-border flex flex-col flex-1 min-h-0">
                            <CardHeader className="py-3 shrink-0">
                                <CardTitle className="text-base">Mermaid code</CardTitle>
                                <CardDescription>Edit diagram syntax.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col min-h-0 pt-0 overflow-hidden">
                                {loadLoading ? (
                                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        <Input
                                            placeholder="Diagram title"
                                            value={diagramTitle}
                                            onChange={(e) => setDiagramTitle(e.target.value)}
                                            className="mb-3 font-medium shrink-0"
                                        />
                                        <Textarea
                                            value={mermaidCode}
                                            onChange={(e) => setMermaidCode(e.target.value)}
                                            placeholder="flowchart LR&#10;  A --> B"
                                            className="flex-1 min-h-0 font-mono text-sm resize-none"
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border shrink-0">
                            <CardHeader className="py-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    AI assistant
                                </CardTitle>
                                <CardDescription>
                                    Generate from description or edit the current diagram.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <Tabs defaultValue="generate" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="generate">Generate</TabsTrigger>
                                        <TabsTrigger value="edit">Edit</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="generate" className="space-y-3 pt-3">
                                        <Label htmlFor="ai-desc" className="text-sm">Describe the diagram</Label>
                                        <Textarea
                                            id="ai-desc"
                                            value={aiDescription}
                                            onChange={(e) => setAiDescription(e.target.value)}
                                            placeholder="e.g. A flowchart showing user login..."
                                            className="min-h-[72px] text-sm"
                                        />
                                        <Button
                                            onClick={handleGenerate}
                                            disabled={generateLoading || !aiDescription.trim()}
                                            size="sm"
                                        >
                                            {generateLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Sparkles className="h-4 w-4 mr-2" />
                                            )}
                                            Generate diagram
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="edit" className="space-y-3 pt-3">
                                        <Label htmlFor="edit-instr" className="text-sm">Edit instruction</Label>
                                        <Input
                                            id="edit-instr"
                                            value={editInstruction}
                                            onChange={(e) => setEditInstruction(e.target.value)}
                                            placeholder="e.g. Add a node for Admin"
                                            className="text-sm"
                                        />
                                        <Button
                                            onClick={handleEdit}
                                            disabled={editLoading || !editInstruction.trim() || !mermaidCode.trim()}
                                            size="sm"
                                        >
                                            {editLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Pencil className="h-4 w-4 mr-2" />
                                            )}
                                            Apply edit
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Preview only (full column height) */}
                    <Card className="border-border flex flex-col min-h-0 flex-1">
                        <CardHeader className="py-3 shrink-0">
                            <CardTitle className="text-base">Preview</CardTitle>
                            <CardDescription>Rendered diagram</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 pt-0 flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 min-h-0 h-full rounded-md border border-border bg-muted/30 p-4">
                                {previewError ? (
                                    <div className="flex items-center gap-2 text-destructive text-sm min-h-full">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{previewError}</span>
                                    </div>
                                ) : previewSvg ? (
                                    <div
                                        className="mermaid-preview-wrap flex items-center justify-center min-h-full w-full"
                                        dangerouslySetInnerHTML={{ __html: previewSvg }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center min-h-full text-muted-foreground text-sm">
                                        Enter Mermaid code or use AI to generate.
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
