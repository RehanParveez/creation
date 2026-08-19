import { api } from '@/services/api'

import type {Client, ClientCreateInput, ClientsQuery, Milestone, MilestoneCreateInput, Project, ProjectCreateInput, ProjectMember,
  ProjectMemberCreateInput, ProjectsQuery,
} from '../types'

const PROJECTS_BASE = '/projects'

class ProjectsApi {

  async getClients(query: ClientsQuery = {}): Promise<Client[]> {
    const params = {
      skip: query.skip ?? 0,
      limit: query.limit ?? 100,
    }

    const response = await api['client'].get(`${PROJECTS_BASE}/clients`, {
      params,
    })

    return response.data as Client[]
  }

  async createClient(input: ClientCreateInput): Promise<Client> {
    const response = await api['client'].post(
      `${PROJECTS_BASE}/clients`,
      input,
    )

    return response.data as Client
  }

  async getProjects(query: ProjectsQuery = {}): Promise<Project[]> {
    const params = {
      skip: query.skip ?? 0,
      limit: query.limit ?? 100,
    }

    const response = await api['client'].get(PROJECTS_BASE, {
      params,
    })

    return response.data as Project[]
  }

  async getProject(projectId: string): Promise<Project> {
    const response = await api['client'].get(
      `${PROJECTS_BASE}/${projectId}`,
    )

    return response.data as Project
  }

  async createProject(input: ProjectCreateInput): Promise<Project> {
    const response = await api['client'].post(
      `${PROJECTS_BASE}/`,
      input,
    )

    return response.data as Project
  }

  async deleteProject(projectId: string): Promise<void> {
    await api['client'].delete(
      `${PROJECTS_BASE}/${projectId}`,
    )
  }

  async getMilestones(projectId: string): Promise<Milestone[]> {
    const response = await api['client'].get(
      `${PROJECTS_BASE}/${projectId}/milestones`,
    )

    return response.data as Milestone[]
  }

  async createMilestone(
    projectId: string,
    input: MilestoneCreateInput,
  ): Promise<Milestone> {
    const response = await api['client'].post(
      `${PROJECTS_BASE}/${projectId}/milestones`,
      input,
    )

    return response.data as Milestone
  }


  async getProjectMembers(
    projectId: string,
  ): Promise<ProjectMember[]> {
    const response = await api['client'].get(
      `${PROJECTS_BASE}/${projectId}/members`,
    )

    return response.data as ProjectMember[]
  }

  async addProjectMember(
    projectId: string,
    input: ProjectMemberCreateInput,
  ): Promise<ProjectMember> {
    const response = await api['client'].post(
      `${PROJECTS_BASE}/${projectId}/members`,
      input,
    )

    return response.data as ProjectMember
  }

  async removeProjectMember(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await api['client'].delete(
      `${PROJECTS_BASE}/${projectId}/members/${userId}`,
    )
  }
}

export const projectsApi = new ProjectsApi()



