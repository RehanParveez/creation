import { useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/app/store'

interface AuthBootstrapProps {
  children: React.ReactNode
}

export default function AuthBootstrap({
  children,
}: AuthBootstrapProps) {
  const {
    setUser,
    setOrganizations,
    setOrganization,
    setCurrentMembership,
    setAuthenticated,
    setLoading,
  } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      const accessToken = localStorage.getItem('access_token')

      if (!accessToken) {
        if (mounted) {
          setAuthenticated(false)
          setLoading(false)
        }
        return
      }

      try {
        const user = await api.getMe()

        if (!mounted) return

        setUser(user)

        const organizations = await api.getMyOrganizations()

        if (!mounted) return

        setOrganizations(organizations)

        const storedOrganizationId =
          localStorage.getItem('current_org_id')

        const organization =
          organizations.find(
            (org) => org.id === storedOrganizationId,
          ) ?? organizations[0] ?? null

        if (organization) {
          localStorage.setItem(
            'current_org_id',
            organization.id,
          )

          setOrganization(organization)

        } else {
          localStorage.removeItem('current_org_id')
          setOrganization(null)
          setCurrentMembership(null)
        }

        setAuthenticated(true)
      } catch {
        api.clearAuth()

        if (!mounted) return

        setAuthenticated(false)
        setUser(null)
        setOrganizations([])
        setOrganization(null)
        setCurrentMembership(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      mounted = false
    }
  }, [
    setUser,
    setOrganizations,
    setOrganization,
    setCurrentMembership,
    setAuthenticated,
    setLoading,
  ])

  return <>{children}</>
}