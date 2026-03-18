import { useState } from "react";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import useProjectsStore from "@/store/projectsStore";

// Empty State Component
function EmptyState({ isSearching }) {
  if (isSearching) {
    return (
      <div className="border-border/50 bg-card/40 animate-fade-in rounded-2xl border border-dashed py-12 text-center backdrop-blur-xl">
        <p className="text-muted-foreground">No projects found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in border-border/50 bg-card/40 hover:bg-card/60 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 backdrop-blur-xl transition-colors">
      <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
        <FolderOpen className="text-primary h-8 w-8" />
      </div>
      <h3 className="font-display mb-1 text-lg font-semibold">No projects yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
        Create your first project to start collaborating with your team and gathering requirements.
      </p>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border-border/50 bg-card/60 overflow-hidden rounded-2xl border shadow-sm backdrop-blur-xl"
        >
          <div className="skeleton-shimmer aspect-[16/10]" />
          <div className="space-y-4 p-6">
            <div className="space-y-2 pt-2">
              <div className="skeleton-shimmer h-5 w-3/4 rounded" />
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="skeleton-shimmer h-3 w-2/3 rounded" />
            </div>
            <div className="flex gap-4 border-t border-white/5 pt-4">
              <div className="skeleton-shimmer h-3 w-16 rounded" />
              <div className="skeleton-shimmer h-3 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectList({ projects, loading, isSearching }) {
  const { setSelectedProject } = useProjectsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return <EmptyState isSearching={isSearching} />;
  }

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Reset page if it exceeds total pages after a search
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="animate-fade-in space-y-6" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between gap-4"></div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {currentProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}/settings`}
            onClick={() => setSelectedProject(project)}
            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="border-border/50 bg-card/60 mt-4 flex items-center justify-between rounded-2xl border px-5 py-3 shadow-sm backdrop-blur-xl">
        <p className="text-muted-foreground text-xs">
          Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-semibold">{Math.min(indexOfLastItem, projects.length)}</span> of{" "}
          <span className="font-semibold">{projects.length}</span> results
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="border-border/50 bg-background/50 hover:bg-background h-8 w-8 backdrop-blur-sm transition-colors"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className={`h-8 w-8 text-xs transition-all duration-300 ${
                currentPage === page
                  ? "gradient-primary shadow-primary/25 scale-105 border-0 shadow-lg"
                  : "border-border/50 bg-background/50 hover:bg-background backdrop-blur-sm"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="border-border/50 bg-background/50 hover:bg-background h-8 w-8 backdrop-blur-sm transition-colors"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
