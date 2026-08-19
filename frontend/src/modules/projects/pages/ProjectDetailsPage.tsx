import { useState } from 'react'
import {AlertTriangle, CalendarDays, CheckCircle2, Loader2, Trash2, Users,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '../hooks/useProject'
import { useMilestones } from '../hooks/useMilestones'
import { useProjectMembers } from '../hooks/useProjectMembers'
import { useProjects } from '../hooks/useProjects'
import { useClients } from '../hooks/useClients'
import { ProjectHeader } from '../components/ProjectHeader'
import { ProjectStatusBadge } from '../components/ProjectStatusBadge'
import { ProjectProgress } from '../components/ProjectProgress'
import { MilestoneList } from '../components/MilestoneList'
import { MilestoneForm } from '../components/MilestoneForm'
import { ProjectMemberList } from '../components/ProjectMemberList'
import { ProjectMemberForm } from '../components/ProjectMemberForm'
import { useAuthStore } from '@/app/store'
import { PROJECT_PERMISSIONS } from '@/modules/projects/permissions'

export default function ProjectDetailsPage() {
  const permissions = useAuthStore((state) => state.permissions)
  const canDeleteProject = permissions.includes(
    PROJECT_PERMISSIONS.PROJECT_DELETE,
  )
  const { projectId } = useParams()
  const navigate = useNavigate()

  const {
    project,
    loading,
    error,
    refetch,
  } = useProject(projectId)

  const {
    milestones,
    loading: milestonesLoading,
    createMilestone,
  } = useMilestones(projectId)

  const {
    members,
    loading: membersLoading,
    addMember,
    removeMember,
  } = useProjectMembers(projectId)

  const { deleteProject } = useProjects()
  const { clients } = useClients()

  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 xl:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <AlertTriangle className="h-7 w-7 text-red-500" />

        <h2 className="mt-4 text-lg font-semibold text-red-900">
          Project unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          The project could not be loaded or no longer exists.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    )
  }

  const client = clients.find(
    (item) => item.id === project.client_id,
  )

  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === 'COMPLETED',
  ).length

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteProject(project.id)
      navigate('/projects')
    } catch {
      setDeleteError('Unable to delete this project.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ProjectHeader
        title={project.name}
        description={
          project.description ||
          'No project description provided.'
        }
        backTo="/projects"
        backLabel="Back to projects"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ProjectStatusBadge
          status={project.status}
          size="md"
        />

        {canDeleteProject && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => void handleDelete()}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:self-auto"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete project
          </button>
        )}
      </div>

      {deleteError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Delivery overview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Project execution
                </h2>
              </div>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-6">
              <ProjectProgress
                milestones={milestones}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Delivery plan
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Milestones
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {completedMilestones}/{milestones.length}
              </span>
            </div>

            <MilestoneList
              milestones={milestones}
              loading={milestonesLoading}
            />

            <div className="mt-6 border-t border-slate-100 pt-6">
              <MilestoneForm
                onSubmit={createMilestone}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Project information
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-400">
                  Client
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {client?.name ||
                    (project.client_id
                      ? 'Client unavailable'
                      : 'No client assigned')}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">
                  Start date
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  {project.start_date
                    ? new Date(
                        project.start_date,
                      ).toLocaleDateString()
                    : 'Not scheduled'}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">
                  End date
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  {project.end_date
                    ? new Date(
                        project.end_date,
                      ).toLocaleDateString()
                    : 'Not scheduled'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project team
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Members
                </h2>
              </div>

              <Users className="h-5 w-5 text-slate-400" />
            </div>

            <ProjectMemberList
              members={members}
              loading={membersLoading}
              onRemove={removeMember}
            />

            <div className="mt-5 border-t border-slate-100 pt-5">
              <ProjectMemberForm
                onSubmit={addMember}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}