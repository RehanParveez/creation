import {CircleCheck, CircleDot, CirclePause, FileClock, Ban,
} from 'lucide-react'

import type { ProjectStatus } from '../types'

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string
    className: string
    icon: typeof CircleDot
  }
> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
    icon: FileClock,
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    icon: CircleCheck,
  },
  ON_HOLD: {
    label: 'On hold',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    icon: CirclePause,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
    icon: CircleCheck,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 ring-red-200',
    icon: Ban,
  },
}

export function ProjectStatusBadge({
  status,
  size = 'sm',
}: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        config.className,
        size === 'sm'
          ? 'px-2.5 py-1 text-xs'
          : 'px-3 py-1.5 text-sm',
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}