import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { HardHat, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { api } from '@/services/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setLoading(true)

    try {
      await api.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-[#171717]">
          <HardHat className="h-5 w-5 text-[#e8890c]" />
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#171717]">
            Password reset complete
          </h2>

          <p className="mt-2 text-sm text-[#6b7280]">
            Redirecting you to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-7">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#171717]">
          <HardHat className="h-5 w-5 text-[#e8890c]" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8890c]">
          Account recovery
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#171717]">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Choose a secure password for your BuildTrack account.
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
              New password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="h-12 w-full rounded-xl border border-[#d9d9d4] bg-[#fafaf8] px-4 pr-12 text-sm outline-none transition placeholder:text-[#a1a1aa] focus:border-[#e8890c] focus:bg-white focus:ring-4 focus:ring-[#e8890c]/10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#999] hover:bg-black/5 hover:text-[#333]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#262626]">
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              className="h-12 w-full rounded-xl border border-[#d9d9d4] bg-[#fafaf8] px-4 text-sm outline-none transition placeholder:text-[#a1a1aa] focus:border-[#e8890c] focus:bg-white focus:ring-4 focus:ring-[#e8890c]/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e8890c] text-sm font-semibold text-white transition hover:bg-[#d47b08] focus:outline-none focus:ring-4 focus:ring-[#e8890c]/20 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Reset password</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}