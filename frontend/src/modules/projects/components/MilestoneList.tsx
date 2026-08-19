import {CalendarDays, CheckCircle2, Circle, Clock3,
} from 'lucide-react'

import type { Milestone } from '../types'

interface MilestoneListProps {
  milestones: Milestone[]
  loading?: boolean
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Circle,
    className: 'text-slate-400',
  },
  IN_PROGRESS: {
    label: 'In progress',
    icon: Clock3,
    className: 'text-amber-500',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'text-emerald-500',
  },
}

export function MilestoneList({
  milestones,
  loading = false,
}: MilestoneListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    )
  }

  if (!milestones.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
        <p className="text-sm font-medium text-slate-600">
          No milestones have been added.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Add milestones to track project delivery.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {milestones.map((milestone) => {
        const config = statusConfig[milestone.status]
        const Icon = config.icon

        return (
          <div
            key={milestone.id}
            className="flex gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className={`mt-0.5 ${config.className}`}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    {milestone.title}
                  </h4>

                  {milestone.description && (
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {milestone.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {config.label}
                </span>
              </div>

              {milestone.due_date && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Due{' '}
                  {new Date(
                    milestone.due_date,
                  ).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}