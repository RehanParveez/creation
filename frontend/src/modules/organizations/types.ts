export interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  logo_url?: string | null
  website?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  currency: string
  timezone: string
  is_active: boolean
  archived_at?: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMembership {
  id: string
  organization_id: string
  user_id: string
  role_id: string
  joined_at: string
  is_default: boolean
  created_at: string
  updated_at: string

  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name?: string
    is_active: boolean
    is_verified: boolean
  }

  role?: {
    id: string
    name: string
    description?: string | null
    is_system: boolean
  }
}

export interface OrganizationRole {
  id: string
  name: string
  description?: string | null
  is_system: boolean
}

export interface OrganizationPermission {
  id: string
  code: string
  description?: string | null
}

export interface CreateOrganizationInput {
  name: string
  slug?: string
  description?: string
  logo_url?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  currency?: string
  timezone?: string
}

export interface UpdateOrganizationInput {
  name?: string
  slug?: string
  description?: string | null
  logo_url?: string | null
  website?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  currency?: string
  timezone?: string
}

export interface InviteMemberInput {
  email: string
  role_id: string
  full_name?: string
}

export type Membership = OrganizationMembership
export type Role = OrganizationRole
export type Permission = OrganizationPermission
export const PROJECT_PERMISSIONS = {
  CLIENT_READ: 'client:read', CLIENT_CREATE: 'client:create', CLIENT_UPDATE: 'client:update', CLIENT_DELETE: 'client:delete',

  PROJECT_READ: 'project:read', PROJECT_CREATE: 'project:create', PROJECT_UPDATE: 'project:update', PROJECT_DELETE: 'project:delete',
} as const