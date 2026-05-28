import { getAllProjects } from '@/lib/projects'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsGrid } from '@/components/sections/ProjectsGrid'
import { VisionShowcase } from '@/components/sections/VisionShowcase'

export default function HomePage() {
  const projects = getAllProjects()

  return (
    <>
      <HeroSection />
      <ProjectsGrid projects={projects} />
      <VisionShowcase />
      <section id="voice" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">Voice Workspace — Day 4</p>
      </section>
      <section id="terminal" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">System Terminal — Day 4</p>
      </section>
    </>
  )
}