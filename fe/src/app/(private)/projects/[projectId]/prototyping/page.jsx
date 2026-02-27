"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PenTool, Loader2, Layers, Search } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import NewPrototypeDialog from "@/components/prototyping/NewPrototypeDialog";
import PrototypeCard from "@/components/prototyping/PrototypeCard";
import {
    getPrototypes,
    createPrototype,
    deletePrototype as deletePrototypeApi,
} from "@/api/prototyping";

export default function Page() {
    const { projectId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [prototypes, setPrototypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Fetch prototypes ─────────────────────────────
    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchData() {
            try {
                const data = await getPrototypes(projectId);
                setPrototypes(data.prototypes || []);
            } catch (err) {
                console.error("Error loading prototypes:", err);
                toast.error("Failed to load prototypes.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [projectId, token]);

    // ─── Handlers ─────────────────────────────────────

    const handleCreate = async (body) => {
        try {
            const data = await createPrototype(projectId, body);
            setPrototypes((prev) => [data.prototype, ...prev]);
            toast.success("Prototype created!");
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

    const handleDelete = async (prototypeId) => {
        try {
            await deletePrototypeApi(prototypeId);
            setPrototypes((prev) => prev.filter((p) => p.id !== prototypeId));
            toast.success("Prototype deleted.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleOpen = (prototype) => {
        router.push(`/projects/${projectId}/prototyping/${prototype.id}`);
    };

    // ─── Filtered list ────────────────────────────────
    const filtered = prototypes.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ─── Render ───────────────────────────────────────
    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer", "designer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <PenTool className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">
                                    Prototyping
                                </h1>
                            </div>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Create and manage wireframe prototypes for your project.
                            </p>
                        </div>
                        <NewPrototypeDialog onSubmit={handleCreate} />
                    </div>

                    {/* Search */}
                    {!loading && prototypes.length > 0 && (
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search prototypes..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-36 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <Layers className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold font-display mb-2">
                                {prototypes.length === 0 ? "No Prototypes Yet" : "No Results"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                {prototypes.length === 0
                                    ? "Create your first prototype to start designing wireframes for this project."
                                    : "No prototypes match your search query."}
                            </p>
                            {prototypes.length === 0 && (
                                <NewPrototypeDialog onSubmit={handleCreate} />
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((proto) => (
                                <PrototypeCard
                                    key={proto.id}
                                    prototype={proto}
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
