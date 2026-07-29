"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function UserDangerZoneTab({
  userData,
  deleteModalOpen,
  setDeleteModalOpen,
  handleDeleteUser,
  isDeleting,
}) {
  return (
    <Card className="border-destructive/20">
      <CardHeader className="pb-4">
        <div className="text-destructive flex items-center gap-2">
          <Trash2 className="size-4" />
          <CardTitle className="text-lg">Destructive Actions</CardTitle>
        </div>
        <CardDescription>Irreversible operations that destroy user data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-destructive/10 bg-destructive/5 flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-destructive text-sm font-bold">Delete Account</p>
            <p className="text-muted-foreground text-xs">
              This user and all their personal records will be wiped.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="font-bold"
            onClick={() => setDeleteModalOpen(true)}
          >
            Erase Account
          </Button>
        </div>

        <ConfirmationDialog
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleDeleteUser}
          title="Delete Account"
          description={
            <span>
              Deleting{" "}
              <strong>
                {userData.fullName} (@{userData.username})
              </strong>{" "}
              is final. The user will lose access immediately and all associated metadata will be purged.
            </span>
          }
          confirmText={isDeleting ? "Wiping..." : "Yes, Purge Account"}
          variant="destructive"
          loading={isDeleting}
        />
      </CardContent>
    </Card>
  );
}
