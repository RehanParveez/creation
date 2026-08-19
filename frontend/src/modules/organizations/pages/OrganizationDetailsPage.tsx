import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { Organization } from '../types'
import { Building2, ArrowLeft, Settings, Users } from 'lucide-react'

export default function OrganizationDetailsPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'settings' | 'team'>('settings')

  useEffect(() => {
    if (orgId) {
      api.getOrganization(orgId)
        .then((data) => setOrg(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orgId])

  if (loading) {
    return <div className="h-96 flex items-center justify-center text-zinc-500">Loading organization profile...</div>
  }

  if (!org) {
    return <div className="text-center py-16 text-zinc-400">Organization profile not found.</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/organizations')}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-amber-500" />
              {org.name}
            </h1>
            <p className="text-sm text-zinc-400 font-mono">Workspace ID: {org.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'settings' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
          <button
            onClick={() => navigate(`/organizations/${orgId}/team`)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5" /> Team & Roles
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 border-b border-zinc-800 pb-4">Configuration Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Name</label>
            <input
              type="text"
              value={org.name}
              disabled
              className="w-full px-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-zinc-300 text-sm opacity-80 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Slug</label>
            <input
              type="text"
              value={org.slug}
              disabled
              className="w-full px-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-zinc-300 text-sm font-mono opacity-80 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Currency</label>
            <input
              type="text"
              value={org.currency}
              disabled
              className="w-full px-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-zinc-300 text-sm opacity-80 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Timezone</label>
            <input
              type="text"
              value={org.timezone}
              disabled
              className="w-full px-3.5 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-zinc-300 text-sm opacity-80 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}