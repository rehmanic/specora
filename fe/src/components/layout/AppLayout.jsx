"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppLayout({ children }) {
    return (
        <SidebarProvider>
            <Sidebar />
            <SidebarInset>
                <div className="flex h-screen flex-col">
                    <Topbar />
                    <div className="flex flex-1 overflow-hidden">
                        <main className="flex-1 bg-muted/10 relative flex flex-col overflow-hidden">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
