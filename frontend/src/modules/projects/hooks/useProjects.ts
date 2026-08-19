import { useCallback, useEffect, useState } from 'react'

import { projectsApi } from '../api/projectsApi'
import type {Project, ProjectCreateInput, ProjectsQuery,
} from '../types'

export function useProjects(query: ProjectsQuery = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await projectsApi.getProjects(query)
      setProjects(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [query.skip, query.limit])

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(
    async (input: ProjectCreateInput) => {
      const project = await projectsApi.createProject(input)

      setProjects((current) => [project, ...current])

      return project
    },
    [],
  )

  const deleteProject = useCallback(async (projectId: string) => {
    await projectsApi.deleteProject(projectId)

    setProjects((current) =>
      current.filter((project) => project.id !== projectId),
    )
  }, [])

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    deleteProject,
  }
}