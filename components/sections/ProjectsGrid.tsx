import { ProjectCard } from '@/components/ui/ProjectCard'
import type { Project } from '@/types/project'

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-32">
      <div className="mb-16">
        <p className="text-sm font-medium uppercase tracking-widest text-accent-light">Work</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-100">Selected Projects</h2>
        <p className="mt-3 max-w-lg text-zinc-400">
          Production systems spanning real-time computer vision, voice interfaces, and low-level network programming.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}