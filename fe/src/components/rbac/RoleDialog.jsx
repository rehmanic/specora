"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  ShieldCheck,
  Users,
  FileText,
  Layout,
  BarChart,
  CheckCircle,
  MessageSquare,
  Lock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import useRbacStore from "@/store/rbacStore";

export function RoleDialog({ role, open, onOpenChange }) {
  const {
    createRole,
    updateRole,
    permissions,
    fetchPermissions,
    assignPermission,
    removePermission
  } = useRbacStore();

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPermissions();
      if (role) {
        setName(role.name);
        setSelectedPermissions(role.permissions?.map(p => p.id) || []);
      } else {
        setName("");
        setSelectedPermissions([]);
      }
    }
  }, [open, role, fetchPermissions]);

  // Categorize permissions: group by the 'module' field from the API
  const categorizedPermissions = permissions.reduce((acc, p) => {
    const category = p.module || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(p);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes("user") || lower.includes("profile")) return <Users className="h-4 w-4" />;
    if (lower.includes("project")) return <Layout className="h-4 w-4" />;
    if (lower.includes("requirement")) return <FileText className="h-4 w-4" />;
    if (lower.includes("elicitation") || lower.includes("chat") || lower.includes("feedback")) return <MessageSquare className="h-4 w-4" />;
    if (lower.includes("prototyping")) return <Layout className="h-4 w-4" />;
    if (lower.includes("feasibility") || lower.includes("analysis")) return <BarChart className="h-4 w-4" />;
    if (lower.includes("diagram") || lower.includes("documentation")) return <FileText className="h-4 w-4" />;
    if (lower.includes("verification")) return <CheckCircle className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      let roleId;
      if (role) {
        await updateRole(role.id, name);
        roleId = role.id;

        const originalPermissions = role.permissions?.map(p => p.id) || [];
        const toAdd = selectedPermissions.filter(id => !originalPermissions.includes(id));
        for (const pId of toAdd) {
          await assignPermission(roleId, pId);
        }

        const toRemove = originalPermissions.filter(id => !selectedPermissions.includes(id));
        for (const pId of toRemove) {
          await removePermission(roleId, pId);
        }
      } else {
        await createRole(name, selectedPermissions);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 pb-4">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Shield className="h-5 w-5 fill-primary/10" />
              <span className="text-xs font-bold uppercase tracking-wider">Access Control</span>
            </div>
            <DialogTitle className="text-2xl font-bold font-display tracking-tight">
              {role ? "Edit System Role" : "Create New Role"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Define the identity and granular capabilities for this role.
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
              Role Identity
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior Architect"
              className="bg-muted/30 border-muted focus:ring-primary/20 transition-all text-lg font-medium px-4 h-11"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Capabilities</Label>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium uppercase tracking-tighter">
                {selectedPermissions.length} Active
              </span>
            </div>

            <ScrollArea className="h-[400px] pr-4 -mr-4 border rounded-xl bg-muted/10">
              <Accordion type="multiple" className="w-full px-1">
                {Object.entries(categorizedPermissions).map(([category, perms]) => {
                  const activeInCategory = perms.filter(p => selectedPermissions.includes(p.id)).length;
                  return (
                    <AccordionItem key={category} value={category} className="border-none mt-1 first:mt-0">
                      <AccordionTrigger className="py-2.5 hover:no-underline px-3 hover:bg-muted/50 rounded-lg transition-all group">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-background border border-border rounded-md text-muted-foreground group-data-[state=open]:text-primary group-data-[state=open]:border-primary/30 group-data-[state=open]:bg-primary/5 transition-colors">
                              {getCategoryIcon(category)}
                            </div>
                            <span className="capitalize text-sm font-semibold tracking-tight">{category}</span>
                          </div>
                          {activeInCategory > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tabular-nums">
                              {activeInCategory}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-10 py-3 pb-4 border-l-2 border-primary/10 ml-6 space-y-4">
                      {perms.map((p) => {
                        const isSelected = selectedPermissions.includes(p.id);
                        return (
                          <div 
                            key={p.id} 
                            onClick={() => handleTogglePermission(p.id)}
                            className={cn(
                              "flex items-start gap-4 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none group/perm",
                              isSelected 
                                ? "bg-primary/5 border-primary/30 shadow-sm" 
                                : "bg-transparent border-transparent hover:bg-muted/50"
                            )}
                          >
                            <Checkbox
                              id={`p-${p.id}`}
                              checked={isSelected}
                              onCheckedChange={() => handleTogglePermission(p.id)}
                              onClick={(e) => e.stopPropagation()} // Prevent double toggle
                              className="h-5 w-5 mt-0.5 rounded-md border-muted transition-colors data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <div className="grid gap-1.5 flex-1">
                              <label
                                htmlFor={`p-${p.id}`}
                                className={cn(
                                  "text-sm font-semibold leading-none cursor-pointer group-hover/perm:text-primary transition-colors",
                                  isSelected ? "text-primary" : "text-foreground"
                                )}
                                onClick={(e) => e.stopPropagation()} // Prevent double toggle
                              >
                                {p.label || p.name}
                              </label>
                              {p.description && (
                                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                                  {p.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
              </Accordion>
              {permissions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center opacity-40">
                  <ShieldCheck className="h-10 w-10 mb-2" />
                  <p className="text-xs font-medium">No system capabilities detected</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="bg-muted/30 p-4 border-t border-border/50 gap-2 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={saving}
            className="hover:bg-background transition-all font-medium"
          >
            Discard
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || !name.trim()}
            className="gradient-primary border-0 px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                <span>Syncing...</span>
              </div>
            ) : (
              role ? "Update Role" : "Confirm Creation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
