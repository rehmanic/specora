"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Gavel, Loader2, Play, Eye, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageBanner from "@/components/layout/PageBanner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

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
          (Object.values(results).reduce((sum, r) => {
            const topScore = r.retrieved_context?.[0]?.score || 0;
            return sum + topScore;
          }, 0) /
            checkedCount) *
            100
        )
      : 0;

  const stats = [
    { label: "Total Requirements", value: requirements.length, icon: FileText, color: "primary" },
    { label: "Checked", value: `${checkedCount} / ${requirements.length}`, icon: Play, color: "info" },
    { label: "Feasible", value: feasibleCount, icon: CheckCircle2, color: "success" },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Gavel, color: "warning" },
  ];

  const paginatedRequirements = requirements.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(requirements.length / PAGE_SIZE);

  return (
    <ProtectedRoute requiredPermissions={["view_feasibility_studies"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <PageBanner
            title="Legal Feasibility"
            description="Assess project requirements against legal constraints and compliance regulations."
            icon={Gavel}
          />

          {/* Stats Grid */}
          {!loading && requirements.length > 0 && (
            <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
              {stats.map((stat) => (
                <StatsCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} />
              ))}
            </div>
          )}

          {/* Requirements Header */}
          <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border px-5 py-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="text-primary h-5 w-5" />
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
                <Button size="sm" className="gap-2" onClick={handleRunAll} disabled={runningAll || runningId !== null}>
                  {runningAll ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking...
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Check All
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Requirements Table */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
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
                  <div className="bg-primary/5 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <FileText className="text-muted-foreground/50 h-8 w-8" />
                  </div>
                  <h3 className="text-muted-foreground mb-1 text-lg font-medium">No Requirements Found</h3>
                  <p className="text-muted-foreground/80 text-sm">
                    Add requirements to this project to run legal feasibility checks.
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px] text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRequirements.map((req, index) => (
                        <TableRow key={req.id}>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {(currentPage - 1) * PAGE_SIZE + index + 1}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{req.title}</span>
                              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">{req.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8"
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
                                className={`h-8 w-8 ${
                                  results[req.id]
                                    ? "text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
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
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={requirements.length}
                    pageSize={PAGE_SIZE}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gavel className="text-primary h-5 w-5" />
              Feasibility Result
            </DialogTitle>
            {activeResult && <DialogDescription className="text-base">{activeResult.title}</DialogDescription>}
          </DialogHeader>

          {activeResult && (
            <div className="flex-1 space-y-4 overflow-hidden">
              {/* Verdict */}
              <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  {activeResult.is_feasible ? (
                    <Badge className="gap-1.5 border-0 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-500/25">
                      <CheckCircle2 className="h-4 w-4" /> Supporting Precedent Found
                    </Badge>
                  ) : (
                    <Badge className="gap-1.5 border-0 bg-amber-500/15 px-3 py-1 text-sm text-amber-600 hover:bg-amber-500/25">
                      <AlertTriangle className="h-4 w-4" /> Insufficient Legal Match
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm">Confidence</span>
                  <div className="font-display text-primary text-2xl font-bold">
                    {activeResult.retrieved_context?.length > 0
                      ? Math.round(activeResult.retrieved_context[0].score * 100) + "%"
                      : "0%"}
                  </div>
                </div>
              </div>

              {/* Legal Context */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Retrieved Legal Context</h4>
                <Badge variant="outline" className="text-muted-foreground text-xs">
                  {activeResult.retrieved_context?.length || 0} excerpts
                </Badge>
              </div>

              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-3">
                  {activeResult.retrieved_context?.map((ctx, idx) => (
                    <Card key={idx} className="bg-card/50 border-border/40">
                      <CardHeader className="bg-muted/20 border-border/30 border-b px-4 py-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-muted-foreground flex items-center gap-2 font-medium">
                            <span className="bg-background border-border/50 rounded border px-2 py-0.5">
                              Page {ctx.page || "N/A"}
                            </span>
                            {ctx.section && (
                              <span className="text-foreground/70 max-w-[250px] truncate">{ctx.section}</span>
                            )}
                          </div>
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            Score: {ctx.score?.toFixed(3)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 py-3">
                        <p className="text-foreground/90 line-clamp-6 text-sm leading-relaxed whitespace-pre-wrap">
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
