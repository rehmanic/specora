"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Loader2, Search } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewDocDialog from "@/components/docs/NewDocDialog";
import DocCard from "@/components/docs/DocCard";
import {
    getDocs,
    createDoc,
    deleteDoc as deleteDocApi,
} from "@/api/docs";

export default function Page() {
    const { projectId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchData() {
            try {
                const data = await getDocs(projectId);
                setDocs(data.docs || []);
            } catch (err) {
                console.error("Error loading docs:", err);
                toast.error("Failed to load documents.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [projectId, token]);

    const handleCreate = async (body) => {
        try {
            const doc = await createDoc(projectId, body);
            setDocs((prev) => [doc, ...prev]);
            toast.success("Document created!");
            router.push(`/projects/${projectId}/specification/docs/${doc.id}`);
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleDelete = async (docId) => {
        try {
            await deleteDocApi(projectId, docId);
            setDocs((prev) => prev.filter((d) => d.id !== docId));
            toast.success("Document deleted.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleOpen = (doc) => {
        router.push(`/projects/${projectId}/specification/docs/${doc.id}`);
    };

    const filtered = docs.filter((d) =>
        (d.title || "Untitled Doc").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">
                                    Specification Documents
                                </h1>
                            </div>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Create and manage textual requirements, SRS, and use cases.
                            </p>
                        </div>
                        <NewDocDialog onSubmit={handleCreate} />
                    </div>

                    {!loading && docs.length > 0 && (
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-36 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold font-display mb-2">
                                {docs.length === 0 ? "No Documents Yet" : "No Results"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                {docs.length === 0
                                    ? "Create your first document to start drafting out textual requirements."
                                    : "No documents match your search query."}
                            </p>
                            {docs.length === 0 && (
                                <NewDocDialog onSubmit={handleCreate} />
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((doc) => (
                                <DocCard
                                    key={doc.id}
                                    doc={doc}
                                    onOpen={handleOpen}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
