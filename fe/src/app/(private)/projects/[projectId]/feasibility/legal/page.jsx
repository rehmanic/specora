"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Gavel, Loader2, Play, Eye, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const NORMA_URL = "http://localhost:8000/api/v1/feasibility/legal/single";

export default function Page() {
    const { projectId } = useParams();
    const { token } = useAuthStore();

    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Track which requirement is currently being checked (by id)
    const [runningId, setRunningId] = useState(null);
    const [runningAll, setRunningAll] = useState(false);

    // Store results keyed by requirement id
    const [results, setResults] = useState({});

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeResult, setActiveResult] = useState(null);

    // Fetch requirements from the backend
    useEffect(() => {
        async function fetchRequirements() {
            try {
                const res = await fetch(`${API_BASE}/requirements/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch requirements");
                const data = await res.json();
                setRequirements(data.requirements || []);
            } catch (error) {
                console.error("Error fetching requirements:", error);
                toast.error("Could not load requirements.");
            } finally {
                setLoading(false);
            }
        }
        if (projectId && token) fetchRequirements();
    }, [projectId, token]);

    // Run feasibility check for a single requirement
    const handleRun = async (req) => {
        setRunningId(req.id);
        try {
            const response = await fetch(NORMA_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: req.id,
                    title: req.title,
                    description: req.description,
                }),
            });

            if (!response.ok) throw new Error("Norma service error");

            const data = await response.json();
            setResults((prev) => ({ ...prev, [req.id]: data }));

            if (data.is_feasible) {
                toast.success(`"${req.title}" — Relevant legal context found.`);
            } else {
                toast.warning(`"${req.title}" — No strong legal match.`);
            }
        } catch (error) {
            console.error("Error running feasibility:", error);
            toast.error("Could not reach Norma. Is the service running?");
        } finally {
            setRunningId(null);
        }
    };

    // Run all unchecked requirements sequentially
    const handleRunAll = async () => {
        const unchecked = requirements.filter((r) => !results[r.id]);
        if (unchecked.length === 0) {
            toast.info("All requirements have already been checked.");
            return;
        }
        setRunningAll(true);
        toast.info(`Running ${unchecked.length} checks...`);
        for (const req of unchecked) {
            await handleRun(req);
        }
        setRunningAll(false);
        toast.success("All checks completed!");
    };

    // Open result dialog
    const handleViewResult = (req) => {
        const result = results[req.id];
        if (!result) {
            toast.info("Run the check first to see results.");
            return;
        }
        setActiveResult({ ...result, title: req.title });
        setDialogOpen(true);
    };

    // Computed stats
    const checkedCount = Object.keys(results).length;
    const feasibleCount = Object.values(results).filter((r) => r.is_feasible).length;
    const avgConfidence =
        checkedCount > 0
            ? Math.round(
                Object.values(results).reduce((sum, r) => {
                    const topScore = r.retrieved_context?.[0]?.score || 0;
                    return sum + topScore;
                }, 0) /
                checkedCount *
                100
            )
            : 0;

    const stats = [
        { label: "Total Requirements", value: requirements.length, icon: FileText, color: "text-primary" },
        { label: "Checked", value: `${checkedCount} / ${requirements.length}`, icon: Play, color: "text-blue-500" },
        { label: "Feasible", value: feasibleCount, icon: CheckCircle2, color: "text-emerald-500" },
        { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Gavel, color: "text-amber-500" },
    ];

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <Gavel className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">Legal Feasibility</h1>
                        </div>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Assess project requirements against legal constraints and compliance regulations.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    {!loading && requirements.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <Card key={stat.label} className="border-border/50 shadow-sm">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                            <p className="text-2xl font-bold font-display">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Requirements Table */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Project Requirements
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Run legal feasibility checks on individual requirements by clicking the play button.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-muted-foreground">
                                        {requirements.length} total
                                    </Badge>
                                    {requirements.length > 0 && (
                                        <Button
                                            size="sm"
                                            className="gap-2"
                                            onClick={handleRunAll}
                                            disabled={runningAll || runningId !== null}
                                        >
                                            {runningAll ? (
                                                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking...</>
                                            ) : (
                                                <><Play className="h-3.5 w-3.5" /> Check All</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Skeleton className="h-4 w-8" />
                                            <Skeleton className="h-4 flex-1" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : requirements.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-lg font-medium text-muted-foreground mb-1">No Requirements Found</h3>
                                    <p className="text-sm text-muted-foreground/80">
                                        Add requirements to this project to run legal feasibility checks.
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="w-[120px] text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requirements.map((req, index) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span className="font-medium">{req.title}</span>
                                                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                                            {req.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                                            onClick={() => handleRun(req)}
                                                            disabled={runningId === req.id}
                                                            title="Run feasibility check"
                                                        >
                                                            {runningId === req.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Play className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 ${results[req.id]
                                                                ? "text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10"
                                                                : "text-muted-foreground hover:text-foreground"
                                                                }`}
                                                            onClick={() => handleViewResult(req)}
                                                            disabled={!results[req.id]}
                                                            title="View result"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Result Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Gavel className="h-5 w-5 text-primary" />
                            Feasibility Result
                        </DialogTitle>
                        {activeResult && (
                            <DialogDescription className="text-base">
                                {activeResult.title}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {activeResult && (
                        <div className="space-y-4 overflow-hidden flex-1">
                            {/* Verdict */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-2">
                                    {activeResult.is_feasible ? (
                                        <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 px-3 py-1 text-sm gap-1.5 border-0">
                                            <CheckCircle2 className="h-4 w-4" /> Supporting Precedent Found
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 px-3 py-1 text-sm gap-1.5 border-0">
                                            <AlertTriangle className="h-4 w-4" /> Insufficient Legal Match
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground">Confidence</span>
                                    <div className="text-2xl font-bold font-display text-primary">
                                        {activeResult.retrieved_context?.length > 0
                                            ? Math.round(activeResult.retrieved_context[0].score * 100) + "%"
                                            : "0%"}
                                    </div>
                                </div>
                            </div>

                            {/* Legal Context */}
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Retrieved Legal Context</h4>
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                    {activeResult.retrieved_context?.length || 0} excerpts
                                </Badge>
                            </div>

                            <ScrollArea className="h-[350px] pr-4">
                                <div className="space-y-3">
                                    {activeResult.retrieved_context?.map((ctx, idx) => (
                                        <Card key={idx} className="bg-card/50 border-border/40">
                                            <CardHeader className="py-2 px-4 bg-muted/20 border-b border-border/30">
                                                <div className="flex justify-between items-center text-xs">
                                                    <div className="font-medium text-muted-foreground flex items-center gap-2">
                                                        <span className="bg-background px-2 py-0.5 rounded border border-border/50">
                                                            Page {ctx.page || "N/A"}
                                                        </span>
                                                        {ctx.section && (
                                                            <span className="text-foreground/70 truncate max-w-[250px]">
                                                                {ctx.section}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="text-[10px] font-mono">
                                                        Score: {ctx.score?.toFixed(3)}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="py-3 px-4">
                                                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap line-clamp-6">
                                                    {ctx.text}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ProtectedRoute>
    );
}
