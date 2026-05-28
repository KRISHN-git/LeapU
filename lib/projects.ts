import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Project } from '@/types/project'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return []

  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.mdx'))

  const projects = files.map(filename => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf-8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: data.tags ?? [],
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl ?? '#',
      videoUrl: data.videoUrl,
      featured: data.featured ?? false,
      date: data.date ?? new Date().toISOString(),
    } satisfies Project
  })

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getProjectBySlug(slug: string): { project: Project; content: string } | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    project: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: data.tags ?? [],
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl ?? '#',
      videoUrl: data.videoUrl,
      featured: data.featured ?? false,
      date: data.date ?? new Date().toISOString(),
    },
    content,
  }
}