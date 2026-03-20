"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Loader2, Search, Pencil, Trash2, Eye, Calendar, Info } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewDocDialog from "@/components/docs/NewDocDialog";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { getDocs, createDoc, deleteDoc as deleteDocApi } from "@/api/docs";

export default function Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 6;

  const stats = {
    total: docs.length,
    srs: docs.filter((d) => d.type === "srs").length,
    useCase: docs.filter((d) => d.type === "use_case").length,
    general: docs.filter((d) => d.type === "general").length,
  };

  // Filtered list
  const filtered = docs.filter((d) => (d.title || "Untitled Doc").toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocApi(projectId, itemToDelete.id);
      setDocs((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      toast.success("Document deleted.");
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpen = (doc) => {
    router.push(`/projects/${projectId}/specification/docs/${doc.id}`);
  };

  // Handlers removed search filter from here as it's now handled with pagination above

  return (
    <ProtectedRoute requiredPermissions={["view_documents"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-6xl space-y-8">
          <PageBanner
            title="Specification Documents"
            description="Create and manage textual requirements, SRS, and use cases."
            icon={FileText}
          />

          <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
            <StatsCard icon={FileText} label="Total Docs" value={stats.total} color="primary" />
            <StatsCard icon={Info} label="SRS" value={stats.srs} color="info" />
            <StatsCard icon={FileText} label="Use Cases" value={stats.useCase} color="warning" />
            <StatsCard icon={Info} label="General Notes" value={stats.general} color="success" />
          </div>

          {/* Toolbar */}
          <SearchCreateHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search documents..."
            buttonText="New Doc"
            onAction={() => setIsCreating(true)}
          />
          <NewDocDialog
            open={isCreating}
            onOpenChange={setIsCreating}
            onSubmit={handleCreate}
            srsExists={docs.some((d) => d.type === "srs")}
          />

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
              <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
                <FileText className="text-primary h-10 w-10" />
              </div>
              <h3 className="font-display mb-2 text-xl font-semibold">
                {docs.length === 0 ? "No Documents Yet" : "No Results"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {docs.length === 0
                  ? "Create your first document to start drafting out textual requirements."
                  : "No documents match your search query."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-border bg-card overflow-hidden rounded-xl border">
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
                      const typeLabel = doc.type === "srs" ? "SRS" : doc.type === "use_case" ? "Use Case" : "General";
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
                              <FileText className="text-primary h-4 w-4" />
                              <span>{doc.title || "Untitled Doc"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {typeLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              {hasContent ? (
                                <Badge
                                  variant="secondary"
                                  className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-500"
                                >
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
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <Calendar className="h-3.5 w-3.5" />
                              {updatedAt}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary h-8 w-8"
                                onClick={() => handleOpen(doc)}
                                title="Open Editor"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => setItemToDelete(doc)}
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
          <ConfirmationDialog
            open={!!itemToDelete}
            onOpenChange={(open) => !open && setItemToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Document"
            description={
              <span>
                Are you sure you want to delete the document{" "}
                <span className="font-semibold">"{itemToDelete?.title || "Untitled Doc"}"</span>? This action cannot be
                undone.
              </span>
            }
            confirmText={isDeleting ? "Deleting..." : "Delete"}
            variant="destructive"
            loading={isDeleting}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
