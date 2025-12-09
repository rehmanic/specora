"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Pencil, Trash2, Shield, Mail } from "lucide-react";
import { deleteUserRequest } from "@/api/users";
import { useRouter } from "next/navigation";
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
import ErrorBox from "@/components/common/ErrorBox";

export function UsersTable({ users: initialUsers = [] }) {
  const router = useRouter();

  const [users, setUsers] = useState(
    Array.isArray(initialUsers) ? initialUsers : []
  );
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "manager":
        return "default";
      case "requirements_engineer":
        return "secondary";
      case "client":
        return "outline";
      default:
        return "secondary";
    }
  };

  const userBeingDeleted = users.find((u) => u.username === userToDelete);

  return (
    <Card className="overflow-hidden">
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => {
        if (!open) {
          setUserToDelete(null);
          setDeleteError(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              the user "{userBeingDeleted?.display_name || userBeingDeleted?.username || userToDelete}" and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <ErrorBox message={deleteError} />}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setUserToDelete(null);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4 text-center">User</TableHead>
              <TableHead className="w-1/4 hidden md:table-cell text-center">
                Email
              </TableHead>
              <TableHead className="w-1/4 text-center">Role</TableHead>
              <TableHead className="w-1/4 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">
                  <div className="flex items-center justify-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profile_pic_url}
                        alt={user.display_name || user.username || "User"}
                      />
                      <AvatarFallback>
                        {(user.display_name || user.username || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="font-medium truncate">
                        {user.display_name?.trim() || user.username?.trim() || "Unknown User"}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        @{user.username?.trim() || "unknown"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  <div className="flex items-center justify-start gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEdit(user.username)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          handleDelete(user.username);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
