import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HardHat, ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react'
import { api } from '@/services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-[#171717]">
          <HardHat className="h-5 w-5 text-[#e8890c]" />
        </div>

        <div className="rounded-2xl border border-[#deded9] bg-white p-8 text-center shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#171717]">
            Check your email
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            If an account exists for{' '}
            <span className="font-medium text-[#333]">{email}</span>, we've sent
            password reset instructions.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c66f00] hover:text-[#a95d00]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
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
          Reset password
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          Enter your work email and we'll send you instructions to recover your account.
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

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="h-12 w-full rounded-xl border border-[#d9d9d4] bg-[#fafaf8] pl-10 pr-4 text-sm outline-none transition placeholder:text-[#a1a1aa] focus:border-[#e8890c] focus:bg-white focus:ring-4 focus:ring-[#e8890c]/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e8890c] text-sm font-semibold text-white transition hover:bg-[#d47b08] focus:outline-none focus:ring-4 focus:ring-[#e8890c]/20 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#eeeeea] pt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#777] hover:text-[#333]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}