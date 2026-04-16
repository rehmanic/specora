"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Clipboard,
  GitBranch,
  Filter,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Loader2,
  Search,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  X,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { usePermission } from "@/hooks/usePermission";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  importRequirements,
} from "@/api/requirements";
import RequirementDialog from "@/components/requirements/RequirementDialog";
import DependencyGraph from "@/components/requirements/TraceabilityGraph";
import StatsCard from "@/components/requirements/StatsCard";
import PageBanner from "@/components/layout/PageBanner";
import { ClipboardList } from "lucide-react";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const PAGE_SIZE = 4;

// Helper: recursively flatten requirements + children for standard export
const flattenForExport = (req) => {
  const item = {
    readable_id: req.readable_id,
    title: req.title,
    description: req.description,
    priority: req.priority,
    status: req.status,
    tags: req.tags || [],
    category: req.category || null,
    fan_in: req._count?.target_links || 0,
    fan_out: req._count?.source_links || 0,
  };
  if (req.children && req.children.length > 0) {
    item.children = req.children.map(flattenForExport);
  }
  return item;
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "mid":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "low":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "pending":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "rejected":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "draft":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function Page() {
  const { projectId } = useParams();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  // Permissions
  const canCreate = usePermission("create_requirement");
  const canUpdate = usePermission("update_requirement");
  const canDelete = usePermission("delete_requirement");
  const canImport = usePermission("import_requirement");
  const canExport = usePermission("export_requirement");
  const canViewGraph = usePermission("view_requirement_graph");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [childrenDialogOpen, setChildrenDialogOpen] = useState(false);
  const [childrenParent, setChildrenParent] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importType, setImportType] = useState(null); // 'json' or 'csv'
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [importConfirmData, setImportConfirmData] = useState(null);
  const fileInputRef = useRef(null);

  const loadRequirements = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;

      const res = await getRequirements(projectId, params);
      setRequirements(res.requirements || []);
    } catch (error) {
      toast.error("Failed to load requirements");
    } finally {
      setLoading(false);
    }
  }, [projectId, search, statusFilter, priorityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequirements();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadRequirements]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);

  const stats = {
    total: requirements.length,
    approved: requirements.filter((r) => r.status === "approved").length,
    pending: requirements.filter((r) => r.status === "pending").length,
    drafts: requirements.filter((r) => r.status === "draft" || r.status === "rejected").length,
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(requirements.length / PAGE_SIZE));
  const paginatedRequirements = requirements.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ---- Export (Standard Format) ----
  const handleExport = (format) => {
    if (requirements.length === 0) {
      toast.error("No data to export");
      return;
    }

    let content = "";
    let fileName = `requirements-${projectId}-${new Date().toISOString().split("T")[0]}`;
    let type = "";

    const standardData = {
      specora_version: "1.0",
      exported_at: new Date().toISOString(),
      project_id: projectId,
      requirements: requirements.map(flattenForExport),
    };

    if (format === "json") {
      content = JSON.stringify(standardData, null, 2);
      fileName += ".json";
      type = "application/json";
    } else if (format === "csv") {
      const headers = [
        "ID",
        "Title",
        "Status",
        "Priority",
        "Description",
        "Tags",
        "Category",
        "Incoming (Fan-in)",
        "Outgoing (Fan-out)",
      ];
      const flattenCsv = (req, rows = []) => {
        rows.push([
          req.readable_id || "",
          `"${(req.title || "").replace(/"/g, '""')}"`,
          req.status,
          req.priority,
          `"${(req.description || "").replace(/"/g, '""')}"`,
          `"${(req.tags || []).join(", ")}"`,
          req.category || "",
          req._count?.target_links || 0,
          req._count?.source_links || 0,
        ]);
        if (req.children) req.children.forEach((c) => flattenCsv(c, rows));
        return rows;
      };
      const rows = [];
      requirements.forEach((r) => flattenCsv(r, rows));
      content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      fileName += ".csv";
      type = "text/csv";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  // ---- Import ----
  const handleImportClick = (type) => {
    setImportType(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so same file can be re-selected
    e.target.value = "";

    if (!file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      toast.error("Only JSON and CSV files are supported for import.");
      return;
    }

    try {
      let reqData;
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          reqData = parsed;
        } else if (parsed.requirements && Array.isArray(parsed.requirements)) {
          reqData = parsed.requirements;
        } else {
          toast.error("Invalid JSON format. Expected an array or object with 'requirements' array.");
          return;
        }
      } else {
        // CSV parsing
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (lines.length < 2) {
          toast.error("CSV file is empty or missing headers.");
          return;
        }

        const headers = lines[0]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
        reqData = lines.slice(1).map((line) => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const obj = {};
          headers.forEach((h, idx) => {
            let v = values[idx]?.trim() || "";
            v = v.replace(/^"|"$/g, "").replace(/""/g, '"'); // Cleanup quotes
            if (h === "tags") obj[h] = v ? v.split(/[;|]/).map((t) => t.trim()) : [];
            else obj[h] = v;
          });
          return obj;
        });
      }

      if (reqData.length === 0) {
        toast.error("No requirements found in the file.");
        return;
      }

      // Instead of confirm(), set state to show ConfirmationDialog
      setImportConfirmData(reqData);
    } catch (error) {
      toast.error(error.message || "Import failed");
    } finally {
      setImportLoading(false);
    }
  };

  const confirmImport = async () => {
    if (!importConfirmData) return;
    setImportLoading(true);
    try {
      const res = await importRequirements(projectId, { requirements: importConfirmData });
      toast.success(res.message || "Import successful");
      if (res.errors && res.errors.length > 0) {
        res.errors.forEach((err) => toast.warning(err));
      }
      setImportConfirmData(null);
      loadRequirements();
    } catch (error) {
      toast.error(error.message || "Import failed");
    } finally {
      setImportLoading(false);
    }
  };

  // ---- CRUD Handlers ----
  const handleAddClick = () => {
    setSelectedRequirement(null);
    setDialogOpen(true);
  };

  const handleAddChildClick = (parent) => {
    setSelectedRequirement({ parent_id: parent.id });
    setDialogOpen(true);
  };

  const handleEditClick = (req) => {
    setSelectedRequirement(req);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRequirement(projectId, itemToDelete.id);
      loadRequirements();
      toast.success("Requirement deleted");
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete requirement");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewChildren = (req) => {
    setChildrenParent(req);
    setChildrenDialogOpen(true);
  };

  const handleDialogSubmit = async (data) => {
    // If data is empty, it's a refresh request (e.g., after adding dependency/comment)
    // We should refresh the list but NOT close the dialog
    if (!data || Object.keys(data).length === 0) {
      loadRequirements();
      return;
    }

    setActionLoading(true);
    try {
      if (selectedRequirement?.id) {
        await updateRequirement(projectId, selectedRequirement.id, data);
        toast.success("Requirement updated");
      } else {
        await createRequirement(projectId, {
          ...data,
          parent_id: selectedRequirement?.parent_id,
        });
        toast.success("Requirement created");
      }
      setDialogOpen(false); // Only close on explicit submit (Create/Save Changes)
      loadRequirements();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredPermissions={["view_requirements"]}>
      <main className="h-full w-full overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8 pb-20">
          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={importType === "json" ? ".json" : importType === "csv" ? ".csv" : ".json,.csv"}
            className="hidden"
          />

          <div className="animate-fade-in flex justify-end">
            <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-0">
              {/* Import */}
              {canImport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2" disabled={importLoading}>
                      {importLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Import
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleImportClick("json")}>Import JSON</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleImportClick("csv")}>Import CSV</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Export */}
              {canExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" /> Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("json")}>As JSON</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("csv")}>As CSV</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {canViewGraph && (
                <Button variant="outline" className="gap-2" onClick={() => setGraphOpen(true)}>
                  <GitBranch className="h-4 w-4" /> Graph View
                </Button>
              )}
            </div>
          </div>
          {/* Header */}
          <PageBanner
            title="Requirements"
            description="Manage hierarchy, history, and dependencies of specifications."
            icon={ClipboardList}
            className="animate-fade-in mb-4"
          />

          {/* Stats */}
          <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
            <StatsCard icon={FileText} label="Total" value={stats.total} color="primary" />
            <StatsCard icon={CheckCircle} label="Approved" value={stats.approved} color="success" />
            <StatsCard icon={AlertTriangle} label="Pending Review" value={stats.pending} color="warning" />
            <StatsCard icon={Clipboard} label="Drafts/Others" value={stats.drafts} color="accent" />
          </div>

          {/* Filters Area */}
          <SearchCreateHeader
            searchQuery={search}
            setSearchQuery={setSearch}
            searchPlaceholder="Search requirements by ID, title, or description..."
            buttonText="Add Requirement"
            onAction={handleAddClick}
            showButton={canCreate}
          />

          {/* Table Area */}
          <div
            className="border-border bg-card animate-fade-in overflow-hidden rounded-xl border"
            style={{ animationDelay: "0.2s" }}
          >
            {loading && requirements.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : requirements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Clipboard className="mb-4 h-12 w-12" />
                <p>No requirements match your filters.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-border bg-muted/30 border-b">
                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                          ID
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                          Title
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                          Status
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                          Priority
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">
                          Incoming
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">
                          Outgoing
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRequirements.map((req) => (
                        <tr key={req.id} className="border-border/50 hover:bg-muted/20 border-b transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                              {req.readable_id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">{req.title}</span>
                              <span className="text-muted-foreground line-clamp-1 max-w-[300px] text-xs">
                                {req.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(req.status)} px-1.5 py-0 text-[10px] capitalize`}
                            >
                              {req.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(req.priority)} px-1.5 py-0 text-[10px] capitalize`}
                            >
                              {req.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                              <ArrowDownLeft className="h-3 w-3" />
                              {req._count?.target_links || 0}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                              <ArrowUpRight className="h-3 w-3" />
                              {req._count?.source_links || 0}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary h-8 w-8"
                                onClick={() => handleEditClick(req)}
                                title={canUpdate ? "Edit" : "View Details"}
                              >
                                {canUpdate ? <Edit2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                              </Button>
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                                  onClick={() => setItemToDelete(req)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                              {canCreate && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-primary h-8 w-8"
                                  onClick={() => handleAddChildClick(req)}
                                  title="Add Child"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {req.children && req.children.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-primary h-8 gap-1 text-xs"
                                  onClick={() => handleViewChildren(req)}
                                  title="View Children"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{req.children.length}</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-border bg-muted/10 flex items-center justify-between border-t px-4 py-3">
                  <p className="text-muted-foreground text-xs">
                    Showing <span className="font-semibold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-semibold">{Math.min(currentPage * PAGE_SIZE, requirements.length)}</span> of{" "}
                    <span className="font-semibold">{requirements.length}</span> results
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 text-xs ${currentPage === page ? "gradient-primary border-0" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <RequirementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleDialogSubmit}
          initialData={selectedRequirement}
          loading={actionLoading}
        />

        {graphOpen && <DependencyGraph projectId={projectId} onClose={() => setGraphOpen(false)} />}

        {/* Children Popup */}
        <Dialog open={childrenDialogOpen} onOpenChange={setChildrenDialogOpen}>
          <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[600px]">
            <div className="border-border bg-muted/20 shrink-0 border-b px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary rounded-lg p-1.5">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold">
                    Sub-requirements of <span className="text-primary">{childrenParent?.readable_id}</span>
                  </DialogTitle>
                  <p className="text-muted-foreground text-xs">
                    {childrenParent?.children?.length || 0} child requirement
                    {childrenParent?.children?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {childrenParent?.children && childrenParent.children.length > 0 ? (
                <div className="space-y-2">
                  {childrenParent.children.map((child) => (
                    <div
                      key={child.id}
                      className="group border-border bg-card hover:border-primary/30 rounded-xl border p-3.5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[11px]">
                              {child.readable_id}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(child.status)} rounded-full px-1.5 py-0 text-[10px] capitalize`}
                            >
                              {child.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(child.priority)} rounded-full px-1.5 py-0 text-[10px] capitalize`}
                            >
                              {child.priority}
                            </Badge>
                          </div>
                          <p className="truncate text-sm font-medium">{child.title}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary h-7 w-7"
                              onClick={() => {
                                setChildrenDialogOpen(false);
                                handleEditClick(child);
                              }}
                              title={canUpdate ? "Edit" : "View Details"}
                            >
                              {canUpdate ? <Edit2 className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                            </Button>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive h-7 w-7"
                              onClick={() => {
                                setChildrenDialogOpen(false);
                                setItemToDelete(child);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                  <GitBranch className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm">No sub-requirements found</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <ConfirmationDialog
          open={!!itemToDelete}
          onOpenChange={(open) => !open && setItemToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Requirement"
          description={
            <span>
              Are you sure you want to delete requirement{" "}
              <span className="text-foreground font-semibold">"{itemToDelete?.readable_id}"</span>? This action cannot
              be undone and will remove all associated links and children.
            </span>
          }
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          variant="destructive"
          loading={isDeleting}
        />

        <ConfirmationDialog
          open={!!importConfirmData}
          onOpenChange={(open) => !open && setImportConfirmData(null)}
          onConfirm={confirmImport}
          title="Import Requirements"
          description={`You are about to import ${importConfirmData?.length} requirement(s). This will add them to your current project. Continue?`}
          confirmText={importLoading ? "Importing..." : "Confirm Import"}
          loading={importLoading}
        />
      </main>
    </ProtectedRoute>
  );
}
