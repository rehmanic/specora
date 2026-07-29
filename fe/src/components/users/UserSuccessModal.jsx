"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ThumbsUp } from "lucide-react";

export default function UserSuccessModal({ successModal, setSuccessModal, onGoToUserList }) {
  return (
    <Dialog open={successModal.open} onOpenChange={(open) => setSuccessModal((prev) => ({ ...prev, open }))}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader>
          <div className="bg-success/10 text-success mx-auto my-4 flex h-12 w-12 items-center justify-center rounded-full">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">{successModal.title}</DialogTitle>
          <DialogDescription className="pt-2 text-center">{successModal.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex-row gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSuccessModal((prev) => ({ ...prev, open: false }));
              onGoToUserList();
            }}
          >
            Go to User List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
