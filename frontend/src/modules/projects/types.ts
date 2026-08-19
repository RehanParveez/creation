export type ProjectStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'

export type ProjectRole =
  | 'MANAGER'
  | 'ENGINEER'
  | 'VIEWER'

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'

export interface Client {
  id: string
  organization_id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  created_at: string
}

export interface ClientCreateInput {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

export interface ClientUpdateInput {
  name?: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

export interface Milestone {
  id: string
  project_id: string
  title: string
  description?: string | null
  due_date?: string | null
  status: MilestoneStatus
  created_at?: string
  updated_at?: string
}

export interface MilestoneCreateInput {
  title: string
  description?: string | null
  due_date?: string | null
  status?: MilestoneStatus
}

export interface MilestoneUpdateInput {
  title?: string
  description?: string | null
  due_date?: string | null
  status?: MilestoneStatus
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
}

export interface ProjectMemberCreateInput {
  user_id: string
  role?: ProjectRole
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string | null
  client_id?: string | null
  status: ProjectStatus
  start_date?: string | null
  end_date?: string | null
  created_at: string
  updated_at?: string
  milestones: Milestone[]
  members: ProjectMember[]
}

export interface ProjectCreateInput {
  name: string
  description?: string | null
  client_id?: string | null
  status?: ProjectStatus
  start_date?: string | null
  end_date?: string | null
}

export interface ProjectUpdateInput {
  name?: string
  description?: string | null
  client_id?: string | null
  status?: ProjectStatus
  start_date?: string | null
  end_date?: string | null
}

export interface ProjectsQuery {
  skip?: number
  limit?: number
}

export interface ClientsQuery {
  skip?: number
  limit?: number
}

export interface ProjectFilters {
  search?: string
  status?: ProjectStatus | 'ALL'
  clientId?: string | 'ALL'
}

export interface ApiErrorResponse {
  detail?: string
  message?: string
}

export interface ProjectMetrics {
  total: number
  active: number
  draft: number
  onHold: number
  completed: number
  cancelled: number
}