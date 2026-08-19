import {ArrowLeft, Building2, Mail, Phone,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useProject } from '../hooks/useProject'
import { useClients } from '../hooks/useClients'
import { ProjectHeader } from '../components/ProjectHeader'

export default function ProjectClientsPage() {
  const { projectId } = useParams()

  const {
    project,
    loading: projectLoading,
  } = useProject(projectId)

  const {
    clients,
    loading: clientsLoading,
  } = useClients()

  if (projectLoading || clientsLoading) {
    return (
      <div className="space-y-5">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Project not found.
      </div>
    )
  }

  const client = clients.find(
    (item) => item.id === project.client_id,
  )

  return (
    <div className="space-y-6">
      <ProjectHeader
        title="Project client"
        description={`Client information associated with ${project.name}.`}
        backTo={`/projects/${project.id}`}
        backLabel="Back to project"
      />

      {!client ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Building2 className="mx-auto h-8 w-8 text-slate-300" />

          <h3 className="mt-4 font-semibold text-slate-800">
            No client assigned
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            This project currently does not have a client associated
            with it.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Current client
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {client.name}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            {client.email && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {client.email}
                </span>
              </div>
            )}

            {client.phone && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {client.phone}
                </span>
              </div>
            )}

            {client.address && (
              <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                {client.address}
              </div>
            )}
          </div>
        </div>
      )}

      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </Link>
    </div>
  )
}