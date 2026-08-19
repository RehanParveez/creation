import { useCallback, useEffect, useState } from 'react'

import { projectsApi } from '../api/projectsApi'
import type {
  Client,
  ClientCreateInput,
  ClientsQuery,
} from '../types'

export function useClients(query: ClientsQuery = {}) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await projectsApi.getClients(query)
      setClients(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [query.skip, query.limit])

  useEffect(() => {
    void fetchClients()
  }, [fetchClients])

  const createClient = useCallback(
    async (input: ClientCreateInput) => {
      const client = await projectsApi.createClient(input)

      setClients((current) => [client, ...current])

      return client
    },
    [],
  )

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
  }
}