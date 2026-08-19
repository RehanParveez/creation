import { useCallback, useEffect, useState } from 'react'

import { projectsApi } from '../api/projectsApi'
import type {Milestone, MilestoneCreateInput,
} from '../types'

export function useMilestones(projectId?: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(Boolean(projectId))
  const [error, setError] = useState<unknown>(null)

  const fetchMilestones = useCallback(async () => {
    if (!projectId) {
      setMilestones([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await projectsApi.getMilestones(projectId)
      setMilestones(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void fetchMilestones()
  }, [fetchMilestones])

  const createMilestone = useCallback(
    async (input: MilestoneCreateInput) => {
      if (!projectId) {
        throw new Error('Project ID is required')
      }

      const milestone = await projectsApi.createMilestone(
        projectId,
        input,
      )

      setMilestones((current) => [...current, milestone])

      return milestone
    },
    [projectId],
  )

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
  }
}