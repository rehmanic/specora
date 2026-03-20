"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, ShieldCheck, Users, FileText, Layout, BarChart, CheckCircle, MessageSquare, Lock, } from "lucide-react";
import { cn } from "@/lib/utils";
import useRbacStore from "@/store/rbacStore";

export function RoleDialog({ role, open, onOpenChange }) {
  const { createRole, updateRole, permissions, fetchPermissions, assignPermission, removePermission } = useRbacStore();

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPermissions();
      if (role) {
        setName(role.name);
        setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
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
    if (lower.includes("elicitation") || lower.includes("chat") || lower.includes("feedback"))
      return <MessageSquare className="h-4 w-4" />;
    if (lower.includes("prototyping")) return <Layout className="h-4 w-4" />;
    if (lower.includes("feasibility") || lower.includes("analysis")) return <BarChart className="h-4 w-4" />;
    if (lower.includes("diagram") || lower.includes("documentation")) return <FileText className="h-4 w-4" />;
    if (lower.includes("verification")) return <CheckCircle className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
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

        const originalPermissions = role.permissions?.map((p) => p.id) || [];
        const toAdd = selectedPermissions.filter((id) => !originalPermissions.includes(id));
        for (const pId of toAdd) {
          await assignPermission(roleId, pId);
        }

        const toRemove = originalPermissions.filter((id) => !selectedPermissions.includes(id));
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
      <DialogContent className="animate-in zoom-in-95 overflow-hidden border-none p-0 shadow-2xl duration-200 sm:max-w-[700px]">
        <div className="from-primary/5 bg-gradient-to-br to-transparent p-6 pb-4">
          <DialogHeader className="space-y-1">
            <div className="text-primary mb-1 flex items-center gap-2">
              <Shield className="fill-primary/10 h-5 w-5" />
              <span className="text-xs font-bold tracking-wider uppercase">Access Control</span>
            </div>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">
              {role ? "Edit System Role" : "Create New Role"}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Define the identity and granular capabilities for this role.
            </p>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
              Role Identity
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior Architect"
              className="bg-muted/30 border-muted focus:ring-primary/20 h-11 px-4 text-lg font-medium transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Capabilities</Label>
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium tracking-tighter uppercase">
                {selectedPermissions.length} Active
              </span>
            </div>

            <ScrollArea className="bg-muted/10 -mr-4 h-[400px] rounded-xl border pr-4">
              <Accordion type="multiple" className="w-full px-1">
                {Object.entries(categorizedPermissions).map(([category, perms]) => {
                  const activeInCategory = perms.filter((p) => selectedPermissions.includes(p.id)).length;
                  return (
                    <AccordionItem key={category} value={category} className="mt-1 border-none first:mt-0">
                      <AccordionTrigger className="hover:bg-muted/50 group rounded-lg px-3 py-2.5 transition-all hover:no-underline">
                        <div className="flex w-full items-center justify-between pr-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-background border-border text-muted-foreground group-data-[state=open]:text-primary group-data-[state=open]:border-primary/30 group-data-[state=open]:bg-primary/5 rounded-md border p-1.5 transition-colors">
                              {getCategoryIcon(category)}
                            </div>
                            <span className="text-sm font-semibold tracking-tight capitalize">{category}</span>
                          </div>
                          {activeInCategory > 0 && (
                            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums">
                              {activeInCategory}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-primary/10 ml-6 space-y-4 border-l-2 px-10 py-3 pb-4">
                        {perms.map((p) => {
                          const isSelected = selectedPermissions.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => handleTogglePermission(p.id)}
                              className={cn(
                                "group/perm flex cursor-pointer items-start gap-4 rounded-xl border p-3 transition-all duration-200 select-none",
                                isSelected
                                  ? "bg-primary/5 border-primary/30 shadow-sm"
                                  : "hover:bg-muted/50 border-transparent bg-transparent"
                              )}
                            >
                              <Checkbox
                                id={`p-${p.id}`}
                                checked={isSelected}
                                onCheckedChange={() => handleTogglePermission(p.id)}
                                onClick={(e) => e.stopPropagation()} // Prevent double toggle
                                className="border-muted data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-5 w-5 rounded-md transition-colors"
                              />
                              <div className="grid flex-1 gap-1.5">
                                <label
                                  htmlFor={`p-${p.id}`}
                                  className={cn(
                                    "group-hover/perm:text-primary cursor-pointer text-sm leading-none font-semibold transition-colors",
                                    isSelected ? "text-primary" : "text-foreground"
                                  )}
                                  onClick={(e) => e.stopPropagation()} // Prevent double toggle
                                >
                                  {p.label || p.name}
                                </label>
                                {p.description && (
                                  <p className="text-muted-foreground line-clamp-2 text-[11px] leading-relaxed">
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
                <div className="flex h-full flex-col items-center justify-center py-10 text-center opacity-40">
                  <ShieldCheck className="mb-2 h-10 w-10" />
                  <p className="text-xs font-medium">No system capabilities detected</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="bg-muted/30 border-border/50 gap-2 border-t p-4 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="hover:bg-background font-medium transition-all"
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="gradient-primary shadow-primary/20 hover:shadow-primary/30 border-0 px-8 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="border-background h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                <span>Syncing...</span>
              </div>
            ) : role ? (
              "Update Role"
            ) : (
              "Confirm Creation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
