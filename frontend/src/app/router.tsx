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
import {ProjectsPage, CreateProjectPage, ProjectDetailsPage, ClientsPage, ProjectClientsPage,
} from '@/modules/projects'
import {SiteLogsPage, SiteLogDetailPage,
} from "@/modules/site_operations";
import {MaterialRequisitionsPage, MaterialRequisitionCreatePage, MaterialRequisitionDetailsPage,
} from '@/modules/materials_requests'
import { SettingsPage } from '@/modules/settings'

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
            path: '/settings',
            element: <SettingsPage />,
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
            element: <ProjectsPage />,
          },

          {
            path: '/projects/new',
            element: <CreateProjectPage />,
          },
          {
            path: '/projects/:projectId',
            element: <ProjectDetailsPage />,
          },
          {
            path: '/projects/:projectId/client',
            element: <ProjectClientsPage />,
          },

          {
            path: '/projects/:projectId/site-logs',
            element: <SiteLogsPage />,
          },

          { 
            path: '/projects/:projectId/site-logs/:siteLogId',
            element: <SiteLogDetailPage />,
          },

          {
            path: '/clients',
            element: <ClientsPage />,
          },

          { 
            path: '/projects/:projectId/material-requisitions',
            element: <MaterialRequisitionsPage />,
          },

          {
            path: '/projects/:projectId/material-requisitions/new',
            element: <MaterialRequisitionCreatePage />,
          },

          {
            path: '/projects/:projectId/material-requisitions/:requisitionId',
            element: <MaterialRequisitionDetailsPage />,
          },

          {
            path: '/material-requisitions',
            element: <MaterialRequisitionsPage />,
          },

          {
            path: '/material-requisitions/:requisitionId',
            element: <MaterialRequisitionDetailsPage />,
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