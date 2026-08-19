import { useCallback, useEffect, useState } from 'react'

import { projectsApi } from '../api/projectsApi'
import type {ProjectMember, ProjectMemberCreateInput,
} from '../types'

export function useProjectMembers(projectId?: string) {
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(Boolean(projectId))
  const [error, setError] = useState<unknown>(null)

  const fetchMembers = useCallback(async () => {
    if (!projectId) {
      setMembers([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await projectsApi.getProjectMembers(projectId)
      setMembers(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void fetchMembers()
  }, [fetchMembers])

  const addMember = useCallback(
    async (input: ProjectMemberCreateInput) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const member = await projectsApi.addProjectMember(
        projectId,
        input,
      )

      setMembers((current) => [...current, member])

      return member
    },
    [projectId],
  )

  const removeMember = useCallback(
    async (userId: string) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      await projectsApi.removeProjectMember(
        projectId,
        userId,
      )

      setMembers((current) =>
        current.filter((member) => member.user_id !== userId),
      )
    },
    [projectId],
  )

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    addMember,
    removeMember,
  }
}