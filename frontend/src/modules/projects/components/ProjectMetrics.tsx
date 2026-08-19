import {Activity, CheckCircle2, Clock3, FolderKanban,
} from 'lucide-react'

import type { Project } from '../types'

interface ProjectMetricsProps {
  projects: Project[]
}

export function ProjectMetrics({
  projects,
}: ProjectMetricsProps) {
  const metrics = [
    {
      label: 'Total projects',
      value: projects.length,
      icon: FolderKanban,
      tone: 'bg-slate-100 text-slate-600',
    },
    {
      label: 'Active',
      value: projects.filter((p) => p.status === 'ACTIVE').length,
      icon: Activity,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'In progress',
      value: projects.filter((p) =>
        ['ACTIVE', 'ON_HOLD'].includes(p.status),
      ).length,
      icon: Clock3,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Completed',
      value: projects.filter((p) => p.status === 'COMPLETED').length,
      icon: CheckCircle2,
      tone: 'bg-blue-50 text-blue-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {metric.label}
              </p>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.tone}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              {metric.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}