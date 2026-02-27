"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PenTool, Download } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import ScreenSidebar from "@/components/prototyping/ScreenSidebar";
import ScreenCanvas from "@/components/prototyping/ScreenCanvas";
import RequirementLinker from "@/components/prototyping/RequirementLinker";
import {
    getScreens,
    createScreen,
    updateScreen as updateScreenApi,
    deleteScreen as deleteScreenApi,
    updateScreenRequirements,
} from "@/api/prototyping";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
    const { projectId, prototypeId } = useParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [screens, setScreens] = useState([]);
    const [selectedScreenId, setSelectedScreenId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [prototypeName, setPrototypeName] = useState("");

    // Requirements
    const [requirements, setRequirements] = useState([]);
    const [linkedRequirementIds, setLinkedRequirementIds] = useState([]);

    // Canvas data keyed by screen id for quick switching
    const canvasDataRef = useRef({});
    const saveTimerRef = useRef(null);

    const selectedScreen = screens.find((s) => s.id === selectedScreenId);

    // ─── Fetch screens ────────────────────────────────
    useEffect(() => {
        if (!prototypeId || !token) return;

        async function fetchData() {
            try {
                const data = await getScreens(prototypeId);
                const fetchedScreens = data.screens || [];
                setScreens(fetchedScreens);

                // Pre-load canvas data
                fetchedScreens.forEach((s) => {
                    canvasDataRef.current[s.id] = s.canvas_data || {
                        elements: [],
                        appState: { viewBackgroundColor: "#ffffff" },
                    };
                });

                if (fetchedScreens.length > 0) {
                    setSelectedScreenId(fetchedScreens[0].id);
                }

                // Fetch prototype name
                const protoRes = await fetch(
                    `${API_BASE}/prototyping/prototypes/${projectId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (protoRes.ok) {
                    const protoData = await protoRes.json();
                    const proto = (protoData.prototypes || []).find((p) => p.id === prototypeId);
                    if (proto) setPrototypeName(proto.name);
                }

                // Fetch requirements
                const reqRes = await fetch(`${API_BASE}/requirements/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (reqRes.ok) {
                    const reqData = await reqRes.json();
                    setRequirements(reqData.requirements || []);
                }
            } catch (err) {
                console.error("Error loading screens:", err);
                toast.error("Failed to load screens.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [prototypeId, projectId, token]);

    // Load linked requirements when screen changes
    useEffect(() => {
        if (!selectedScreen) {
            setLinkedRequirementIds([]);
            return;
        }
        const linked = (selectedScreen.requirement_links || []).map(
            (l) => l.requirement?.id || l.requirement_id
        );
        setLinkedRequirementIds(linked);
    }, [selectedScreenId, screens]);

    // ─── Canvas change handler (debounced save) ───────

    const handleCanvasChange = useCallback(
        (sceneData) => {
            if (!selectedScreenId) return;

            // Store in ref for screen switching
            canvasDataRef.current[selectedScreenId] = sceneData;

            // Debounced save
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(async () => {
                setSaving(true);
                try {
                    await updateScreenApi(selectedScreenId, {
                        canvas_data: sceneData,
                    });
                } catch (err) {
                    console.error("Save error:", err);
                } finally {
                    setSaving(false);
                }
            }, 1200);
        },
        [selectedScreenId]
    );

    // ─── Screen handlers ──────────────────────────────

    const handleCreateScreen = async () => {
        try {
            const name = `Screen ${screens.length + 1}`;
            const data = await createScreen(prototypeId, { name });
            const newScreen = { ...data.screen, requirement_links: [] };
            canvasDataRef.current[newScreen.id] = {
                elements: [],
                appState: { viewBackgroundColor: "#ffffff" },
            };
            setScreens((prev) => [...prev, newScreen]);
            setSelectedScreenId(newScreen.id);
            toast.success("Screen created!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteScreen = async (screenId) => {
        try {
            await deleteScreenApi(screenId);
            delete canvasDataRef.current[screenId];
            setScreens((prev) => prev.filter((s) => s.id !== screenId));
            if (selectedScreenId === screenId) {
                setSelectedScreenId(screens.find((s) => s.id !== screenId)?.id || null);
            }
            toast.success("Screen deleted.");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRenameScreen = async (screenId, newName) => {
        try {
            await updateScreenApi(screenId, { name: newName });
            setScreens((prev) =>
                prev.map((s) => (s.id === screenId ? { ...s, name: newName } : s))
            );
        } catch (err) {
            toast.error(err.message);
        }
    };

    // ─── Requirement linking ──────────────────────────

    const handleToggleRequirement = async (reqId) => {
        const newIds = linkedRequirementIds.includes(reqId)
            ? linkedRequirementIds.filter((id) => id !== reqId)
            : [...linkedRequirementIds, reqId];

        setLinkedRequirementIds(newIds);
        try {
            await updateScreenRequirements(selectedScreenId, newIds);
        } catch (err) {
            toast.error("Failed to update requirement links.");
        }
    };

    // ─── Get initial data for current screen ──────────

    const getInitialData = () => {
        if (!selectedScreenId) return null;
        return canvasDataRef.current[selectedScreenId] || {
            elements: [],
            appState: { viewBackgroundColor: "#ffffff" },
        };
    };

    // ─── Render ───────────────────────────────────────
    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer", "designer"]}>
            <main className="w-full h-full flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="border-b border-border bg-card px-4 py-2.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/projects/${projectId}/prototyping`)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">
                                {prototypeName || "Prototype"}
                            </span>
                            {selectedScreen && (
                                <span className="text-xs text-muted-foreground">
                                    / {selectedScreen.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {saving && (
                            <span className="flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                            </span>
                        )}
                        {!saving && selectedScreenId && (
                            <span className="text-emerald-500">✓ Saved</span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Screen sidebar */}
                        <ScreenSidebar
                            screens={screens}
                            selectedScreenId={selectedScreenId}
                            onSelect={setSelectedScreenId}
                            onCreate={handleCreateScreen}
                            onDelete={handleDeleteScreen}
                            onRename={handleRenameScreen}
                        />

                        {/* Center: Excalidraw Canvas */}
                        <div className="flex-1 overflow-hidden">
                            {selectedScreenId ? (
                                <ScreenCanvas
                                    key={selectedScreenId}
                                    initialData={getInitialData()}
                                    onChange={handleCanvasChange}
                                    theme="light"
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    <p>Create or select a screen to start designing</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Requirements */}
                        {selectedScreenId && requirements.length > 0 && (
                            <div className="w-56 border-l border-border bg-card overflow-y-auto shrink-0">
                                <RequirementLinker
                                    requirements={requirements}
                                    linkedIds={linkedRequirementIds}
                                    onToggle={handleToggleRequirement}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </ProtectedRoute>
    );
}
