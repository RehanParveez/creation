import {CalendarDays, ChevronRight, Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Client, Project } from '../types'
import { ClientBadge } from './ClientBadge'
import { ProjectProgress } from './ProjectProgress'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectCardProps {
  project: Project
  client?: Client | null
}

export function ProjectCard({
  project,
  client,
}: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-emerald-700">
            {project.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
            {project.description || 'No project description provided.'}
          </p>
        </div>

        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="my-5 border-t border-slate-100" />

      <ClientBadge
        client={client}
        name={client ? undefined : project.client_id ? 'Client' : null}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Start date
          </div>

          <p className="mt-1.5 text-sm font-medium text-slate-700">
            {project.start_date
              ? new Date(project.start_date).toLocaleDateString()
              : 'Not set'}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            Members
          </div>

          <p className="mt-1.5 text-sm font-medium text-slate-700">
            {project.members?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <ProjectProgress
          milestones={project.milestones}
          compact
        />

        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
      </div>
    </Link>
  )
}