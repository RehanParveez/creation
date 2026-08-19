import { useState, useCallback } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/app/store'
import { Organization, CreateOrganizationInput } from '../types'

export function useOrganizations() {
  const { organization, setOrganization, organizations, setOrganizations } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMyOrganizations()
      setOrganizations(data)
      return data
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch organizations')
      return []
    } finally {
      setLoading(false)
    }
  }, [setOrganizations])

  const createOrganization = useCallback(async (input: CreateOrganizationInput) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createOrganization(input)
      const newOrg: Organization = res.data
      await fetchMyOrganizations()
      return newOrg
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create organization')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchMyOrganizations])

  const switchOrganization = useCallback(async (orgId: string) => {
    setLoading(true)
    setError(null)
    try {
      const switchedOrg = await api.switchOrganization(orgId)
      localStorage.setItem('current_org_id', switchedOrg.id)
      setOrganization(switchedOrg)
      window.location.href = '/dashboard'
      return switchedOrg
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to switch workspace')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setOrganization])

  return {
    organizations,
    currentOrganization: organization,
    loading,
    error,
    fetchMyOrganizations,
    createOrganization,
    switchOrganization,
  }
}