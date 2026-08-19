import { CheckCircle2 } from 'lucide-react'

import type { Milestone } from '../types'

interface ProjectProgressProps {
  milestones?: Milestone[]
  compact?: boolean
}

export function ProjectProgress({
  milestones = [],
  compact = false,
}: ProjectProgressProps) {
  const total = milestones.length
  const completed = milestones.filter(
    (milestone) => milestone.status === 'COMPLETED',
  ).length

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100)

  if (compact) {
    return (
      <div className="min-w-32">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-700">
            {percentage}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Project progress
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {percentage}%
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {completed} of {total} milestones completed
      </p>
    </div>
  )
}