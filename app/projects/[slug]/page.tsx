import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'

export async function generateStaticParams() {
  return getAllProjects().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const result = getProjectBySlug(params.slug)
  if (!result) return {}
  return { title: result.project.title, description: result.project.description }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const result = getProjectBySlug(params.slug)
  if (!result) notFound()

  const { project, content } = result
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">{tag}</span>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">{project.title}</h1>
      <p className="text-zinc-400 mb-12 text-lg">{project.description}</p>
      <article className="prose prose-invert prose-zinc max-w-none">
        <MDXRemote source={content} />
      </article>
    </main>
  )
}