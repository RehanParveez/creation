import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  HardHat,
  PackageCheck,
  ReceiptText,
  Truck,
  Users,
} from 'lucide-react'

import { useAuthStore } from '@/app/store'
import { api } from '@/services/api'

const PROJECT_IMAGE = '/images/construction-dashboard-preview.png'

const projects = [
  {
    name: 'Gulshan Tower',
    code: 'PROJECT / 001',
    type: 'Commercial development',
    phase: 'Structure',
    progress: 68,
    budget: 'PKR 386M',
    spent: 'PKR 292M',
    status: 'On track',
  },
  {
    name: 'M120 Riverside',
    code: 'PROJECT / 002',
    type: 'Modular residential',
    phase: 'Installation',
    progress: 78,
    budget: 'PKR 240M',
    spent: 'PKR 186M',
    status: 'On schedule',
  },
  {
    name: 'Northline Residence',
    code: 'PROJECT / 003',
    type: 'Residential build',
    phase: 'Finishes',
    progress: 64,
    budget: 'PKR 175M',
    spent: 'PKR 118M',
    status: 'In progress',
  },
]

export default function DashboardPage() {
  const {
    organization,
    user,
    setOrganization,
    setOrganizations,
  } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const orgs = await api.getMyOrganizations()

        if (!mounted) return

        setOrganizations(orgs)

        if (orgs.length > 0 && !organization) {
          setOrganization(orgs[0])
          localStorage.setItem('current_org_id', orgs[0].id)
        }
      } catch {
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [organization, setOrganization, setOrganizations])

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="mx-auto w-full max-w-[1420px] pb-12">
      <header className="mb-8 border-b border-[#dce5d8] pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#8e9b8b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#82a86d]" />
              Control room
              <span className="text-[#c3ccc0]">/</span>
              Overview
            </div>

            <h1 className="max-w-[760px] text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#293429] sm:text-[44px]">
              Good morning, {firstName}.
            </h1>

            <p className="mt-3 max-w-[650px] text-[13px] leading-6 text-[#849183]">
              One operational picture for your construction work —
              budget, physical progress, procurement, materials and site activity.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/projects"
              className="group inline-flex h-10 items-center gap-2 border border-[#d5e0d1] bg-white/60 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#71806d] transition hover:bg-white hover:text-[#43523f]"
            >
              All projects
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/projects/new"
              className="inline-flex h-10 items-center gap-2 bg-[#202820] px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#edf5e9] transition hover:bg-[#344333]"
            >
              <Building2 className="h-3.5 w-3.5" />
              New project
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border border-[#d8e3d4] bg-[#fbfcf8]">
        <GridOverlay />

        <div className="pointer-events-none absolute right-0 top-0 h-full w-[44%] overflow-hidden">
          <img
            src={PROJECT_IMAGE}
            alt=""
            className="h-full w-full object-cover opacity-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcf8] via-[#fbfcf8]/80 to-[#fbfcf8]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfcf8] via-transparent to-[#fbfcf8]/10" />
        </div>

        <div className="relative z-10 p-5 sm:p-7 lg:p-9">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-[760px]">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#71955f]">
                  Active project
                </span>
                <span className="h-px w-8 bg-[#82a86d]/50" />
                <span className="font-mono text-[8px] tracking-[0.16em] text-[#a2aea0]">
                  PROJECT / 001
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[30px] font-semibold leading-none tracking-[-0.055em] text-[#303c2e] sm:text-[38px]">
                  Gulshan Tower
                </h2>

                <span className="inline-flex items-center gap-1.5 border border-[#cfe2c6] bg-[#edf6e9] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#6f955d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#83a96e]" />
                  On track
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-[#849183]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#a2aea0]" />
                  Commercial development
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#a2aea0]" />
                  Current phase · Structure
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#a2aea0]" />
                  Updated 2h ago
                </span>
              </div>
            </div>

            <Link
              to="/projects"
              className="group inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#819080] transition hover:text-[#43523f]"
            >
              Open project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-1 border-y border-[#dce6d8] sm:grid-cols-3">
            <MetricBlock label="Contract value" value="PKR 420M" />
            <MetricBlock label="Approved budget" value="PKR 386M" bordered />
            <MetricBlock label="Remaining" value="PKR 94M" accent bordered />
          </div>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
            <ProgressPanel
              title="Cost consumption"
              value="77%"
              detail="PKR 292M consumed of PKR 386M approved"
              progress={77}
              tone="accent"
            />
            <ProgressPanel
              title="Physical progress"
              value="68%"
              detail="Site execution against approved programme"
              progress={68}
              tone="neutral"
            />
          </div>
        </div>
      </section>

      <section className="mt-4 grid border border-[#d8e3d4] bg-[#fbfcf8] lg:grid-cols-4">
        <OperationalMetric
          label="Material requests"
          value="06"
          meta="Awaiting approval"
          icon={PackageCheck}
        />
        <OperationalMetric
          label="Purchase orders"
          value="03"
          meta="In workflow"
          icon={ReceiptText}
          bordered
        />
        <OperationalMetric
          label="Deliveries"
          value="12"
          meta="This reporting period"
          icon={Truck}
          bordered
        />
        <OperationalMetric
          label="Site issues"
          value="01"
          meta="Needs attention"
          icon={AlertTriangle}
          bordered
          warning
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="overflow-hidden border border-[#d8e3d4] bg-[#fbfcf8]">
          <SectionHeader
            eyebrow="Portfolio"
            title="Active projects"
            action="View all"
            href="/projects"
          />

          <div className="divide-y divide-[#e3e9df]">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.code}
                project={project}
                index={String(index + 1).padStart(2, '0')}
              />
            ))}
          </div>
        </section>

        <section className="overflow-hidden border border-[#d8e3d4] bg-[#fbfcf8]">
          <SectionHeader
            eyebrow="Activity"
            title="Recent operations"
          />

          <div className="divide-y divide-[#e3e9df]">
            <ActivityRow
              index="01"
              icon={FileCheck2}
              title="Budget revision approved"
              description="Gulshan Tower · structural package"
              time="2h ago"
              status="Approved"
            />
            <ActivityRow
              index="02"
              icon={CheckCircle2}
              title="Progress report submitted"
              description="M120 Riverside · 68% complete"
              time="5h ago"
              status="Approved"
            />
            <ActivityRow
              index="03"
              icon={ReceiptText}
              title="Purchase order sent"
              description="PO-1042 · Al-Fateh Steel Traders"
              time="Yesterday"
              status="Sent"
            />
            <ActivityRow
              index="04"
              icon={Truck}
              title="Delivery exception flagged"
              description="Cement shipment · supplier delay"
              time="Yesterday"
              status="Attention"
              warning
            />
          </div>
        </section>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-[#d8e3d4] bg-[#fbfcf8] p-5 sm:p-6">
          <SectionHeader
            eyebrow="Control queue"
            title="Requires attention"
          />

          <div className="mt-2">
            <AttentionItem
              number="06"
              title="Material requests"
              description="Requests waiting for approval"
              icon={PackageCheck}
              href="/projects"
            />
            <AttentionItem
              number="03"
              title="Purchase orders"
              description="Orders moving through workflow"
              icon={ReceiptText}
              href="/projects"
            />
            <AttentionItem
              number="01"
              title="Delivery exception"
              description="Supplier delay requires review"
              icon={Truck}
              href="/projects"
              warning
              last
            />
          </div>
        </section>

        <section className="border border-[#d8e3d4] bg-[#fbfcf8] p-5 sm:p-6">
          <SectionHeader
            eyebrow="Organization"
            title="Workspace overview"
            action="Manage"
            href="/team"
          />

          <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9aa598]">
                Current organization
              </p>

              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.035em] text-[#3d493b]">
                {organization?.name || 'Your organization'}
              </h3>

              <p className="mt-1 text-[11px] text-[#8d998b]">
                {organization?.currency || 'PKR'} ·{' '}
                {organization?.timezone || 'Local workspace'}
              </p>
            </div>

            <div className="grid grid-cols-2 border-y border-[#e3e9df] sm:border-y-0 sm:border-l sm:pl-6">
              <SmallMetric label="Team" value="01" icon={Users} />
              <SmallMetric label="Projects" value="03" icon={HardHat} bordered />
            </div>
          </div>
        </section>
      </section>

      <section className="mt-4 border border-[#d8e3d4] bg-[#fbfcf8] p-5 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9aa598]">
              System health
            </p>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.025em] text-[#3d493b]">
              Operational status
            </h3>
          </div>

          <div className="grid w-full max-w-[600px] grid-cols-1 gap-3 sm:grid-cols-3">
            <HealthRow label="API service" value="Operational" />
            <HealthRow label="Database" value="Operational" />
            <HealthRow label="Last sync" value="Just now" muted />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-[#e3e9df] pt-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#83a96e]" />
          <span className="text-[10px] font-medium text-[#8d998b]">
            All core services responding normally.
          </span>
        </div>
      </section>

      <footer className="mt-8 flex flex-col gap-2 border-t border-[#dce6d8] pt-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a0aaa0] sm:flex-row sm:items-center sm:justify-between">
        <span>{organization?.name || 'Construction workspace'}</span>
        <span>Budget · Progress · Materials · Procurement · Delivery · Expenses</span>
      </footer>
    </div>
  )
}

