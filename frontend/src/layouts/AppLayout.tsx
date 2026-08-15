import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {LayoutDashboard, HardHat, Building2, Users, Settings, ChevronDown, LogOut, Menu, Bell,
} from 'lucide-react'
import { useAuthStore } from '@/app/store'
import { api } from '@/services/api'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: HardHat },
  { path: '/organizations', label: 'Organization', icon: Building2 },
  { path: '/team', label: 'Team', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, organization, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    api.logout()
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#171717]">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[#deded9] bg-[#191919] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8890c]">
              <HardHat className="h-4.5 w-4.5 text-white" />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight text-white">
                BuildTrack
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Construction Control
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Workspace
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#e8890c] text-white'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-[17px] w-[17px] ${
                      isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                    }`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {organization && (
          <div className="border-t border-white/10 p-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Current organization
              </div>

              <div className="truncate text-sm font-semibold text-white">
                {organization.name}
              </div>

              <div className="mt-1 text-xs text-white/35">
                {organization.currency} · {organization.timezone}
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#deded9] bg-[#f5f5f2]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#deded9] bg-white p-2.5 text-[#555] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="hidden sm:block">
              <div className="text-xs font-medium text-[#999]">
                {organization?.name || 'Workspace'}
              </div>
              <div className="text-sm font-semibold text-[#262626]">
                Construction Control
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative rounded-xl border border-[#deded9] bg-white p-2.5 text-[#666] transition hover:border-[#cfcfc9] hover:text-[#222]">
              <Bell className="h-[17px] w-[17px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e8890c]" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#deded9] bg-white px-2 py-1.5 transition hover:border-[#cfcfc9]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] text-xs font-bold text-white">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[140px] truncate text-xs font-semibold text-[#262626]">
                    {user?.full_name}
                  </p>
                  <p className="max-w-[140px] truncate text-[10px] text-[#999]">
                    {user?.email}
                  </p>
                </div>

                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#999] transition-transform ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <>
                  <button
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#deded9] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-[#eeeeea] p-4">
                      <p className="truncate text-sm font-semibold text-[#222]">
                        {user?.full_name}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#999]">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}