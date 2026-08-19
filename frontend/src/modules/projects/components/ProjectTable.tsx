import {ArrowUpRight, CalendarDays, MoreHorizontal,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Client, Project } from '../types'
import { ClientBadge } from './ClientBadge'
import { ProjectProgress } from './ProjectProgress'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectTableProps {
  projects: Project[]
  clients: Client[]
  onDelete?: (project: Project) => void
}

export function ProjectTable({
  projects,
  clients,
  onDelete,
}: ProjectTableProps) {
  const clientMap = new Map(
    clients.map((client) => [client.id, client]),
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Project
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Client
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Timeline
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Progress
              </th>
              <th className="w-12 px-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => {
              const client = project.client_id
                ? clientMap.get(project.client_id)
                : undefined

              return (
                <tr
                  key={project.id}
                  className="group transition hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4">
                    <Link
                      to={`/projects/${project.id}`}
                      className="group/name flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                        {project.name
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800 group-hover/name:text-emerald-700">
                          {project.name}
                        </p>

                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                          {project.description ||
                            'No description'}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <ClientBadge client={client} />
                  </td>

                  <td className="px-5 py-4">
                    <ProjectStatusBadge
                      status={project.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {project.start_date
                        ? new Date(
                            project.start_date,
                          ).toLocaleDateString()
                        : 'Not scheduled'}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <ProjectProgress
                      milestones={project.milestones}
                      compact
                    />
                  </td>

                  <td className="px-3 py-4">
                    <div className="relative flex justify-end">
                      <button
                        type="button"
                        title="Project actions"
                        className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      <Link
                        to={`/projects/${project.id}`}
                        className="absolute right-2 rounded-lg bg-white p-2 text-slate-400 opacity-0 transition hover:text-emerald-600 group-hover:opacity-100"
                        title="Open project"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(project)}
                        className="sr-only"
                      >
                        Delete {project.name}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}