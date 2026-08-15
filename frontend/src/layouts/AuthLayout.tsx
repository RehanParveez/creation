import { Outlet } from 'react-router-dom'
import { HardHat, ShieldCheck, BarChart3, ClipboardCheck } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#171717] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#151515] lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#151515_0%,#202020_55%,#111111_100%)]" />
        <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-12 py-10 xl:px-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8890c]">
                <HardHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight text-white">BuildTrack</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Construction Control
                </div>
              </div>
            </div>

            <div className="mt-24 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8890c]">
                Project control platform
              </p>

              <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white xl:text-6xl">
                Keep every project,
                <br />
                budget and delivery
                <br />
                under control.
              </h2>

              <p className="mt-7 max-w-lg text-base leading-7 text-white/55">
                Connect approved budgets, physical progress, materials, procurement,
                receipts and expenses in one operational workspace.
              </p>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-3 gap-3">
              <div className="border-l border-white/10 pl-4">
                <BarChart3 className="h-5 w-5 text-[#e8890c]" />
                <p className="mt-3 text-sm font-medium text-white">Project visibility</p>
                <p className="mt-1 text-xs leading-5 text-white/40">Cost and progress in context.</p>
              </div>

              <div className="border-l border-white/10 pl-4">
                <ClipboardCheck className="h-5 w-5 text-[#e8890c]" />
                <p className="mt-3 text-sm font-medium text-white">Workflow control</p>
                <p className="mt-1 text-xs leading-5 text-white/40">Approvals from request to receipt.</p>
              </div>

              <div className="border-l border-white/10 pl-4">
                <ShieldCheck className="h-5 w-5 text-[#e8890c]" />
                <p className="mt-3 text-sm font-medium text-white">Account security</p>
                <p className="mt-1 text-xs leading-5 text-white/40">Organization-aware access control.</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30">
            Construction operations · Budget · Procurement · Progress
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8890c]">
              <HardHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold tracking-tight">BuildTrack</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                Construction Control
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </section>
    </div>
  )
}