import { create } from 'zustand'
import { User, Organization, Membership } from '@/services/api'
import type {OrganizationMembership, OrganizationRole,
} from '@/modules/organizations/types'

interface AuthState {
  user: User | null
  organization: Organization | null
  organizations: Organization[]
  currentMembership: OrganizationMembership | null
  members: Membership[]
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setOrganization: (organization: Organization | null) => void
  setOrganizations: (organizations: Organization[]) => void
  setCurrentMembership: (membership: OrganizationMembership | null) => void
  setMembers: (members: Membership[]) => void
  setPermissions: (permissions: string[]) => void
  setAuthenticated: (value: boolean) => void
  setLoading: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  organizations: [],
  currentMembership: null,
  members: [],
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setOrganization: (organization) => set({ organization }),
  setOrganizations: (organizations) => set({ organizations }),
  setCurrentMembership: (currentMembership) => set({ currentMembership }),
  setMembers: (members) => set({ members }),
  setPermissions: (permissions) => set({ permissions }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => set({
    user: null,
    organization: null,
    organizations: [],
    currentMembership: null,
    members: [],
    permissions: [],
    isAuthenticated: false,
    isLoading: false,
  }),
}))