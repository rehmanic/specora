"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRbacStore from "@/store/rbacStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function RoleList({ onEdit, searchQuery = "" }) {
  const { roles, fetchRoles, deleteRole, loading } = useRbacStore();

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Name
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr 
                key={role.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-4 font-semibold text-sm text-foreground">
                  {role.name}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the role "{role.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(role.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRoles.length === 0 && !loading && (
              <tr>
                <td colSpan={2} className="text-center py-20 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <Key className="h-12 w-12 mb-4" />
                    <p className="text-sm font-medium">No roles detected in the system.</p>
                  </div>
                </td>
              </tr>
            )}
            {loading && (
               <tr>
                 <td colSpan={2} className="text-center py-20">
                   <div className="flex flex-col items-center justify-center animate-pulse text-muted-foreground">
                     <p className="text-sm font-medium">Syncing roles...</p>
                   </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
