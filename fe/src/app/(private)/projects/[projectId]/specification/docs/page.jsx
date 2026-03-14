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
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
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
    const [isCreating, setIsCreating] = useState(false);

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
                    <PageBanner
                        title="Specification Documents"
                        description="Create and manage textual requirements, SRS, and use cases."
                        icon={FileText}
                    />

                    {/* Toolbar */}
                    <SearchCreateHeader 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Search documents..."
                        buttonText="New Doc"
                        onAction={() => setIsCreating(true)}
                    />
                    <NewDocDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={handleCreate} />

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
