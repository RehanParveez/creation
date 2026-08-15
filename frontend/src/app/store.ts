import { create } from 'zustand'
import { User, Organization, Membership } from '@/services/api'

interface AuthState {
  user: User | null
  organization: Organization | null
  organizations: Organization[]
  members: Membership[]
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  setOrganizations: (orgs: Organization[]) => void
  setMembers: (members: Membership[]) => void
  setAuthenticated: (val: boolean) => void
  setLoading: (val: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  organizations: [],
  members: [],
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganization: (organization) => set({ organization }),
  setOrganizations: (organizations) => set({ organizations }),
  setMembers: (members) => set({ members }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({
    user: null,
    organization: null,
    organizations: [],
    members: [],
    isAuthenticated: false,
    isLoading: false,
  }),
}))