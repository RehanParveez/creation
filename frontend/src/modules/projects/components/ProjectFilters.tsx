import { Filter, Search, X } from 'lucide-react'

import type {Client, ProjectFilters as ProjectFilterState, ProjectStatus,
} from '../types'

interface ProjectFiltersProps {
  filters: ProjectFilterState
  clients: Client[]
  onChange: (filters: ProjectFilterState) => void
}

const statuses: Array<{
  value: ProjectStatus | 'ALL'
  label: string
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export function ProjectFilters({
  filters,
  clients,
  onChange,
}: ProjectFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status && filters.status !== 'ALL') ||
    Boolean(filters.clientId && filters.clientId !== 'ALL')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={filters.search ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Search projects..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={filters.status ?? 'ALL'}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as ProjectStatus | 'ALL',
              })
            }
            className="h-11 min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={filters.clientId ?? 'ALL'}
          onChange={(event) =>
            onChange({
              ...filters,
              clientId: event.target.value,
            })
          }
          className="h-11 min-w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        >
          <option value="ALL">All clients</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({
                search: '',
                status: 'ALL',
                clientId: 'ALL',
              })
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}