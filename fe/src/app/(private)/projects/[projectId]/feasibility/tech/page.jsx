"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Cpu,
  Search,
  Loader2,
  ExternalLink,
  Sparkles,
  CornerDownLeft,
  Clock,
  Globe,
  Trash2,
  FileText,
  ListChecks,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "@/components/common/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PageBanner from "@/components/layout/PageBanner";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import ReactMarkdown from "react-markdown";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Source Citation Component ────────────────────────────

function SourceCard({ source, index }) {
  // Extract a clean domain from the URI for display
  let domain = source.title || "Source";
  try {
    if (source.uri) {
      const url = new URL(source.uri);
      domain = url.hostname.replace("www.", "");
    }
  } catch {
    // keep the title as-is
  }

  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 flex items-center gap-3 rounded-lg border p-3 transition-all duration-200"
    >
      <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="group-hover:text-primary truncate text-sm font-medium transition-colors">
          {source.title || domain}
        </p>
        <p className="text-muted-foreground truncate text-xs">{domain}</p>
      </div>
      <ExternalLink className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 shrink-0 transition-colors" />
    </a>
  );
}

// ─── Result Display Component ─────────────────────────────

function SearchResult({ result }) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Answer */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="text-primary h-4 w-4" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-foreground/90 mb-3 text-sm leading-relaxed last:mb-0">{children}</p>
                ),
                h1: ({ children }) => <h1 className="mt-4 mb-2 text-lg font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="mt-4 mb-2 text-base font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-3 mb-1.5 text-sm font-bold">{children}</h3>,
                ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
                li: ({ children }) => <li className="text-foreground/90 text-sm leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                code: ({ children }) => (
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted mb-3 overflow-x-auto rounded-lg p-3 text-xs">{children}</pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary underline hover:opacity-80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-primary/30 text-muted-foreground mb-3 border-l-2 pl-4 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {result.answer}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      {result.sources && result.sources.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="text-primary h-4 w-4" />
              Sources
              <Badge variant="secondary" className="ml-1 text-xs">
                {result.sources.length}
              </Badge>
            </CardTitle>
            <CardDescription>References used to ground this analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {result.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} index={idx} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consulted Resources (Google Search entry point) */}
      {result.searchEntryPoint && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="text-primary h-4 w-4" />
              Consulted Resources
            </CardTitle>
            <CardDescription>Google Search results consulted for this analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: result.searchEntryPoint }} />
          </CardContent>
        </Card>
      )}

      {/* Search queries used */}
      {result.searchQueries && result.searchQueries.length > 0 && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <Search className="h-3 w-3" />
          <span>Searched:</span>
          {result.searchQueries.map((q, idx) => (
            <Badge key={idx} variant="outline" className="text-xs font-normal">
              {q}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────

export default function Page() {
  const { projectId } = useParams();
  const { token } = useAuthStore();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [history, setHistory] = useState([]); // Array of { query, result, timestamp }
  const [requirements, setRequirements] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const inputRef = useRef(null);

  // ─── Fetch Requirements ────────────────────────────

  useEffect(() => {
    if (!projectId || !token) return;

    async function fetchRequirements() {
      try {
        const res = await fetch(`${API_BASE}/requirements/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRequirements(data.requirements || []);
        }
      } catch (error) {
        console.error("Error loading requirements:", error);
      } finally {
        setLoadingReqs(false);
      }
    }

    fetchRequirements();
  }, [projectId, token]);

  // ─── Search Handler ────────────────────────────────

  const handleSearch = async (e) => {
    e?.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("Please enter a query.");
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/tech-feasibility/search/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to perform search");
      }

      const data = await res.json();

      const entry = {
        query: trimmed,
        result: {
          answer: data.answer,
          sources: data.sources,
          groundingSupports: data.groundingSupports,
          searchQueries: data.searchQueries,
          searchEntryPoint: data.searchEntryPoint,
        },
        timestamp: new Date(),
      };

      // Add to history (newest first)
      setHistory((prev) => [entry, ...prev]);
      setSelectedEntry(entry); // Show in popup

      setQuery("");
      toast.success("Search completed!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("History cleared.");
  };

  // Pagination for requirements
  const totalPages = Math.ceil(requirements.length / pageSize);
  const paginatedReqs = requirements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ─── Render ────────────────────────────────────────

  return (
    <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <PageBanner
            title="Technical Feasibility"
            description="Research technical decisions with AI-powered web search and analysis."
            icon={Cpu}
          />

          {/* Search Input */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a technical feasibility question... e.g. 'Is WebSocket suitable for real-time collaboration at scale?'"
                    className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring max-h-[200px] min-h-[100px] w-full resize-y rounded-xl border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={searching}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <CornerDownLeft className="h-3 w-3" />
                    Press Enter to search
                  </p>
                  <Button type="submit" disabled={searching || !query.trim()} className="gap-2">
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {searching && (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          )}

          {/* Results History */}
          {history.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  Results
                  <Badge variant="secondary" className="text-xs">
                    {history.length}
                  </Badge>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-destructive gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              </div>

              {history.map((entry, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Query bubble */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                      <Search className="text-primary h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{entry.query}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{entry.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Result Preview or View Button */}
                  <div className="ml-10">
                    <div className="bg-muted/30 text-muted-foreground mb-2 line-clamp-3 rounded-lg border p-3 text-sm">
                      {entry.result.answer}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEntry(entry)} className="gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Full Analysis
                    </Button>
                  </div>

                  {/* Divider between entries */}
                  {idx < history.length - 1 && <hr className="border-border/50 my-6" />}
                </div>
              ))}
            </div>
          )}

          {/* Requirements Table */}
          <Card className="border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/30 border-border/50 border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="text-primary h-4 w-4" />
                Project Requirements
                <Badge variant="secondary" className="text-xs">
                  {requirements.length}
                </Badge>
              </CardTitle>
              <CardDescription>Select a requirement to assess its technical feasibility</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loadingReqs ? (
                <div className="space-y-4 p-8">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : requirements.length === 0 ? (
                <div className="text-muted-foreground p-8 text-center">No requirements found for this project.</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px]">Type</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead className="w-[100px] text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReqs.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <Badge variant="outline" className="px-2 py-0 text-[10px] font-normal capitalize">
                              {req.type || "Req"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[400px]">
                              <p className="truncate text-sm font-medium">{req.title}</p>
                              {req.description && (
                                <p className="text-muted-foreground truncate text-xs">{req.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setQuery(
                                  `Assess the technical feasibility of: ${req.title}${req.description ? `. ${req.description}` : ""}`
                                );
                                inputRef.current?.focus();
                                window.scrollTo({ top: 300, behavior: "smooth" });
                              }}
                              className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                            >
                              Assess
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="border-t p-4">
                    <TablePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={requirements.length}
                      pageSize={pageSize}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Result Popup */}
          <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  Technical Analysis
                </DialogTitle>
                <DialogDescription className="text-foreground font-medium">{selectedEntry?.query}</DialogDescription>
              </DialogHeader>
              {selectedEntry && (
                <div className="mt-4">
                  <SearchResult result={selectedEntry.result} />
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Empty State */}
          {!searching && history.length === 0 && (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
              <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
                <Sparkles className="text-primary h-10 w-10" />
              </div>
              <h3 className="font-display mb-2 text-xl font-semibold">Ask anything about technical feasibility</h3>
              <p className="text-muted-foreground max-w-md">
                Type your own query or click a requirement above to get AI-powered analysis backed by real-time web
                research.
              </p>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
