"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import "@excalidraw/excalidraw/index.css";

// Dynamic import for Excalidraw (it doesn't support SSR)
let Excalidraw = null;
let exportToBlob = null;

export default function ScreenCanvas({ initialData, onChange, theme = "light" }) {
    const excalidrawRef = useRef(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState(null);
    const isInternalChange = useRef(false);

    // Dynamically import Excalidraw on mount (client-only)
    useEffect(() => {
        import("@excalidraw/excalidraw").then((mod) => {
            setExcalidrawComp(() => mod.Excalidraw);
            exportToBlob = mod.exportToBlob;
        });
    }, []);

    const handleChange = useCallback(
        (elements, appState, files) => {
            // Debounce: only fire onChange if elements actually changed
            if (onChange) {
                const sceneData = {
                    elements: elements.map((el) => ({ ...el })),
                    appState: {
                        viewBackgroundColor: appState.viewBackgroundColor,
                        gridSize: appState.gridSize,
                    },
                    files: files || {},
                };
                onChange(sceneData);
            }
        },
        [onChange]
    );

    if (!ExcalidrawComp) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-background">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm">Loading canvas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ExcalidrawComp
                ref={excalidrawRef}
                initialData={initialData || { elements: [], appState: { viewBackgroundColor: "#ffffff" } }}
                onChange={handleChange}
                theme={theme}
                UIOptions={{
                    canvasActions: {
                        saveToActiveFile: false,
                        loadScene: false,
                        export: { saveFileToDisk: false },
                    },
                }}
            />
        </div>
    );
}

// Export helper for PNG export
export async function exportCanvasToPng(excalidrawRef) {
    if (!exportToBlob || !excalidrawRef?.current) return null;
    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();
    const files = excalidrawRef.current.getFiles();

    const blob = await exportToBlob({
        elements,
        appState,
        files,
        mimeType: "image/png",
        quality: 1,
    });
    return blob;
}
