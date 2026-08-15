import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import LoginPage from '@/modules/auth/LoginPage'
import RegisterPage from '@/modules/auth/RegisterPage'
import ForgotPasswordPage from '@/modules/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/modules/auth/ResetPasswordPage'
import DashboardPage from '@/modules/dashboard/DashboardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])