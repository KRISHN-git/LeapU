export interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  demoUrl?: string
  githubUrl: string
  videoUrl?: string
  featured: boolean
  date: string
}