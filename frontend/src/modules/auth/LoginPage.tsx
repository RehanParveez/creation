import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, HardHat, ArrowRight, Loader2 } from 'lucide-react'
import { api } from '@/services/api'
import { useAuthStore } from '@/app/store'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setOrganization, setOrganizations } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.login(email, password)
      const user = await api.getMe()
      setUser(user)

      const orgs = await api.getMyOrganizations()
      setOrganizations(orgs)

      if (orgs.length > 0) {
        setOrganization(orgs[0])
        localStorage.setItem('current_org_id', orgs[0].id)
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-[#171717]">
          <HardHat className="h-5 w-5 text-[#e8890c]" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8890c]">
          Workspace access
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717]">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Sign in to continue to your construction workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-[#deded9] bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)] sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#262626]">
              Work email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="h-12 w-full rounded-xl border border-[#d9d9d4] bg-[#fafaf8] px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#e8890c] focus:bg-white focus:ring-4 focus:ring-[#e8890c]/10"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-[#262626]">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#c66f00] hover:text-[#a95d00]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-[#d9d9d4] bg-[#fafaf8] px-4 pr-12 text-sm text-[#171717] outline-none transition placeholder:text-[#a1a1aa] focus:border-[#e8890c] focus:bg-white focus:ring-4 focus:ring-[#e8890c]/10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8b8b8b] hover:bg-black/5 hover:text-[#333]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#cfcfc9] text-[#e8890c] focus:ring-[#e8890c]/20"
            />
            <span className="text-sm text-[#6b7280]">Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e8890c] px-4 text-sm font-semibold text-white transition hover:bg-[#d47b08] focus:outline-none focus:ring-4 focus:ring-[#e8890c]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 border-t border-[#eeeeea] pt-6 text-center">
          <p className="text-sm text-[#777]">
            Don't have an organization yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#c66f00] hover:text-[#a95d00]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[#999]">
        Secure organization workspace
      </p>
    </div>
  )
}