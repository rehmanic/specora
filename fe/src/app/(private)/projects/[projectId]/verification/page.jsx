"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  FileText,
  Gavel,
  List,
  Table as LucideTable,
  Shuffle,
  AlertCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  runARMVerification,
  runAIVerification,
  runARMVerificationForRequirement,
  runAIVerificationForRequirement,
} from "@/api/verification";
import { getRequirements } from "@/api/requirements";
import useAuthStore from "@/store/authStore";
import PageBanner from "@/components/layout/PageBanner";
import StatsCard from "@/components/requirements/StatsCard";
import TablePagination from "@/components/common/TablePagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Page() {
  const { projectId } = useParams();
  const { token } = useAuthStore();

  // Requirements fetch
  const [requirements, setRequirements] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);

  // ARM State
  const [armLoading, setArmLoading] = useState(false);
  const [armResults, setArmResults] = useState({});
  const [armMetrics, setArmMetrics] = useState({
    imperatives: 0,
    continuances: 0,
    directives: 0,
    options: 0,
    weakPhrases: 0,
  });
  const [runningArmReqs, setRunningArmReqs] = useState({});

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState({});

  // Dialog state for AI
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeAiResult, setActiveAiResult] = useState(null);
  const [runningAiReqs, setRunningAiReqs] = useState({});

  // Pagination
  const [armPage, setArmPage] = useState(1);
  const [aiPage, setAiPage] = useState(1);
  const PAGE_SIZE = 5;

  // Dialog state for ARM
  const [armDialogOpen, setArmDialogOpen] = useState(false);
  const [activeArmResult, setActiveArmResult] = useState(null);

  useEffect(() => {
    async function fetchRequirements() {
      setReqLoading(true);
      try {
        const res = await getRequirements(projectId, { flat: true });
        setRequirements(res.requirements || []);
      } catch (error) {
        console.error("Error fetching requirements:", error);
        toast.error("Could not load requirements.");
      } finally {
        setReqLoading(false);
      }
    }
    if (projectId) fetchRequirements();
  }, [projectId]);

  const handleRunARM = async () => {
    if (requirements.length === 0) {
      toast.info("No requirements available to verify.");
      return;
    }
    setArmLoading(true);
    try {
      const res = await runARMVerification(projectId);
      const resMap = {};
      res.results.forEach((r) => (resMap[r.requirement_id] = r.analysis));
      setArmResults(resMap);
      setArmMetrics(res.metrics);
      toast.success("Specora ARM verification completed!");
    } catch (error) {
      toast.error(error.message || "Failed to run ARM verification.");
    } finally {
      setArmLoading(false);
    }
  };

  const handleRunSingleARM = async (req) => {
    setRunningArmReqs((prev) => ({ ...prev, [req.id]: true }));
    try {
      const res = await runARMVerificationForRequirement(projectId, req.id);
      setArmResults((prev) => {
        const newRes = { ...prev, [req.id]: res.result.analysis };

        // Recalculate metrics based on all currently known results
        const newMetrics = Object.values(newRes).reduce(
          (acc, curr) => {
            acc.imperatives += curr.imperatives || 0;
            acc.continuances += curr.continuances || 0;
            acc.directives += curr.directives || 0;
            acc.options += curr.options || 0;
            acc.weakPhrases += curr.weakPhrases || 0;
            return acc;
          },
          { imperatives: 0, continuances: 0, directives: 0, options: 0, weakPhrases: 0 }
        );
        setArmMetrics(newMetrics);

        return newRes;
      });
      toast.success(`Specora ARM updated for: ${req.title}`);
    } catch (error) {
      toast.error(error.message || `Failed to run ARM on ${req.title}.`);
    } finally {
      setRunningArmReqs((prev) => ({ ...prev, [req.id]: false }));
    }
  };

  const handleRunAI = async () => {
    if (requirements.length === 0) {
      toast.info("No requirements available to analyze.");
      return;
    }
    setAiLoading(true);
    toast.info(`Running AI analysis for ${requirements.length} requirements...`);
    try {
      const res = await runAIVerification(projectId);
      const resMap = {};
      res.results.forEach((r) => (resMap[r.requirement_id] = r.analysis));
      setAiResults(resMap);
      toast.success("AI Analysis completed!");
    } catch (error) {
      toast.error(error.message || "Failed to run AI verification.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunSingleAI = async (req) => {
    setRunningAiReqs((prev) => ({ ...prev, [req.id]: true }));
    try {
      const res = await runAIVerificationForRequirement(projectId, req.id);
      setAiResults((prev) => ({ ...prev, [req.id]: res.result.analysis }));
      toast.success(`AI Analysis completed for: ${req.title}`);
    } catch (error) {
      toast.error(error.message || `Failed to run AI on ${req.title}.`);
    } finally {
      setRunningAiReqs((prev) => ({ ...prev, [req.id]: false }));
    }
  };

  const handleViewAIResult = (req) => {
    const result = aiResults[req.id];
    if (!result) {
      toast.info("Run the AI check first to see results.");
      return;
    }
    setActiveAiResult({ ...result, title: req.title, description: req.description });
    setDialogOpen(true);
  };

  const handleViewARMResult = (req) => {
    const result = armResults[req.id];
    if (!result) {
      toast.info("Run the Specora ARM check first to see results.");
      return;
    }
    setActiveArmResult({ ...result, title: req.title, description: req.description });
    setArmDialogOpen(true);
  };

  const renderBooleanIcon = (value) => {
    if (value === true) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (value === false) return <AlertTriangle className="text-destructive h-4 w-4" />;
    return <span className="text-muted-foreground">-</span>;
  };

  const getAiScore = (analysis) => {
    if (!analysis) return 0;
    const keys = ["unambiguous", "complete", "verifiable", "consistent", "modifiable", "traceable"];
    const passed = keys.filter((k) => analysis[k] === true).length;
    return Math.round((passed / keys.length) * 100);
  };

  const aiCheckedCount = Object.keys(aiResults).length;
  const aiAvgScore =
    aiCheckedCount > 0
      ? Math.round(Object.values(aiResults).reduce((sum, r) => sum + getAiScore(r), 0) / aiCheckedCount)
      : 0;

  const armCheckedCount = Object.keys(armResults).length;

  const paginatedArmReqs = requirements.slice((armPage - 1) * PAGE_SIZE, armPage * PAGE_SIZE);
  const totalArmPages = Math.ceil(requirements.length / PAGE_SIZE);

  const paginatedAiReqs = requirements.slice((aiPage - 1) * PAGE_SIZE, aiPage * PAGE_SIZE);
  const totalAiPages = Math.ceil(requirements.length / PAGE_SIZE);

  return (
    <ProtectedRoute requiredPermissions={["view_verification_results"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-6xl space-y-8">
          <PageBanner
            title="Verification"
            description="Evaluate project requirements against writing guidelines and IEEE standards."
            icon={ShieldCheck}
          />

          <Tabs defaultValue="arm" orientation="vertical" className="flex flex-col gap-6 md:flex-row">
            <div className="flex min-w-[240px] flex-col gap-4 md:sticky md:top-24">
              <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 rounded-xl border p-1">
                <TabsTrigger
                  value="arm"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
                >
                  <FileText className="h-4 w-4" />
                  Specora ARM
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  IEEE AI Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              {/* SPECora ARM TAB */}
              <TabsContent value="arm" className="space-y-6">
                {!reqLoading && requirements.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                    <StatsCard icon={Gavel} label="Imperatives" value={armMetrics.imperatives} color="primary" />
                    <StatsCard icon={List} label="Continuances" value={armMetrics.continuances} color="info" />
                    <StatsCard icon={LucideTable} label="Directives" value={armMetrics.directives} color="primary" />
                    <StatsCard icon={Shuffle} label="Options" value={armMetrics.options} color="warning" />
                    <StatsCard icon={AlertCircle} label="Weak Phrases" value={armMetrics.weakPhrases} color="error" />
                  </div>
                )}

                <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border px-5 py-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="text-primary h-5 w-5" />
                      Automated Requirements Measurement
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Analyze requirements text for standard classical metric indicators.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-muted-foreground">
                      {requirements.length} total
                    </Badge>
                    {requirements.length > 0 && (
                      <Button size="sm" className="gap-2" onClick={handleRunARM} disabled={armLoading || reqLoading}>
                        {armLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" /> Analyze All
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-0">
                    {reqLoading ? (
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
                          Add requirements to this project to run ARM checks.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-[80px]">ID</TableHead>
                              <TableHead>Requirement</TableHead>
                              <TableHead className="w-[120px] text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedArmReqs.map((req, index) => (
                              <TableRow key={req.id}>
                                <TableCell className="text-muted-foreground font-mono text-xs">
                                  {(armPage - 1) * PAGE_SIZE + index + 1}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{req.title}</span>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <p className="text-muted-foreground mt-0.5 cursor-pointer text-sm">
                                            {req.description?.split(" ").slice(0, 10).join(" ")}
                                            {req.description?.split(" ").length > 10 ? "..." : ""}
                                          </p>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">{req.description}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`text-primary hover:text-primary hover:bg-primary/10 h-8 w-8`}
                                      onClick={() => handleRunSingleARM(req)}
                                      disabled={runningArmReqs[req.id]}
                                      title="Run ARM for this requirement"
                                    >
                                      {runningArmReqs[req.id] ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-8 w-8 ${
                                        armResults[req.id]
                                          ? "text-primary hover:text-primary hover:bg-primary/10"
                                          : "text-muted-foreground hover:text-foreground"
                                      }`}
                                      onClick={() => handleViewARMResult(req)}
                                      disabled={!armResults[req.id]}
                                      title="View analysis result"
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
                          currentPage={armPage}
                          totalPages={totalArmPages}
                          onPageChange={setArmPage}
                          totalItems={requirements.length}
                          pageSize={PAGE_SIZE}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Analysis TAB */}
              <TabsContent value="ai" className="space-y-6">
                {!reqLoading && requirements.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatsCard icon={FileText} label="Total Requirements" value={requirements.length} color="primary" />
                    <StatsCard
                      icon={Play}
                      label="Checked"
                      value={`${aiCheckedCount} / ${requirements.length}`}
                      color="info"
                    />
                    <StatsCard
                      icon={ShieldCheck}
                      label="Avg IEEE Compliance"
                      value={`${aiAvgScore}%`}
                      color={aiAvgScore > 80 ? "success" : "warning"}
                    />
                  </div>
                )}

                <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border px-5 py-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ShieldCheck className="text-primary h-5 w-5" />
                      IEEE Quality Analysis
                    </CardTitle>
                    <CardDescription className="mt-1">
                      SpecBot analyzes requirement completeness, consistency, and verifiability.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-muted-foreground">
                      {requirements.length} total
                    </Badge>
                    {requirements.length > 0 && (
                      <Button
                        size="sm"
                        className="gradient-primary gap-2 border-0"
                        onClick={handleRunAI}
                        disabled={aiLoading || reqLoading}
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying...
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" /> Verify All
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-0">
                    {reqLoading ? (
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
                          <ShieldCheck className="text-muted-foreground/50 h-8 w-8" />
                        </div>
                        <h3 className="text-muted-foreground mb-1 text-lg font-medium">No Requirements Found</h3>
                        <p className="text-muted-foreground/80 text-sm">
                          Add requirements to this project to perform AI analysis.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-[80px]">ID</TableHead>
                              <TableHead>Requirement</TableHead>
                              <TableHead className="w-[120px] text-center">Score</TableHead>
                              <TableHead className="w-[120px] text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedAiReqs.map((req, index) => {
                              const res = aiResults[req.id];
                              const score = getAiScore(res);
                              return (
                                <TableRow key={req.id}>
                                  <TableCell className="text-muted-foreground font-mono text-xs">
                                    {(aiPage - 1) * PAGE_SIZE + index + 1}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{req.title}</span>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <p className="text-muted-foreground mt-0.5 cursor-pointer text-sm">
                                              {req.description?.split(" ").slice(0, 10).join(" ")}
                                              {req.description?.split(" ").length > 10 ? "..." : ""}
                                            </p>
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-xs">{req.description}</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {res ? (
                                      <span
                                        className={
                                          score === 100 ? "font-medium text-emerald-500" : "font-medium text-amber-500"
                                        }
                                      >
                                        {score}%
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`text-primary hover:text-primary hover:bg-primary/10 h-8 w-8`}
                                        onClick={() => handleRunSingleAI(req)}
                                        disabled={runningAiReqs[req.id]}
                                        title="Run AI specifically for this requirement"
                                      >
                                        {runningAiReqs[req.id] ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Play className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 ${
                                          res
                                            ? "text-primary hover:text-primary hover:bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        onClick={() => handleViewAIResult(req)}
                                        disabled={!res}
                                        title="View AI detailed feedback"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        <TablePagination
                          currentPage={aiPage}
                          totalPages={totalAiPages}
                          onPageChange={setAiPage}
                          totalItems={requirements.length}
                          pageSize={PAGE_SIZE}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* ARM Result Dialog */}
      <Dialog open={armDialogOpen} onOpenChange={setArmDialogOpen}>
        <DialogContent className="flex max-w-xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-primary h-5 w-5" />
              ARM Metric Details
            </DialogTitle>
            {activeArmResult && (
              <DialogDescription className="text-foreground mt-2 text-base font-medium">
                {activeArmResult.title}
              </DialogDescription>
            )}
          </DialogHeader>

          {activeArmResult && (
            <div className="space-y-4">
              <p className="text-muted-foreground bg-muted/30 border-border/50 rounded-md border p-3 text-sm">
                {activeArmResult.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="border-border/50 bg-card flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">Imperatives (shall, must...)</span>
                  <Badge variant="secondary">{activeArmResult.imperatives}</Badge>
                </div>
                <div className="border-border/50 bg-card flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">Continuances</span>
                  <Badge variant="secondary">{activeArmResult.continuances}</Badge>
                </div>
                <div className="border-border/50 bg-card flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">Directives</span>
                  <Badge variant="secondary">{activeArmResult.directives}</Badge>
                </div>
                <div className="border-border/50 bg-card flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium">Options (can, may)</span>
                  <Badge variant={activeArmResult.options > 0 ? "warning" : "secondary"}>
                    {activeArmResult.options}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-between rounded-md border border-red-500/20 bg-red-500/5 p-3">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Weak Phrases (TBD, easy...)
                  </span>
                  <Badge variant={activeArmResult.weakPhrases > 0 ? "destructive" : "secondary"}>
                    {activeArmResult.weakPhrases}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="text-primary h-5 w-5" />
              IEEE Characteristics Report
            </DialogTitle>
            {activeAiResult && (
              <DialogDescription className="text-foreground mt-2 text-base font-medium">
                {activeAiResult.title}
              </DialogDescription>
            )}
          </DialogHeader>

          {activeAiResult && (
            <div className="flex-1 space-y-4 overflow-hidden">
              {/* Verdict */}
              <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  {getAiScore(activeAiResult) === 100 ? (
                    <Badge className="gap-1.5 border-0 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-500/25">
                      <CheckCircle2 className="h-4 w-4" /> Perfect Compliance
                    </Badge>
                  ) : (
                    <Badge className="gap-1.5 border-0 bg-amber-500/15 px-3 py-1 text-sm text-amber-600 hover:bg-amber-500/25">
                      <AlertTriangle className="h-4 w-4" /> Needs Improvement
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm">Compliance Score</span>
                  <div className="font-display text-primary text-2xl font-bold">{getAiScore(activeAiResult)}%</div>
                </div>
              </div>

              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  <div className="text-muted-foreground bg-muted/20 border-border/40 rounded border p-3 text-sm">
                    <div className="text-foreground mb-1 font-semibold">Requirement Text:</div>
                    {activeAiResult.description}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {["unambiguous", "complete", "verifiable", "consistent", "modifiable", "traceable"].map((chk) => (
                      <div
                        key={chk}
                        className="bg-card border-border/50 flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="text-sm font-medium capitalize">{chk}</span>
                        {renderBooleanIcon(activeAiResult[chk])}
                      </div>
                    ))}
                  </div>

                  <Card className="bg-card/50 border-border/40">
                    <CardHeader className="bg-muted/20 border-border/30 border-b px-4 py-2">
                      <div className="text-sm font-medium">AI Reasoning Feedback</div>
                    </CardHeader>
                    <CardContent className="px-4 py-3">
                      <div className="space-y-3">
                        {(activeAiResult.reasoning || "No reasoning context was provided.")
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, idx) => {
                            const colonIndex = line.indexOf(":");
                            if (colonIndex === -1)
                              return (
                                <p key={idx} className="text-foreground/90 text-sm">
                                  {line}
                                </p>
                              );
                            const label = line.substring(0, colonIndex).trim();
                            const text = line.substring(colonIndex + 1).trim();
                            return (
                              <div key={idx} className="border-primary/20 border-l-2 py-0.5 pl-3 text-sm">
                                <span className="text-primary/80 mr-1 font-semibold">{label}</span>
                                <p className="text-foreground/90 mt-0.5">{text}</p>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
