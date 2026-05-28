export default function HomePage() {
  return (
    <>
      <section id="hero" className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500 text-sm">Hero section</p>
      </section>
      <section id="projects" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">Projects</p>
      </section>
      <section id="vision" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">Vision Showcase</p>
      </section>
      <section id="voice" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">Voice Workspace</p>
      </section>
      <section id="terminal" className="min-h-screen flex items-center justify-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">System Terminal</p>
      </section>
    </>
  )
}