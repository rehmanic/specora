"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ErrorBox from "@/components/common/ErrorBox";
import TablePagination from "@/components/common/TablePagination";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { FolderKanban, Mail, Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUserRequest } from "@/api/users";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
        <Users className="text-primary h-8 w-8" />
      </div>
      <h3 className="font-display mb-1 text-lg font-semibold">No users found</h3>
      <p className="text-muted-foreground max-w-xs text-sm">
        Create your first user to start managing access and permissions.
      </p>
    </div>
  );
}

export function UsersTable({ users: initialUsers = [] }) {
  const router = useRouter();

  const [users, setUsers] = useState(Array.isArray(initialUsers) ? initialUsers : []);
  const [deleteError, setDeleteError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Sync users state when initialUsers changes
  useEffect(() => {
    if (Array.isArray(initialUsers)) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (username) => {
    setUserToDelete(username);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteUserRequest(userToDelete);
      setUsers((prevUsers) => prevUsers.filter((u) => u.username !== userToDelete));
      setUserToDelete(null);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (username) => {
    router.push(`/users/update/${username}`);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "manager":
        return "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground border-primary/30";
      case "requirements_engineer":
        return "bg-violet-500/20 text-violet-600 dark:bg-violet-500/30 dark:text-violet-200 border-violet-500/30";
      case "client":
        return "bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-200 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      manager: "Manager",
      requirements_engineer: "Engineer",
      client: "Client",
    };
    return labels[role] || role;
  };

  const userBeingDeleted = users.find((u) => u.username === userToDelete);

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ConfirmationDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setUserToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        description={
          <span>
            Are you sure you want to delete{" "}
            <span className="text-foreground font-semibold">
              {userBeingDeleted?.display_name || userBeingDeleted?.username || userToDelete}
            </span>
            ? This action cannot be undone.
          </span>
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        disabled={isDeleting}
      />

      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-transparent">
                <TableHead className="w-[300px] text-xs font-bold uppercase">User</TableHead>
                <TableHead className="hidden text-xs font-bold uppercase md:table-cell">Email</TableHead>
                <TableHead className="text-xs font-bold uppercase">Role</TableHead>
                <TableHead className="text-center text-xs font-bold uppercase">Projects</TableHead>
                <TableHead className="w-[100px] text-right text-xs font-bold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="animate-fade-in hover:bg-muted/20 transition-colors"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="border-card h-10 w-10 border-2">
                        <AvatarImage
                          src={
                            user.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                          }
                          alt={user.display_name || user.username || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(user.display_name || user.username || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.display_name?.trim() || user.username?.trim() || "Unknown User"}
                        </p>
                        <p className="text-muted-foreground text-xs">@{user.username?.trim() || "unknown"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getRoleBadgeClass(user.role)} items-center gap-1 px-2 py-0.5 text-[10px]`}
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <div className="flex items-center justify-center gap-1.5 text-xs">
                      <FolderKanban className="text-muted-foreground h-3.5 w-3.5" />
                      {user.projects_count || 0}
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
                              className="text-muted-foreground hover:text-primary h-8 w-8 transition-colors"
                              onClick={() => handleEdit(user.username)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit User</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive h-8 w-8 transition-colors"
                              onClick={() => handleDelete(user.username)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete User</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={users.length}
          pageSize={pageSize}
        />
      </div>
    </>
  );
}
