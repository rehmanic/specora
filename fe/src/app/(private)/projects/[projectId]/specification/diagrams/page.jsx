"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Workflow, Loader2, Search, Pencil, Trash2, Eye, Calendar } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewDiagramDialog from "@/components/diagrams/NewDiagramDialog";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { getDiagrams, createDiagram, deleteDiagram as deleteDiagramApi } from "@/api/diagrams";

export default function Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 6;

  const stats = {
    total: diagrams.length,
    designed: diagrams.filter((d) => !!d.mermaid_code?.trim()).length,
    empty: diagrams.filter((d) => !d.mermaid_code?.trim()).length,
  };

  // Filtered list
  const filtered = diagrams.filter((d) =>
    (d.title || "Untitled diagram").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        const data = await getDiagrams(projectId);
        setDiagrams(data.diagrams || []);
      } catch (err) {
        console.error("Error loading diagrams:", err);
        toast.error("Failed to load diagrams.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, token]);

  const handleCreate = async (body) => {
    try {
      const diagram = await createDiagram(projectId, body);
      setDiagrams((prev) => [diagram, ...prev]);
      toast.success("Diagram created!");
      router.push(`/projects/${projectId}/specification/diagrams/${diagram.id}`);
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDiagramApi(projectId, itemToDelete.id);
      setDiagrams((prev) => prev.filter((d) => d.id !== itemToDelete.id));
      toast.success("Diagram deleted.");
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpen = (diagram) => {
    router.push(`/projects/${projectId}/specification/diagrams/${diagram.id}`);
  };

  // Handlers removed search filter from here as it's now handled with pagination above

  return (
    <ProtectedRoute requiredPermissions={["view_diagrams"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-6xl space-y-8">
          <PageBanner
            title="Specification Diagrams"
            description="Create and manage Mermaid diagrams for system architecture and workflows."
            icon={Workflow}
          />

          <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-3" style={{ animationDelay: "0.1s" }}>
            <StatsCard icon={Workflow} label="Total Diagrams" value={stats.total} color="primary" />
            <StatsCard icon={Eye} label="Designed" value={stats.designed} color="success" />
            <StatsCard icon={Pencil} label="Empty" value={stats.empty} color="warning" />
          </div>

          {/* Toolbar */}
          <SearchCreateHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search diagrams..."
            buttonText="New Diagram"
            onAction={() => setIsCreating(true)}
          />
          <NewDiagramDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={handleCreate} />

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
              <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
                <Workflow className="text-primary h-10 w-10" />
              </div>
              <h3 className="font-display mb-2 text-xl font-semibold">
                {diagrams.length === 0 ? "No Diagrams Yet" : "No Results"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {diagrams.length === 0
                  ? "Create your first diagram to start visualizing architecture and flows with Mermaid."
                  : "No diagrams match your search query."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[40%]">Diagram Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((diagram) => {
                      const updatedAt = diagram.updated_at
                        ? new Date(diagram.updated_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—";
                      const hasContent = !!diagram.mermaid_code?.trim();

                      return (
                        <TableRow key={diagram.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Workflow className="text-primary h-4 w-4" />
                              <span>{diagram.title || "Untitled Diagram"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {hasContent ? (
                                <Badge
                                  variant="secondary"
                                  className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-500"
                                >
                                  Designed
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
                                onClick={() => handleOpen(diagram)}
                                title="Open Editor"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => setItemToDelete(diagram)}
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

      <ConfirmationDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Diagram"
        description={
          <span>
            Are you sure you want to delete the diagram{" "}
            <span className="font-semibold">"{itemToDelete?.title || "Untitled Diagram"}"</span>? This action cannot be
            undone.
          </span>
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        loading={isDeleting}
      />
    </ProtectedRoute>
  );
}
