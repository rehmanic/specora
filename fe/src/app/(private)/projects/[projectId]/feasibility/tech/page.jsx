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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
            className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                {index + 1}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {source.title || domain}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {domain}
                </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
        </a>
    );
}

// ─── Result Display Component ─────────────────────────────

function SearchResult({ result }) {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Answer */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed text-foreground/90">{children}</p>,
                                h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1.5">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-sm leading-relaxed text-foreground/90">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>,
                                pre: ({ children }) => <pre className="p-3 rounded-lg bg-muted overflow-x-auto mb-3 text-xs">{children}</pre>,
                                a: ({ href, children }) => <a href={href} className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer">{children}</a>,
                                blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground mb-3">{children}</blockquote>,
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
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            Sources
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {result.sources.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            References used to ground this analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {result.sources.map((source, idx) => (
                                <SourceCard
                                    key={idx}
                                    source={source}
                                    index={idx}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Consulted Resources (Google Search entry point) */}
            {result.searchEntryPoint && (
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Search className="h-4 w-4 text-primary" />
                            Consulted Resources
                        </CardTitle>
                        <CardDescription>
                            Google Search results consulted for this analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="rounded-lg overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: result.searchEntryPoint }}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Search queries used */}
            {result.searchQueries && result.searchQueries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Search className="h-3 w-3" />
                    <span>Searched:</span>
                    {result.searchQueries.map((q, idx) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs font-normal"
                        >
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
    const inputRef = useRef(null);

    // ─── Fetch Requirements ────────────────────────────

    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchRequirements() {
            try {
                const res = await fetch(
                    `${API_BASE}/requirements/${projectId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
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
            const res = await fetch(
                `${API_BASE}/tech-feasibility/search/${projectId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query: trimmed }),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(
                    data.message || "Failed to perform search"
                );
            }

            const data = await res.json();

            // Add to history (newest first)
            setHistory((prev) => [
                {
                    query: trimmed,
                    result: {
                        answer: data.answer,
                        sources: data.sources,
                        groundingSupports: data.groundingSupports,
                        searchQueries: data.searchQueries,
                        searchEntryPoint: data.searchEntryPoint,
                    },
                    timestamp: new Date(),
                },
                ...prev,
            ]);

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

    // ─── Render ────────────────────────────────────────

    return (
        <ProtectedRoute
            allowedRoles={[
                "manager",
                "requirements_engineer",
                "developer",
            ]}
        >
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <Cpu className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">
                                Technical Feasibility
                            </h1>
                        </div>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Research technical decisions with AI-powered
                            web search and analysis.
                        </p>
                    </div>

                    {/* Search Input */}
                    <Card className="border-border/50 shadow-sm">
                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSearch}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <textarea
                                        ref={inputRef}
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a technical feasibility question... e.g. 'Is WebSocket suitable for real-time collaboration at scale?'"
                                        className="w-full min-h-[100px] max-h-[200px] resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={searching}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CornerDownLeft className="h-3 w-3" />
                                        Press Enter to search
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={
                                            searching ||
                                            !query.trim()
                                        }
                                        className="gap-2"
                                    >
                                        {searching ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Search className="h-4 w-4" />
                                        )}
                                        {searching
                                            ? "Searching..."
                                            : "Search"}
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
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Results
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
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
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Search className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {entry.query}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {entry.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Result */}
                                    <div className="ml-10">
                                        <SearchResult
                                            result={entry.result}
                                        />
                                    </div>

                                    {/* Divider between entries */}
                                    {idx < history.length - 1 && (
                                        <hr className="border-border/50 my-6" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Requirements Suggestions */}
                    {requirements.length > 0 && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ListChecks className="h-4 w-4 text-primary" />
                                    Project Requirements
                                    <Badge variant="secondary" className="text-xs">
                                        {requirements.length}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Click a requirement to assess its technical feasibility
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {requirements.map((req) => (
                                        <button
                                            key={req.id}
                                            onClick={() => {
                                                setQuery(
                                                    `Assess the technical feasibility of: ${req.title}${req.description ? `. ${req.description}` : ""}`
                                                );
                                                inputRef.current?.focus();
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-primary/5 transition-all text-left"
                                        >
                                            <FileText className="h-3 w-3 shrink-0" />
                                            <span className="truncate max-w-[250px]">
                                                {req.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {!searching && history.length === 0 && (
                        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <Sparkles className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold font-display mb-2">
                                Ask anything about technical feasibility
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Type your own query or click a requirement above to get AI-powered analysis backed by real-time web research.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
