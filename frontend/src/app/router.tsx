import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import LoginPage from '@/modules/auth/pages/LoginPage'
import RegisterPage from '@/modules/auth/pages/RegisterPage'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage'
import DashboardPage from '@/modules/dashboard/DashboardPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PublicRoute from '@/components/auth/PublicRoute'
import OrganizationsPage from '@/modules/organizations/pages/OrganizationsPage'
import CreateOrganizationPage from '@/modules/organizations/pages/CreateOrganizationPage'
import OrganizationDetailsPage from '@/modules/organizations/pages/OrganizationDetailsPage'
import TeamPage from '@/modules/organizations/pages/TeamPage'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: '/reset-password',
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/organizations',
            element: <OrganizationsPage />,
          },
          {
            path: '/organizations/new',
            element: <CreateOrganizationPage />,
          },
          {
            path: '/organizations/:orgId',
            element: <OrganizationDetailsPage />,
          },
          {
            path: '/organizations/:orgId/team',
            element: <TeamPage />,
          },
          {
            path: '/team',
            element: <TeamPage />,
          },

          { 
            path: '/projects', 
            element: <div className="p-6 text-zinc-100">Projects Module Coming Soon</div>
          },
          { 
            path: '/settings', 
            element: <div className="p-6 text-zinc-100">Settings Module Coming Soon</div>
          },

          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
])