import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrganizations } from '../hooks/useOrganizations'
import { Building2, Plus, ArrowRight, ShieldCheck, Globe, Calendar } from 'lucide-react'

export default function OrganizationsPage() {
  const navigate = useNavigate()
  const { organizations, loading, fetchMyOrganizations, switchOrganization } = useOrganizations()

  useEffect(() => {
    fetchMyOrganizations()
  }, [fetchMyOrganizations])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-amber-500" />
            Organization Workspaces
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your construction entities, switch operational environments, and control active tenant parameters.
          </p>
        </div>
        <button
          onClick={() => navigate('/organizations/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          Create Organization
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800">
          <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">No organizations found</h3>
          <p className="text-sm text-zinc-500 mt-1 mb-6">Get started by creating your first construction workspace.</p>
          <button
            onClick={() => navigate('/organizations/new')}
            className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => {
            const isCurrent = localStorage.getItem('current_org_id') === org.id
            return (
              <div
                key={org.id}
                className={`relative rounded-xl bg-zinc-900/70 border transition-all duration-200 flex flex-col justify-between p-6 ${
                  isCurrent ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 font-bold">
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Active Workspace
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {org.currency}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">{org.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono mb-4">Slug: {org.slug}</p>

                  <div className="space-y-2 text-xs text-zinc-400 mb-6">
                    {org.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="truncate">{org.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Created {new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/organizations/${org.id}`)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    View Settings
                  </button>
                  {!isCurrent && (
                    <button
                      onClick={() => switchOrganization(org.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700"
                    >
                      Switch <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}