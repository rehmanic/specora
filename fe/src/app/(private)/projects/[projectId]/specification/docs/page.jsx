"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Loader2, Search, Pencil, Trash2, Eye, Calendar, Info } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewDocDialog from "@/components/docs/NewDocDialog";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import {
    getDocs,
    createDoc,
    deleteDoc as deleteDocApi,
} from "@/api/docs";

export default function Page() {
    const { projectId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const stats = {
        total: docs.length,
        srs: docs.filter(d => d.type === 'srs').length,
        useCase: docs.filter(d => d.type === 'use_case').length,
        drafted: docs.filter(d => !!d.content?.trim()).length
    };

    // Filtered list
    const filtered = docs.filter((d) =>
        (d.title || "Untitled Doc").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchData() {
            try {
                const data = await getDocs(projectId);
                setDocs(data.docs || []);
            } catch (err) {
                console.error("Error loading docs:", err);
                toast.error("Failed to load documents.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [projectId, token]);

    const handleCreate = async (body) => {
        try {
            const doc = await createDoc(projectId, body);
            setDocs((prev) => [doc, ...prev]);
            toast.success("Document created!");
            router.push(`/projects/${projectId}/specification/docs/${doc.id}`);
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleDelete = async (docId) => {
        try {
            await deleteDocApi(projectId, docId);
            setDocs((prev) => prev.filter((d) => d.id !== docId));
            toast.success("Document deleted.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleOpen = (doc) => {
        router.push(`/projects/${projectId}/specification/docs/${doc.id}`);
    };

    // Handlers removed search filter from here as it's now handled with pagination above

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <PageBanner
                        title="Specification Documents"
                        description="Create and manage textual requirements, SRS, and use cases."
                        icon={FileText}
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <StatsCard
                            icon={FileText}
                            label="Total Docs"
                            value={stats.total}
                            color="primary"
                        />
                        <StatsCard
                            icon={Info}
                            label="SRS"
                            value={stats.srs}
                            color="info"
                        />
                        <StatsCard
                            icon={FileText}
                            label="Use Cases"
                            value={stats.useCase}
                            color="warning"
                        />
                        <StatsCard
                            icon={Pencil}
                            label="Drafted"
                            value={stats.drafted}
                            color="success"
                        />
                    </div>

                    {/* Toolbar */}
                    <SearchCreateHeader
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Search documents..."
                        buttonText="New Doc"
                        onAction={() => setIsCreating(true)}
                    />
                    <NewDocDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={handleCreate} />

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-36 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold font-display mb-2">
                                {docs.length === 0 ? "No Documents Yet" : "No Results"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                {docs.length === 0
                                    ? "Create your first document to start drafting out textual requirements."
                                    : "No documents match your search query."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30">
                                            <TableHead className="w-[40%]">Document Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginated.map((doc) => {
                                            const typeLabel = doc.type === 'srs' ? 'SRS' : doc.type === 'use_case' ? 'Use Case' : 'General';
                                            const updatedAt = doc.updated_at
                                                ? new Date(doc.updated_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "—";
                                            const hasContent = !!doc.content?.trim();

                                            return (
                                                <TableRow key={doc.id} className="hover:bg-muted/20 transition-colors">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            <span>{doc.title || "Untitled Doc"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[10px] capitalize">
                                                            {typeLabel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            {hasContent ? (
                                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                                                                    Drafted
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px]">
                                                                    Empty
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {updatedAt}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                                onClick={() => handleOpen(doc)}
                                                                title="Open Editor"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleDelete(doc.id)}
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    totalItems={filtered.length}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
