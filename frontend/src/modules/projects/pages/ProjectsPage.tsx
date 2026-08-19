import { useMemo, useState } from 'react'
import {LayoutGrid, List, Loader2, RefreshCw,
} from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { useClients } from '../hooks/useClients'
import type { ProjectFilters as ProjectFilterState } from '../types'
import { ProjectHeader } from '../components/ProjectHeader'
import { ProjectMetrics } from '../components/ProjectMetrics'
import { ProjectFilters } from '../components/ProjectFilters'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectTable } from '../components/ProjectTable'
import { EmptyProjectsState } from '../components/EmptyProjectsState'
import { useAuthStore } from '@/app/store'
import { PROJECT_PERMISSIONS } from '@/modules/projects/permissions'

export default function ProjectsPage() {
  const permissions = useAuthStore((state) => state.permissions)
  const canCreateProject = permissions.includes(
    PROJECT_PERMISSIONS.PROJECT_CREATE,
  )
  const [filters, setFilters] =
    useState<ProjectFilterState>({
      search: '',
      status: 'ALL',
      clientId: 'ALL',
    })

  const [view, setView] = useState<'grid' | 'table'>('grid')

  const {
    projects,
    loading,
    error,
    refetch,
  } = useProjects()

  const {
    clients,
    loading: clientsLoading,
  } = useClients()

  const filteredProjects = useMemo(() => {
    const search = filters.search?.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search) ||
        project.description
          ?.toLowerCase()
          .includes(search)

      const matchesStatus =
        !filters.status ||
        filters.status === 'ALL' ||
        project.status === filters.status

      const matchesClient =
        !filters.clientId ||
        filters.clientId === 'ALL' ||
        project.client_id === filters.clientId

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClient
      )
    })
  }, [projects, filters])

  return (
  <div className="space-y-6">
    <ProjectHeader
      title="Projects"
      description="Manage your construction projects, delivery status, milestones, and teams."
      actionLabel={
        canCreateProject
          ? 'New project'
          : undefined
      }
      actionTo={
        canCreateProject
          ? '/projects/new'
          : undefined
      }
    />

      <ProjectMetrics projects={projects} />

      <ProjectFilters
        filters={filters}
        clients={clients}
        onChange={setFilters}
      />

      <div className="flex items-center justify-between">
        <div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading projects...
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {filteredProjects.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700">
                {projects.length}
              </span>{' '}
              projects
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`rounded-md p-2 ${
              view === 'grid'
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setView('table')}
            className={`rounded-md p-2 ${
              view === 'table'
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400'
            }`}
            title="Table view"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => void refetch()}
            className="ml-1 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-800">
            Unable to load projects
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : loading || clientsLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : !filteredProjects.length ? (
        <EmptyProjectsState
          filtered={
            projects.length > 0
          }
          onClearFilters={() =>
            setFilters({
              search: '',
              status: 'ALL',
              clientId: 'ALL',
            })
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              client={
                clients.find(
                  (client) =>
                    client.id === project.client_id,
                ) ?? null
              }
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          clients={clients}
        />
      )}
    </div>
  )
}