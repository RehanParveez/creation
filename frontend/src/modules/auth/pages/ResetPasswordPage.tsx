import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'

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

  const checks = useMemo(
    () => [
      { label: '8+ characters', valid: password.length >= 8 },
      { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
      { label: 'Number', valid: /[0-9]/.test(password) },
      {
        label: 'Special character',
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ],
    [password],
  )

  const valid = checks.every((item) => item.valid)

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => navigate('/login'), 3000)
    return () => window.clearTimeout(timer)
  }, [navigate, success])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setError('This password reset link is missing or invalid.')
      return
    }

    if (!valid) {
      setError('Please satisfy all password requirements.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await api.resetPassword(token, password)
      setSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Reset failed. Please request a new reset link.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="cp-auth-form-page">
        <div className="cp-form-intro">
          <span className="cp-form-eyebrow">
            <i />
            Account recovery
          </span>

          <h1>
            Access
            <br />
            restored.
          </h1>

          <p>Your password has been securely updated.</p>
        </div>

        <div className="cp-form-card cp-success-card">
          <div className="cp-success-icon">
            <CheckCircle2 />
          </div>

          <h2>Password reset complete</h2>
          <p>
            Your new password is active. You will be redirected to the
            workspace sign-in shortly.
          </p>

          <div className="cp-reset-progress">
            <span />
          </div>

          <button
            type="button"
            className="cp-secondary-button"
            onClick={() => navigate('/login')}
          >
            Continue to sign in
            <ArrowRight />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-auth-form-page">
      <div className="cp-form-intro">
        <span className="cp-form-eyebrow">
          <i />
          Account recovery
        </span>

        <h1>
          Set a new
          <br />
          password.
        </h1>

        <p>
          Choose a strong password to secure your construction workspace.
        </p>
      </div>

      <div className="cp-form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="cp-form-error">{error}</div>}

          <div className="cp-form-field">
            <label>New password</label>

            <div className="cp-input-wrap">
              <LockKeyhole />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="cp-input-action"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="cp-password-checks cp-reset-checks">
            {checks.map((check) => (
              <span key={check.label} className={check.valid ? 'is-valid' : ''}>
                <Check />
                {check.label}
              </span>
            ))}
          </div>

          <div className="cp-form-field cp-confirm-field">
            <label>Confirm password</label>
            <input
              className="cp-plain-input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="cp-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Updating password
              </>
            ) : (
              <>
                Reset password
                <ArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="cp-secure-strip">
          <ShieldCheck />
          Secure password recovery
        </div>
      </div>
    </div>
  )
}