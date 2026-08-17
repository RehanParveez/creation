import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8014'

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_verified: boolean
  last_login_at?: string | null
  permissions?: string[]
  roles?: string[]
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  currency: string
  timezone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description?: string
  is_system: boolean
  is_active: boolean
  permissions: Permission[]
}

export interface Permission {
  id: string
  code: string
  name: string
  description?: string
  domain: string
}

export interface Membership {
  id: string
  user_id: string
  organization_id: string
  role_id: string
  role: Role
  joined_at: string
  is_default: boolean
  user?: User
}

class ApiService {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })

    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token')
      const orgId = localStorage.getItem('current_org_id')
      if (token) config.headers.Authorization = `Bearer ${token}`
      if (orgId) config.headers['x-organization-id'] = orgId
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const newToken = await this.refreshToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch {
            this.clearAuth()
            window.location.href = '/login'
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise
    this.refreshPromise = (async () => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) throw new Error('No refresh token')
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      })
      const data: TokenPair = res.data
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      return data.access_token
    })()
    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  async register(
  email: string,
  password: string,
  first_name: string,
  last_name: string,
) {
  const res = await this.client.post('/auth/register', {
    email,
    password,
    first_name,
    last_name,
  })

  const {
    user,
    access_token,
    refresh_token,
    token_type,
    expires_in,
  } = res.data

  const tokens: TokenPair = {
    access_token,
    refresh_token,
    token_type,
    expires_in,
  }

  this.setTokens(tokens)

  return { user, tokens }
}
  async login(email: string, password: string) {
    const res = await this.client.post('/auth/login', { email, password })
    const tokens: TokenPair = res.data
    this.setTokens(tokens)
    return tokens
  }

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      await this.client.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {})
    }
    this.clearAuth()
  }

  async getMe() {
    const res = await this.client.get('/auth/me')
    return res.data as User
  }

  async requestPasswordReset(email: string) {
  return this.client.post('/auth/forgot-password', {
    email,
  })
}

  async resetPassword(token: string, new_password: string) {
   return this.client.post('/auth/reset-password', {
    token,
    new_password,
  })
}

  async createOrganization(data: Partial<Organization>) {
    return this.client.post('/organizations', data)
  }

  async getMyOrganizations() {
    const res = await this.client.get('/organizations/my')
    return res.data as Organization[]
  }

  async getOrganization(orgId: string) {
    const res = await this.client.get(`/organizations/${orgId}`)
    return res.data
  }

  async switchOrganization(orgId: string) {
    const res = await this.client.post('/organizations/switch', { organization_id: orgId })
    return res.data as Organization
  }

  async inviteMember(orgId: string, email: string, role_id: string, full_name?: string) {
    return this.client.post(`/organizations/${orgId}/invite`, { email, role_id, full_name })
  }

  async getMembers(orgId: string) {
    const res = await this.client.get(`/organizations/${orgId}/members`)
    return res.data as Membership[]
  }

  async getRoles(orgId: string) {
    const res = await this.client.get(`/organizations/${orgId}/roles`)
    return res.data as Role[]
  }

  async getPermissions() {
    const res = await this.client.get('/organizations/permissions/all')
    return res.data as Permission[]
  }

  private setTokens(tokens: TokenPair) {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
  }

  clearAuth() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_org_id')
  }
}

export const api = new ApiService()