import { ArrowLeft, Plus, FolderKanban } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProjectHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  backTo?: string
  backLabel?: string
}

export function ProjectHeader({title, description, actionLabel, actionTo, backTo, backLabel = 'Back',
}: ProjectHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}

        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
            <FolderKanban className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  )
}