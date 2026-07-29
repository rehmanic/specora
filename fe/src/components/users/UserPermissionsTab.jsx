"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertCircle } from "lucide-react";

export default function UserPermissionsTab({ userRole, roles = [] }) {
  const currentRole = roles.find((r) => r.name === userRole);
  const permissions = currentRole?.permissions || [];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Shield className="text-primary size-4" />
          <CardTitle className="text-lg">Role Capabilities</CardTitle>
        </div>
        <CardDescription>
          This user has the following permissions based on their{" "}
          <strong>{userRole?.replace("_", " ")}</strong> role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase">Module</TableHead>
                <TableHead className="text-xs font-bold uppercase">Permission</TableHead>
                <TableHead className="text-xs font-bold uppercase">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length > 0 ? (
                permissions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs font-medium capitalize">{p.module || "General"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 text-[10px]"
                      >
                        {p.label || p.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.description || "Access to this module's features."}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground py-20 text-center italic">
                    No granular permissions assigned to this role yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="bg-primary/5 border-primary/10 mt-4 flex items-start gap-3 rounded-lg border p-4">
          <AlertCircle className="text-primary mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-primary text-xs font-bold">Admin Managed Access</p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Permissions are managed globally through the RBAC settings. Changing a user's role will update
              their permissions automatically.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
