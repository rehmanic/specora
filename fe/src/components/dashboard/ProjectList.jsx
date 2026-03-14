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
      <div className="py-12 text-center border rounded-xl border-dashed bg-card/20 animate-fade-in">
        <p className="text-muted-foreground">
          No projects found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in border border-dashed rounded-xl bg-card/20 hover:bg-card/40 transition-colors">
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
        <div key={i} className="rounded-xl border border-white/5 bg-card/20 overflow-hidden shadow-sm">
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
        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
          All Projects
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full ml-2">{projects.length}</span>
        </h2>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md rounded-lg p-1 border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-background"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium px-2 min-w-[3.5rem] text-center text-muted-foreground">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-background"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}/chat`}
            onClick={() => setSelectedProject(project)}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
