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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const PAGE_SIZE = 5;

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [childrenDialogOpen, setChildrenDialogOpen] = useState(false);
  const [childrenParent, setChildrenParent] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importType, setImportType] = useState(null); // 'json' or 'csv'
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
    drafts: requirements.filter(
      (r) => r.status === "draft" || r.status === "rejected"
    ).length,
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(requirements.length / PAGE_SIZE));
  const paginatedRequirements = requirements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
      content = [headers.join(","), ...rows.map((row) => row.join(","))].join(
        "\n"
      );
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
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) {
          toast.error("CSV file is empty or missing headers.");
          return;
        }

        const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        reqData = lines.slice(1).map(line => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const obj = {};
          headers.forEach((h, idx) => {
            let v = values[idx]?.trim() || "";
            v = v.replace(/^"|"$/g, '').replace(/""/g, '"'); // Cleanup quotes
            if (h === "tags") obj[h] = v ? v.split(/[;|]/).map(t => t.trim()) : [];
            else obj[h] = v;
          });
          return obj;
        });
      }

      if (reqData.length === 0) {
        toast.error("No requirements found in the file.");
        return;
      }

      // Confirm import
      if (!confirm(`You are about to import ${reqData.length} requirement(s). Continue?`)) return;

      setImportLoading(true);
      const res = await importRequirements(projectId, { requirements: reqData });
      toast.success(res.message || "Import successful");
      if (res.errors && res.errors.length > 0) {
        res.errors.forEach((err) => toast.warning(err));
      }
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

  const handleDeleteClick = async (reqId) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;

    setActionLoading(true);
    try {
      await deleteRequirement(projectId, reqId);
      loadRequirements();
      toast.success("Requirement deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete requirement");
    } finally {
      setActionLoading(false);
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
    <ProtectedRoute>
      <main className="w-full p-6 lg:p-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={importType === 'json' ? '.json' : importType === 'csv' ? '.csv' : '.json,.csv'}
            className="hidden"
          />

          {/* Header */}
          <div
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in"
          >
            <div>
              <h1 className="text-3xl font-bold font-display">Requirements</h1>
              <p className="text-muted-foreground mt-1">
                Manage hierarchy, history, and dependencies of specifications.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Import */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2"
                    disabled={importLoading}
                  >
                    {importLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleImportClick("json")}>
                    Import JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImportClick("csv")}>
                    Import CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    As JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    As CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setGraphOpen(true)}
              >
                <GitBranch className="h-4 w-4" /> Graph View
              </Button>
              <Button
                onClick={handleAddClick}
                className="gap-2 gradient-primary border-0"
              >
                <Plus className="h-4 w-4" />
                Add Requirement
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <StatsCard
              icon={FileText}
              label="Total"
              value={stats.total}
              color="primary"
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved"
              value={stats.approved}
              color="success"
            />
            <StatsCard
              icon={AlertTriangle}
              label="Pending Review"
              value={stats.pending}
              color="warning"
            />
            <StatsCard
              icon={Clipboard}
              label="Drafts/Others"
              value={stats.drafts}
              color="accent"
            />
          </div>

          {/* Filters Area */}
          <div
            className="flex flex-col md:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requirements by ID, title, or description..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="mid">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Area */}
          <div
            className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {loading && requirements.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requirements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <Clipboard className="h-12 w-12 mb-4" />
                <p>No requirements match your filters.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Title
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Incoming
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Outgoing
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRequirements.map((req) => (
                        <tr
                          key={req.id}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {req.readable_id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">
                                {req.title}
                              </span>
                              <span className="text-muted-foreground text-xs line-clamp-1 max-w-[300px]">
                                {req.description}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(req.status)} text-[10px] px-1.5 py-0 capitalize`}
                            >
                              {req.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(req.priority)} text-[10px] px-1.5 py-0 capitalize`}
                            >
                              {req.priority}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mx-auto border border-blue-100">
                              <ArrowDownLeft className="h-3 w-3" />
                              {req._count?.target_links || 0}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit mx-auto border border-amber-100">
                              <ArrowUpRight className="h-3 w-3" />
                              {req._count?.source_links || 0}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleEditClick(req)}
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteClick(req.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleAddChildClick(req)}
                                title="Add Child"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              {req.children && req.children.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 gap-1 text-muted-foreground hover:text-primary text-xs"
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
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
                  <p className="text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold">
                      {(currentPage - 1) * PAGE_SIZE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {Math.min(currentPage * PAGE_SIZE, requirements.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{requirements.length}</span>{" "}
                    results
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={
                            currentPage === page ? "default" : "outline"
                          }
                          size="icon"
                          className={`h-8 w-8 text-xs ${currentPage === page ? "gradient-primary border-0" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
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

        {graphOpen && (
          <DependencyGraph
            projectId={projectId}
            onClose={() => setGraphOpen(false)}
          />
        )}

        {/* Children Popup */}
        <Dialog open={childrenDialogOpen} onOpenChange={setChildrenDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold">
                    Sub-requirements of{" "}
                    <span className="text-primary">{childrenParent?.readable_id}</span>
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    {childrenParent?.children?.length || 0} child requirement{childrenParent?.children?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {childrenParent?.children && childrenParent.children.length > 0 ? (
                <div className="space-y-2">
                  {childrenParent.children.map((child) => (
                    <div
                      key={child.id}
                      className="group p-3.5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {child.readable_id}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(child.status)} text-[10px] px-1.5 py-0 capitalize rounded-full`}
                            >
                              {child.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${getPriorityColor(child.priority)} text-[10px] px-1.5 py-0 capitalize rounded-full`}
                            >
                              {child.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">{child.title}</p>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setChildrenDialogOpen(false);
                              handleEditClick(child);
                            }}
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setChildrenDialogOpen(false);
                              handleDeleteClick(child.id);
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <GitBranch className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No sub-requirements found</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </ProtectedRoute>
  );
}