function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.45]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(110,135,102,.075) 1px, transparent 1px),
          linear-gradient(90deg, rgba(110,135,102,.075) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }}
    />
  )
}

function MetricBlock({
  label,
  value,
  accent = false,
  bordered = false,
}: {
  label: string
  value: string
  accent?: boolean
  bordered?: boolean
}) {
  return (
    <div
      className={[
        'py-5 sm:py-6',
        bordered ? 'border-t border-[#dce6d8] sm:border-l sm:border-t-0 sm:pl-6' : '',
      ].join(' ')}
    >
      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa598]">
        {label}
      </p>
      <p
        className={[
          'mt-2 font-mono text-[24px] font-semibold tracking-[-0.04em]',
          accent ? 'text-[#71955f]' : 'text-[#344233]',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  )
}

function ProgressPanel({
  title,
  value,
  detail,
  progress,
  tone,
}: {
  title: string
  value: string
  detail: string
  progress: number
  tone: 'accent' | 'neutral'
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa598]">
            {title}
          </p>
          <p className="mt-1 text-[10px] text-[#899687]">{detail}</p>
        </div>

        <span
          className={[
            'font-mono text-[17px] font-semibold',
            tone === 'accent' ? 'text-[#71955f]' : 'text-[#536351]',
          ].join(' ')}
        >
          {value}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden bg-[#e1e9df]">
        <div
          className={[
            'h-full',
            tone === 'accent' ? 'bg-[#82a86d]' : 'bg-[#aebdaa]',
          ].join(' ')}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[7px] font-semibold uppercase tracking-[0.15em] text-[#a5afa3]">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

function OperationalMetric({
  label,
  value,
  meta,
  icon: Icon,
  bordered = false,
  warning = false,
}: {
  label: string
  value: string
  meta: string
  icon: typeof PackageCheck
  bordered?: boolean
  warning?: boolean
}) {
  return (
    <div
      className={[
        'group p-5 transition hover:bg-white/60 sm:p-6',
        bordered ? 'border-t border-[#e3e9df] lg:border-l lg:border-t-0' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#9aa598]">
          {label}
        </span>
        <Icon
          className={[
            'h-4 w-4',
            warning ? 'text-[#a68a50]' : 'text-[#9aab96]',
          ].join(' ')}
        />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="font-mono text-[28px] font-semibold leading-none tracking-[-0.05em] text-[#43503f]">
          {value}
        </span>
        <span
          className={[
            'text-right text-[9px]',
            warning ? 'text-[#a68a50]' : 'text-[#8e9b8b]',
          ].join(' ')}
        >
          {meta}
        </span>
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  action,
  href,
}: {
  eyebrow: string
  title: string
  action?: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between border-b border-[#e3e9df] px-5 py-4 sm:px-6">
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#9aa598]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-[#43503f]">
          {title}
        </h2>
      </div>

      {action && href && (
        <Link
          to={href}
          className="group inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9aa598] transition hover:text-[#536351]"
        >
          {action}
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[number]
  index: string
}) {
  return (
    <Link
      to="/projects"
      className="group grid gap-4 px-5 py-5 transition hover:bg-white/60 sm:grid-cols-[32px_1fr_160px_120px] sm:items-center sm:px-6"
    >
      <span className="font-mono text-[8px] text-[#b2bcb0]">{index}</span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-[12px] font-semibold text-[#43503f]">
            {project.name}
          </h3>
          <span className="border border-[#dce7d8] bg-[#f3f8f0] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-[#71955f]">
            {project.status}
          </span>
        </div>

        <p className="mt-1 text-[9px] text-[#98a397]">
          {project.type} · {project.phase}
        </p>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaa0]">
            Progress
          </span>
          <span className="font-mono text-[10px] font-semibold text-[#536351]">
            {project.progress}%
          </span>
        </div>

        <div className="h-1 overflow-hidden bg-[#e3e9df]">
          <div
            className="h-full bg-[#82a86d]"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="font-mono text-[10px] font-semibold text-[#536351]">
          {project.spent}
        </p>
        <p className="mt-1 text-[7px] uppercase tracking-[0.12em] text-[#a0aaa0]">
          of {project.budget}
        </p>
      </div>

      <ChevronRight className="hidden h-3.5 w-3.5 text-[#b0bab0] transition group-hover:translate-x-0.5 group-hover:text-[#71806d] sm:block" />
    </Link>
  )
}

function ActivityRow({
  index,
  icon: Icon,
  title,
  description,
  time,
  status,
  warning = false,
}: {
  index: string
  icon: typeof PackageCheck
  title: string
  description: string
  time: string
  status: string
  warning?: boolean
}) {
  return (
    <div className="group flex items-center gap-3 px-5 py-4 transition hover:bg-white/55 sm:px-6">
      <span className="hidden w-4 font-mono text-[8px] text-[#b2bcb0] sm:block">
        {index}
      </span>

      <div
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center border',
          warning
            ? 'border-[#e4d8b9] bg-[#faf5e7]'
            : 'border-[#e2e9df] bg-[#f4f8f1]',
        ].join(' ')}
      >
        <Icon
          className={[
            'h-3.5 w-3.5',
            warning ? 'text-[#a68a50]' : 'text-[#819b78]',
          ].join(' ')}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold text-[#43503f]">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[8px] text-[#94a091]">
          {description}
        </p>
      </div>

      <div className="hidden text-right sm:block">
        <p
          className={[
            'text-[8px] font-bold uppercase tracking-[0.1em]',
            warning ? 'text-[#a68a50]' : 'text-[#91a08d]',
          ].join(' ')}
        >
          {status}
        </p>
        <p className="mt-0.5 text-[8px] text-[#a4aea2]">{time}</p>
      </div>

      <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#b2bcb0] sm:hidden" />
    </div>
  )
}

function AttentionItem({
  number,
  title,
  description,
  icon: Icon,
  href,
  warning = false,
  last = false,
}: {
  number: string
  title: string
  description: string
  icon: typeof PackageCheck
  href: string
  warning?: boolean
  last?: boolean
}) {
  return (
    <Link
      to={href}
      className={[
        'relative flex gap-3 py-4 transition hover:bg-white/55',
        last ? '' : 'border-b border-[#e3e9df]',
      ].join(' ')}
    >
      <span className="w-7 shrink-0 font-mono text-[8px] text-[#b2bcb0]">
        {number}
      </span>

      <div
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center border',
          warning
            ? 'border-[#e4d8b9] bg-[#faf5e7]'
            : 'border-[#e2e9df] bg-[#f4f8f1]',
        ].join(' ')}
      >
        <Icon
          className={[
            'h-3.5 w-3.5',
            warning ? 'text-[#a68a50]' : 'text-[#819b78]',
          ].join(' ')}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-[#43503f]">{title}</p>
        <p className="mt-1 text-[8px] text-[#94a091]">{description}</p>
      </div>

      <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#b0bab0] transition group-hover:text-[#536351]" />
    </Link>
  )
}

function SmallMetric({
  label,
  value,
  icon: Icon,
  bordered = false,
}: {
  label: string
  value: string
  icon: typeof Users
  bordered?: boolean
}) {
  return (
    <div
      className={[
        'py-3',
        bordered ? 'border-l border-[#e3e9df] pl-4' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[#a0aaa0]" />
        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#9aa598]">
          {label}
        </span>
      </div>

      <p className="mt-2 font-mono text-[20px] font-semibold text-[#536351]">
        {value}
      </p>
    </div>
  )
}

function HealthRow({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="border border-[#e3e9df] bg-[#f8faf5] px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={[
              'h-1.5 w-1.5 rounded-full',
              muted ? 'bg-[#a68a50]' : 'bg-[#83a96e]',
            ].join(' ')}
          />
          <span className="text-[9px] font-medium text-[#849183]">{label}</span>
        </div>

        <span
          className={[
            'text-[7px] font-bold uppercase tracking-[0.1em]',
            muted ? 'text-[#9aa598]' : 'text-[#6f9b5e]',
          ].join(' ')}
        >
          {value}
        </span>
      </div>
    </div>
  )
}