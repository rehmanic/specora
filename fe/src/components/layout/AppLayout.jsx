"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppLayout({ children }) {
    const pathname = usePathname();
    const isChat = pathname.includes('/chat');

    return (
        <SidebarProvider>
            <Sidebar />
            <SidebarInset>
                <div className="flex h-screen flex-col">
                    <Topbar />
                    <div className="flex flex-1 overflow-hidden">
                        <main
                            className={cn(
                                "flex-1 overflow-auto bg-muted/10 relative flex flex-col",
                                !isChat && "p-4 md:p-6 lg:p-8"
                            )}
                        >
                            <div className={cn(
                                "mx-auto w-full h-full",
                                !isChat && "max-w-[1400px]"
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
