"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppLayout({ children }) {
    const pathname = usePathname();
    const isChat = pathname.includes('/chat');
    const isSpecbot = pathname.includes('/specbot');
    const isMeetingRoom = pathname.includes('/meetings/room');
    const isPrototypingEditor = /\/prototyping\/[^/]+$/.test(pathname);
    const isFullWidthObj = isChat || isSpecbot || isMeetingRoom || isPrototypingEditor;

    return (
        <SidebarProvider>
            <Sidebar />
            <SidebarInset>
                <div className="flex h-screen flex-col">
                    <Topbar />
                    <div className="flex flex-1 overflow-hidden">
                        <main
                            className={cn(
                                "flex-1 bg-muted/10 relative flex flex-col",
                                isFullWidthObj ? "overflow-hidden" : "overflow-auto",
                                !isFullWidthObj && "p-4 md:p-6 lg:p-8"
                            )}
                        >
                            <div className={cn(
                                "mx-auto w-full h-full",
                                !isFullWidthObj && "max-w-[1400px]"
                            )}>
                                {children}
                            </div>
                        </main>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
