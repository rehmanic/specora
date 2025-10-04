import { CreateUserForm } from "@/components/users/CreateUserForm";

export default function CreateUserPage() {
  return (
    <section className="w-full flex justify-center py-10">
      <div className="w-full max-w-6xl px-6">
        <CreateUserForm />
      </div>
    </section>
  );
}
