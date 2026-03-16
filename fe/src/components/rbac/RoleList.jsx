"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Key, Loader2, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRbacStore from "@/store/rbacStore";
import TablePagination from "@/components/common/TablePagination";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RoleList({ onEdit, searchQuery = "" }) {
  const { roles, fetchRoles, deleteRole, loading } = useRbacStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const pageSize = 5;

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page if search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/30">
                <TableHead className="w-[300px] text-xs font-bold uppercase">Role Name</TableHead>
                <TableHead className="text-center text-xs font-bold uppercase">Capabilities</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <TableRow
                  key={role.id}
                  className="animate-fade-in hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                       <Shield className="h-4 w-4 text-primary shrink-0" />
                       <span className="text-sm font-semibold">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {role.permissions?.length || 0} permissions
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => onEdit(role)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Role</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => setRoleToDelete(role)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Role</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoles.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Key className="h-12 w-12 mb-4" />
                      <p className="text-sm font-medium">No system roles detected.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center animate-pulse text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm font-medium">Syncing security roles...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredRoles.length}
          pageSize={pageSize}
        />
      </div>

      <ConfirmationDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        onConfirm={() => {
          handleDelete(roleToDelete.id);
          setRoleToDelete(null);
        }}
        title="Delete Role"
        description={
          <span>
            Are you sure you want to delete the role{" "}
            <span className="font-semibold text-foreground">"{roleToDelete?.name}"</span>? 
            This action cannot be undone.
          </span>
        }
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
