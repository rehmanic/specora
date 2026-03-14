"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Workflow, Loader2, Search } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewDiagramDialog from "@/components/diagrams/NewDiagramDialog";
import DiagramCard from "@/components/diagrams/DiagramCard";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import {
    getDiagrams,
    createDiagram,
    deleteDiagram as deleteDiagramApi,
} from "@/api/diagrams";

export default function Page() {
    const { projectId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [diagrams, setDiagrams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchData() {
            try {
                const data = await getDiagrams(projectId);
                setDiagrams(data.diagrams || []);
            } catch (err) {
                console.error("Error loading diagrams:", err);
                toast.error("Failed to load diagrams.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [projectId, token]);

    const handleCreate = async (body) => {
        try {
            const diagram = await createDiagram(projectId, body);
            setDiagrams((prev) => [diagram, ...prev]);
            toast.success("Diagram created!");
            router.push(`/projects/${projectId}/specification/diagrams/${diagram.id}`);
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleDelete = async (diagramId) => {
        try {
            await deleteDiagramApi(projectId, diagramId);
            setDiagrams((prev) => prev.filter((d) => d.id !== diagramId));
            toast.success("Diagram deleted.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleOpen = (diagram) => {
        router.push(`/projects/${projectId}/specification/diagrams/${diagram.id}`);
    };

    const filtered = diagrams.filter((d) =>
        (d.title || "Untitled diagram").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <PageBanner
                        title="Specification Diagrams"
                        description="Create and manage Mermaid diagrams for system architecture and workflows."
                        icon={Workflow}
                    />

                    {/* Toolbar */}
                    <SearchCreateHeader 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchPlaceholder="Search diagrams..."
                        buttonText="New Diagram"
                        onAction={() => setIsCreating(true)}
                    />
                    <NewDiagramDialog open={isCreating} onOpenChange={setIsCreating} onSubmit={handleCreate} />

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-36 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <Workflow className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold font-display mb-2">
                                {diagrams.length === 0 ? "No Diagrams Yet" : "No Results"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                {diagrams.length === 0
                                    ? "Create your first diagram to start visualizing architecture and flows with Mermaid."
                                    : "No diagrams match your search query."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((diagram) => (
                                <DiagramCard
                                    key={diagram.id}
                                    diagram={diagram}
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
