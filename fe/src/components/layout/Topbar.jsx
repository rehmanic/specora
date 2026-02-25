"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Bell,
    Search,
    HelpCircle,
    Menu,
    Moon,
    Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useState, useEffect } from "react";
import useProjectsStore from "@/store/projectsStore";

export function Topbar() {
    const pathname = usePathname();
    const { selectedProject } = useProjectsStore();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Simple breadcrumb logic
    const paths = pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Trigger could go here if we were using a Sheet for Sidebar on mobile */}

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            Home
                        </BreadcrumbItem>
                        {paths.map((path, index) => {
                            // Make last item active/non-clickable
                            const isLast = index === paths.length - 1;
                            // Format path name (capitalize, replace hyphens)
                            const name = path.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

                            return (
                                <Fragment key={path}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{name}</BreadcrumbPage>
                                        ) : (
                                            <span>{name}</span>
                                        )}
                                    </BreadcrumbItem>
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">

                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                )}

                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Help</span>
                </Button>
            </div>
        </header>
    );
}
