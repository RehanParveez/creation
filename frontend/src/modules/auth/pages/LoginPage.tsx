import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.login(email, password)

      const user = await api.getMe()
      setUser(user)

      const organizations = await api.getMyOrganizations()
      setOrganizations(organizations)

      if (organizations.length > 0) {
        setOrganization(organizations[0])
        localStorage.setItem('current_org_id', organizations[0].id)
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please check your email and password.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cp-auth-form-page">
      <div className="cp-form-intro">
        <span className="cp-form-eyebrow">
          <i />
          Workspace access
        </span>

        <h1>
          Welcome
          <br />
          back.
        </h1>

        <p>Sign in to continue managing your construction operations.</p>
      </div>

      <div className="cp-form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="cp-form-error">{error}</div>}

          <Field
            label="Work email"
            icon={<Mail />}
            type="email"
            value={email}
            placeholder="name@company.com"
            onChange={setEmail}
          />

          <div className="cp-form-field">
            <div className="cp-label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="cp-input-wrap">
              <LockKeyhole />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="cp-input-action"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <label className="cp-check-row">
            <input type="checkbox" />
            <span>Keep me signed in</span>
          </label>

          <button
            className="cp-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Authenticating
              </>
            ) : (
              <>
                Sign in to workspace
                <ArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="cp-secure-strip">
          <ShieldCheck />
          Organization-scoped secure access
        </div>
      </div>

      <p className="cp-form-bottom">
        Do not have an organization yet?{' '}
        <Link to="/register">Create workspace</Link>
      </p>
    </div>
  )
}

function Field({
  label,
  icon,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  type: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="cp-form-field">
      <label>{label}</label>

      <div className="cp-input-wrap">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  )
}