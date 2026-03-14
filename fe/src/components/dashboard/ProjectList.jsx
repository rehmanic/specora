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
      <div className="py-12 text-center border border-dashed border-white/20 dark:border-white/10 rounded-2xl bg-card/40 backdrop-blur-xl animate-fade-in">
        <p className="text-muted-foreground">
          No projects found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in border border-dashed border-white/20 dark:border-white/10 rounded-2xl bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-colors">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <FolderOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">No projects yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6 text-sm">
        Create your first project to start collaborating with your team and gathering requirements.
      </p>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
          <div className="aspect-[16/10] skeleton-shimmer" />
          <div className="p-6 space-y-4">
            <div className="pt-2 space-y-2">
              <div className="h-5 w-3/4 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-2/3 rounded skeleton-shimmer" />
            </div>
            <div className="pt-4 border-t border-white/5 flex gap-4">
              <div className="h-3 w-16 rounded skeleton-shimmer" />
              <div className="h-3 w-20 rounded skeleton-shimmer" />
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

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between gap-4">
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}/settings`}
            onClick={() => setSelectedProject(project)}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-5 py-3 border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl rounded-2xl shadow-sm mt-4">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold">{indexOfFirstItem + 1}</span>{" "}
          to{" "}
          <span className="font-semibold">{Math.min(indexOfLastItem, projects.length)}</span>{" "}
          of{" "}
          <span className="font-semibold">{projects.length}</span>{" "}
          results
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background transition-colors"
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
              className={`h-8 w-8 text-xs transition-all duration-300 ${currentPage === page
                  ? "gradient-primary border-0 shadow-lg shadow-primary/25 scale-105"
                  : "border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background"
                }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background transition-colors"
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
