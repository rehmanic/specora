"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, Search, HelpCircle, Menu, Moon, Sun } from "lucide-react";
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
  const { selectedProject, entityTitles } = useProjectsStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Simple breadcrumb logic
  const paths = pathname.split("/").filter(Boolean);

  const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-6">
      <div className="flex flex-1 items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </BreadcrumbItem>
            {paths.map((path, index) => {
              const isLast = index === paths.length - 1;

              // Check for entity title first (for IDs)
              let name = entityTitles[path];
              if (!name) {
                if (path === selectedProject?.id) {
                  name = selectedProject.name;
                } else {
                  // Default formatting
                  name = path.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
                  // If it's a UUID and we don't have a title, shorten it or keep it
                  if (isUUID(path)) name = path.slice(0, 8) + "...";
                }
              }

              return (
                <Fragment key={path + index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="max-w-[200px] truncate">{name}</BreadcrumbPage>
                    ) : (
                      <span className="max-w-[150px] truncate">{name}</span>
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
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
