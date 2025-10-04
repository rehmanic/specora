import Link from "next/link";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateUserPage() {
  return (
    <section className="w-full flex justify-center py-10">
      <div className="w-full max-w-6xl px-6">
        <Link href="/users">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Create New User</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new user to the system and configure their permissions.
          </p>
        </div>

        <CreateUserForm />
      </div>
    </section>
  );
}
