"use client";

import { useState, useRef, useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import MainPanel from "./MainPanel";
import RightSidebar from "./RightSidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatLayout() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setRightSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Menu Button - Left */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-16 z-50 md:hidden"
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
      >
        {leftSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Menu Button - Right */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-16 z-50 md:hidden"
        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
      >
        {rightSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Left Sidebar */}
      <div
        className={`${
          leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 md:relative md:translate-x-0 ${
          leftSidebarCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() =>
            setLeftSidebarCollapsed(!leftSidebarCollapsed)
          }
        />
      </div>

      {/* Main Panel */}
      <div className="flex-1 overflow-hidden">
        <MainPanel />
      </div>

      {/* Right Sidebar with Resize Handle */}
      <div
        ref={resizeRef}
        className={`${
          rightSidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed inset-y-0 right-0 z-40 transition-transform duration-300 md:relative md:translate-x-0`}
        style={{ width: `${rightSidebarWidth}px` }}
      >
        <div
          className="absolute left-0 top-0 hidden h-full w-1 cursor-ew-resize bg-border hover:bg-primary md:block"
          onMouseDown={() => setIsResizing(true)}
        />
        <RightSidebar />
      </div>

      {/* Overlay for mobile */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
}
