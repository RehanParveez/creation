import {ShieldCheck, UserRound, UserRoundMinus,
} from 'lucide-react'

import type { ProjectMember } from '../types'

interface ProjectMemberListProps {
  members: ProjectMember[]
  loading?: boolean
  onRemove?: (userId: string) => Promise<void>
}

const roleLabels = {MANAGER: 'Manager', ENGINEER: 'Engineer', VIEWER: 'Viewer',
}

export function ProjectMemberList({
  members,
  loading = false,
  onRemove,
}: ProjectMemberListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    )
  }

  if (!members.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
        <UserRound className="mx-auto h-7 w-7 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">
          No project members assigned.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              User {member.user_id.slice(0, 8)}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3 w-3" />
              {roleLabels[member.role]}
            </div>
          </div>

          {onRemove && (
            <button
              type="button"
              title="Remove member"
              onClick={() => onRemove(member.user_id)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <UserRoundMinus className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}