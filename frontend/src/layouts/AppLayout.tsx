import { useEffect, useState } from 'react'
import {Bell, Building2, ChevronDown, LogOut, Menu, HardHat, LayoutDashboard, Settings, Users, X,
} from 'lucide-react'
import {Link, Outlet, useLocation, useNavigate,
} from 'react-router-dom'
import { useAuthStore } from '@/app/store'
import { api } from '@/services/api'
import BrandMark from '@/components/BrandMark'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, },
  { path: '/projects', label: 'Projects', icon: HardHat, },
  { path: '/organizations', label: 'Organization', icon: Building2, },
  { path: '/team', label: 'Team', icon: Users, },
  { path: '/settings', label: 'Settings', icon: Settings, },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, organization, logout } = useAuthStore()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    api.logout()
    logout()
    navigate('/login')
  }

  const initials =
    user?.first_name
      ?.split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase() || 'U'

  return (
    <div className="cp-app">
      <header className="cp-app-header">
        <Link to="/dashboard" className="cp-app-brand">
          <span className="cp-app-mark">
            <BrandMark size={17} />
          </span>

          <span>
            <strong>Creation</strong>
            <small>AI Construction Management</small>
          </span>
        </Link>

        <nav className="cp-app-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                isActive(location.pathname, item.path)
                  ? 'is-active'
                  : ''
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="cp-app-actions">
          <button type="button" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>

          <Link to="/settings" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Link>

          <div className="cp-profile">
            <button
              type="button"
              className="cp-profile-button"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="cp-avatar">{initials}</span>
              <span className="hidden xl:block">
                {user?.first_name || 'Account'}
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {profileOpen && (
              <div className="cp-profile-menu">
                <div className="cp-profile-meta">
                  <strong>{user?.first_name || 'Account'}</strong>
                  <span>{organization?.name || 'Workspace'}</span>
                </div>

                <Link to="/team">
                  <Users className="h-3.5 w-3.5" />
                  Team
                </Link>

                <Link to="/organizations">
                  <Building2 className="h-3.5 w-3.5" />
                  Organization
                </Link>

                <button type="button" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="cp-mobile-trigger"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Open navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {mobileOpen && (
        <div className="cp-mobile-nav">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div className="cp-app-content">
        <Outlet />
      </div>
    </div>
  )
}

function isActive(pathname: string, target: string) {
  if (target === '/dashboard') return pathname === '/dashboard'
  return pathname === target || pathname.startsWith(`${target}/`)
}