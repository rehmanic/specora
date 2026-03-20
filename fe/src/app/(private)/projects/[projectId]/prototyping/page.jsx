"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PenTool, Loader2, Layers, Search, Pencil, Trash2, Eye, Calendar } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import ScreenSidebar from "@/components/prototyping/ScreenSidebar";
import NewPrototypeDialog from "@/components/prototyping/NewPrototypeDialog";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getScreens, getPrototypes, createPrototype, deletePrototype as deletePrototypeApi } from "@/api/prototyping";

export default function Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [prototypes, setPrototypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prototypeName, setPrototypeName] = useState("");
  const setEntityTitle = useProjectsStore((state) => state.setEntityTitle);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 6;

  const stats = {
    total: prototypes.length,
    screens: prototypes.reduce((acc, curr) => acc + (curr.screens?.length || 0), 0),
  };

  // Filtered list
  const filtered = prototypes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ─── Fetch prototypes ─────────────────────────────
  useEffect(() => {
    if (!projectId || !token) return;

    async function fetchData() {
      try {
        const data = await getPrototypes(projectId);
        setPrototypes(data.prototypes || []);

        if (data.prototypes) {
          const setEntityTitleStore = useProjectsStore.getState().setEntityTitle;
          data.prototypes.forEach((p) => {
            if (p.id && p.name) setEntityTitleStore(p.id, p.name);
          });
        }
      } catch (err) {
        console.error("Error loading prototypes:", err);
        toast.error("Failed to load prototypes.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, token]);

  // ─── Handlers ─────────────────────────────────────

  const handleCreate = async (body) => {
    try {
      const data = await createPrototype(projectId, body);
      setPrototypes((prev) => [data.prototype, ...prev]);
      toast.success("Prototype created!");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deletePrototypeApi(itemToDelete.id);
      setPrototypes((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      toast.success("Prototype deleted.");
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpen = (prototype) => {
    router.push(`/projects/${projectId}/prototyping/${prototype.id}`);
  };

  // ─── Filtered list ────────────────────────────────
  // Handlers removed search filter from here as it's now handled with pagination above

  // ─── Render ───────────────────────────────────────
  return (
    <ProtectedRoute requiredPermissions={["view_prototypes"]}>
      <main className="w-full overflow-y-auto p-6 lg:p-8">
        <div className="animate-fade-in mx-auto max-w-6xl space-y-8">
          <PageBanner
            title="Prototyping"
            description="Create and manage wireframe prototypes for your project."
            icon={PenTool}
          />

          <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-2" style={{ animationDelay: "0.1s" }}>
            <StatsCard icon={Layers} label="Total Prototypes" value={stats.total} color="primary" />
            <StatsCard icon={Eye} label="Total Screens" value={stats.screens} color="success" />
          </div>

          {/* Toolbar */}
          <SearchCreateHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search prototypes..."
            buttonText="New Prototype"
            onAction={() => setIsCreating(true)}
          />
          <NewPrototypeDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={handleCreate} />

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
              <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
                <Layers className="text-primary h-10 w-10" />
              </div>
              <h3 className="font-display mb-2 text-xl font-semibold">
                {prototypes.length === 0 ? "No Prototypes Yet" : "No Results"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {prototypes.length === 0
                  ? "Create your first prototype to start designing wireframes for this project."
                  : "No prototypes match your search query."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-border bg-card overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[40%] md:w-[35%]">Prototype Name</TableHead>
                      <TableHead className="hidden w-[30%] md:table-cell">Description</TableHead>
                      <TableHead className="hidden sm:table-cell">Screens</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((proto) => {
                      const screenCount = proto.screens?.length || 0;
                      const updatedAt = proto.updated_at
                        ? new Date(proto.updated_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <TableRow key={proto.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Layers className="text-primary h-4 w-4 shrink-0" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="max-w-[150px] truncate md:max-w-none">{proto.name}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>{proto.name}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="text-muted-foreground line-clamp-1 text-xs">
                              {proto.description || "No description"}
                            </p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                              {screenCount} {screenCount === 1 ? "screen" : "screens"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs whitespace-nowrap">
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
                                onClick={() => handleOpen(proto)}
                                title="Open Designer"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive h-8 w-8"
                                onClick={() => setItemToDelete(proto)}
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
            title="Delete Prototype"
            description={
              <span>
                Are you sure you want to delete the prototype{" "}
                <span className="font-semibold">"{itemToDelete?.name}"</span>? This action cannot be undone and will
                remove all associated screens.
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
