import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/app/store'

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}