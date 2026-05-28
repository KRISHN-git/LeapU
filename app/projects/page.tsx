import { getAllProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'

export const metadata = { title: 'Projects' }

export default function ProjectsPage() {
  const projects = getAllProjects()
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold text-zinc-100 mb-12">All Projects</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
      </div>
    </main>
  )
}