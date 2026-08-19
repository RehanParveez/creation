import { useCallback, useEffect, useState } from 'react'

import { projectsApi } from '../api/projectsApi'
import type { Project } from '../types'

export function useProject(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(Boolean(projectId))
  const [error, setError] = useState<unknown>(null)

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setProject(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await projectsApi.getProject(projectId)
      setProject(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void fetchProject()
  }, [fetchProject])

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  }
}