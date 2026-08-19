import { FolderKanban, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyProjectsStateProps {
  filtered?: boolean
  onClearFilters?: () => void
}

export function EmptyProjectsState({
  filtered = false,
  onClearFilters,
}: EmptyProjectsStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <FolderKanban className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {filtered ? 'No matching projects' : 'No projects yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'Try adjusting your search or filters to find the project you are looking for.'
          : 'Create your first project to start tracking delivery, milestones, clients, and project members.'}
      </p>

      <div className="mt-6">
        {filtered ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear filters
          </button>
        ) : (
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create project
          </Link>
        )}
      </div>
    </div>
  )
}