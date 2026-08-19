import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { Membership, Role } from '../types'
import { Users, UserPlus, ArrowLeft, Shield, Mail, CheckCircle2 } from 'lucide-react'

export default function TeamPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()
  const [members, setMembers] = useState<Membership[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRoleId, setInviteRoleId] = useState('')
  const [inviteFullName, setInviteFullName] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  useEffect(() => {
    if (orgId) {
      Promise.all([
        api.getMembers(orgId),
        api.getRoles(orgId)
      ])
        .then(([mRes, rRes]) => {
          setMembers(mRes)
          setRoles(rRes)
          if (rRes.length > 0) setInviteRoleId(rRes[0].id)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orgId])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) return
    setInviting(true)
    try {
      await api.inviteMember(orgId, inviteEmail, inviteRoleId, inviteFullName)
      setInviteSuccess(true)
      setTimeout(() => {
        setShowInviteModal(false)
        setInviteSuccess(false)
        setInviteEmail('')
        setInviteFullName('')
      }, 1500)
    } catch {

    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/organizations/${orgId}`)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-500" />
              Workspace Team & Access Control
            </h1>
            <p className="text-sm text-zinc-400">Manage member allocations, roles, and project permissions.</p>
          </div>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/10"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-zinc-500">Loading team directory...</div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Assigned Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-zinc-200">{m.user?.first_name} {m.user?.last_name}</div>
                    <div className="text-xs text-zinc-500">{m.user?.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-amber-400 border border-zinc-700">
                      <Shield className="w-3.5 h-3.5" />
                      {m.role?.name || 'Standard Member'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      m.user?.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {m.user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-400 text-xs">
                    {new Date(m.joined_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                Invite Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-zinc-100 font-semibold">Invitation Sent Successfully!</h4>
                <p className="text-xs text-zinc-400">The candidate has been notified via email.</p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={inviteFullName}
                    onChange={(e) => setInviteFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Assign Role *</label>
                  <select
                    value={inviteRoleId}
                    onChange={(e) => setInviteRoleId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}