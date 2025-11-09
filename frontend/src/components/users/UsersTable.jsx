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

export function UsersTable({ users: initialUsers = [] }) {
  const router = useRouter();

  const [users, setUsers] = useState(
    Array.isArray(initialUsers) ? initialUsers : []
  );
  const [loading, setLoading] = useState(false);

  const handleDelete = async (username) => {
    const confirmed = confirm(
      `Are you sure you want to delete user ${username}?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await deleteUserRequest(username);
      setUsers((prevUsers) => prevUsers.filter((u) => u.username !== username));
    } catch (error) {
      alert(`Failed to delete user: ${error.message}`);
    } finally {
      setLoading(false);
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

  return (
    <Card className="overflow-hidden">
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
                        alt={user.display_name}
                      />
                      <AvatarFallback>
                        {user.display_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="font-medium truncate">
                        {user.display_name.trim()}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        @{user.username.trim()}
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
                        onClick={() => handleDelete(user.username)}
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
