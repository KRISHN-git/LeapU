'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, GitBranch } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
  index: number
  className?: string
}

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl border border-zinc-800',
        'bg-zinc-900/60 p-6 backdrop-blur-sm transition-colors',
        'hover:border-zinc-700 hover:bg-zinc-900',
        project.featured && 'border-accent/20 bg-zinc-900/80',
        className
      )}
    >
      {project.featured && (
        <span className="absolute -top-px left-4 rounded-b-md bg-accent/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-light">
          Featured
        </span>
      )}

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-white">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
        <Link href={`/projects/${project.slug}`} className="text-sm text-accent-light hover:text-white transition-colors">
          Read more →
        </Link>
        {project.demoUrl && (
          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Demo <ArrowUpRight size={12} />
          </Link>
        )}
        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <GitBranch size={14} />
        </Link>
      </div>

      {/* Hover shimmer bottom line */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  )
}