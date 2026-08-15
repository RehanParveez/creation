import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Building2, Users, TrendingUp, AlertCircle, ArrowUpRight, Clock, CheckCircle2,
} from 'lucide-react'
import { useAuthStore } from '@/app/store'
import { api } from '@/services/api'

export default function DashboardPage() {
  const { organization, user, setOrganization, setOrganizations } = useAuthStore()

  useEffect(() => {
    const load = async () => {
      try {
        const orgs = await api.getMyOrganizations()
        setOrganizations(orgs)

        if (orgs.length > 0 && !organization) {
          setOrganization(orgs[0])
          localStorage.setItem('current_org_id', orgs[0].id)
        }
      } catch {}
    }

    load()
  }, [])

  const stats = [
    {
      label: 'Active Projects',
      value: '0',
      icon: Building2,
    },
    {
      label: 'Team Members',
      value: '1',
      icon: Users,
    },
    {
      label: 'Budget Utilized',
      value: 'PKR 0',
      icon: TrendingUp,
    },
    {
      label: 'Pending Actions',
      value: '0',
      icon: AlertCircle,
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8890c]">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#171717]">
            Welcome back, {user?.full_name?.split(' ')[0]}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#737373]">
            Monitor your construction workspace and keep project operations moving.
          </p>
        </div>

        {organization && (
          <div className="rounded-xl border border-[#deded9] bg-white px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#999]">
              Organization
            </div>
            <div className="mt-1 text-sm font-semibold text-[#262626]">
              {organization.name}
            </div>
          </div>
        )}
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[#deded9] bg-white p-5 shadow-[0_5px_20px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f2]">
                  <Icon className="h-[18px] w-[18px] text-[#555]" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-[#c7c7c2] transition group-hover:text-[#e8890c]" />
              </div>

              <div className="mt-7">
                <p className="text-2xl font-semibold tracking-[-0.03em] text-[#171717]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#888]">
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        <div className="rounded-2xl border border-[#deded9] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#999]">
                Workflow
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#222]">
                Project operations
              </h2>
              <p className="mt-1 text-sm text-[#888]">
                Start with the core actions in your construction workflow.
              </p>
            </div>

            <span className="hidden rounded-full bg-[#f5f5f2] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#777] sm:inline-flex">
              Workspace
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/projects/new"
              className="group rounded-xl border border-[#e4e4df] bg-[#fafaf8] p-4 transition hover:border-[#e8890c]/40 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4e5]">
                  <Building2 className="h-5 w-5 text-[#d77a05]" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#bbb] transition group-hover:text-[#e8890c]" />
              </div>

              <p className="mt-5 text-sm font-semibold text-[#222]">
                New Project
              </p>
              <p className="mt-1 text-xs leading-5 text-[#888]">
                Create a construction project and begin project control.
              </p>
            </Link>

            <Link
              to="/team"
              className="group rounded-xl border border-[#e4e4df] bg-[#fafaf8] p-4 transition hover:border-[#e8890c]/40 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5f3]">
                  <Users className="h-5 w-5 text-[#47735d]" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#bbb] transition group-hover:text-[#e8890c]" />
              </div>

              <p className="mt-5 text-sm font-semibold text-[#222]">
                Invite Team
              </p>
              <p className="mt-1 text-xs leading-5 text-[#888]">
                Add people to your organization and assign access.
              </p>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#deded9] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#999]">
            Platform
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#222]">
            System status
          </h2>

          <div className="mt-6 divide-y divide-[#eeeeea]">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-[#333]">API Service</span>
              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-[#333]">Database</span>
              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between py-3 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff7e8]">
                  <Clock className="h-4 w-4 text-[#d77a05]" />
                </div>
                <span className="text-sm font-medium text-[#333]">Last Sync</span>
              </div>

              <span className="text-xs font-medium text-[#999]">
                Just now
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#deded9] bg-[#171717] p-6 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8890c]">
              BuildTrack workflow
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em]">
              One connected construction-control system
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Projects connect your budget, progress, materials, procurement,
              delivery and expenses into one operational picture.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-white/45">
            <span className="rounded-full border border-white/10 px-3 py-2">
              Budget
            </span>
            <span className="text-white/20">→</span>
            <span className="rounded-full border border-white/10 px-3 py-2">
              Progress
            </span>
            <span className="text-white/20">→</span>
            <span className="rounded-full border border-white/10 px-3 py-2">
              Procurement
            </span>
            <span className="hidden text-white/20 md:inline">→</span>
            <span className="hidden rounded-full border border-white/10 px-3 py-2 md:inline">
              Cost
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}