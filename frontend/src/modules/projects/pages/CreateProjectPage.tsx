import { useEffect, useState } from 'react'
import {ArrowLeft, Building2, CalendarDays, FileText, Loader2,
} from 'lucide-react'
import { Link, useNavigate, Navigate, } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useClients } from '../hooks/useClients'
import type {ProjectCreateInput, ProjectStatus,
} from '../types'
import { useAuthStore } from '@/app/store'
import { PROJECT_PERMISSIONS } from '@/modules/projects/permissions'


const initialForm: ProjectCreateInput = {name: '', description: '', client_id: null, status: 'DRAFT', start_date: null, end_date: null,
}

export default function CreateProjectPage() {
  const permissions = useAuthStore((state) => state.permissions)

  const canCreateProject = permissions.includes(
    PROJECT_PERMISSIONS.PROJECT_CREATE,
  )

  if (!canCreateProject) {
    return <Navigate to="/projects" replace />
  }
  const navigate = useNavigate()

  const { createProject } = useProjects()
  const {
    clients,
    loading: clientsLoading,
  } = useClients()

  const [form, setForm] =
    useState<ProjectCreateInput>(initialForm)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm((current) => ({
      ...current,
      client_id: current.client_id ?? null,
    }))
  }, [])

  const updateField = <
    K extends keyof ProjectCreateInput,
  >(
    field: K,
    value: ProjectCreateInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Project name is required.')
      return
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setError(
        'End date cannot be earlier than the start date.',
      )
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const project = await createProject({
        ...form,
        name: form.name.trim(),
        description:
          form.description?.trim() || null,
      })

      navigate(`/projects/${project.id}`)
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Unable to create project.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-900 px-6 py-7 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Project setup
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Create a new project
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Set up the project foundation. You can add milestones
            and project members after creation.
          </p>
        </div>

        <form onSubmit={submit} className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Project name
              </label>

              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Downtown Commercial Tower"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={form.description ?? ''}
                onChange={(event) =>
                  updateField(
                    'description',
                    event.target.value,
                  )
                }
                rows={5}
                placeholder="Describe the scope, delivery objectives, or major works..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Client
              </label>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={form.client_id ?? ''}
                  disabled={clientsLoading}
                  onChange={(event) =>
                    updateField(
                      'client_id',
                      event.target.value || null,
                    )
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">
                    No client assigned
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Initial status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    'status',
                    event.target.value as ProjectStatus,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Start date
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={form.start_date ?? ''}
                  onChange={(event) =>
                    updateField(
                      'start_date',
                      event.target.value || null,
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                End date
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={form.end_date ?? ''}
                  onChange={(event) =>
                    updateField(
                      'end_date',
                      event.target.value || null,
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/projects"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}