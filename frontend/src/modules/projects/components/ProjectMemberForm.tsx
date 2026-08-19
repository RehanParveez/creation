import { useState } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
import type {ProjectMemberCreateInput, ProjectRole,
} from '../types'

interface ProjectMemberFormProps {
  onSubmit: (
    input: ProjectMemberCreateInput,
  ) => Promise<unknown>
  loading?: boolean
}

export function ProjectMemberForm({
  onSubmit,
  loading = false,
}: ProjectMemberFormProps) {
  const [userId, setUserId] = useState('')
  const [role, setRole] =
    useState<ProjectRole>('VIEWER')
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!userId.trim()) {
      setError('User ID is required.')
      return
    }

    setError('')

    try {
      await onSubmit({
        user_id: userId.trim(),
        role,
      })

      setUserId('')
      setRole('VIEWER')
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          'Unable to add this project member.',
      )
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_160px_auto] sm:items-end">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            User ID
          </label>

          <input
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            placeholder="Enter organization user ID"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as ProjectRole)
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="MANAGER">Manager</option>
            <option value="ENGINEER">Engineer</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Add
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </form>
  )
}