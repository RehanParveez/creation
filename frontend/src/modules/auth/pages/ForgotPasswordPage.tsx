import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { api } from '@/services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'We could not process your request. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="cp-auth-form-page">
        <Header
          eyebrow="Account recovery"
          title={<>Check your<br />inbox.</>}
          body="If the account exists, we have sent instructions to securely reset your password."
        />

        <div className="cp-form-card cp-success-card">
          <div className="cp-success-icon">
            <CheckCircle2 />
          </div>

          <h2>Reset instructions sent</h2>

          <p>
            If an account exists for <strong>{email}</strong>, you will
            receive an email with instructions for choosing a new password.
          </p>

          <div className="cp-security-note">
            <ShieldCheck />
            <span>
              For security, we do not reveal whether an email address is
              registered with the workspace.
            </span>
          </div>

          <Link className="cp-secondary-button" to="/login">
            <ArrowLeft />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cp-auth-form-page">
      <Header
        eyebrow="Account recovery"
        title={<>Recover your<br />access.</>}
        body="Enter your work email and we will send a secure password reset link."
      />

      <div className="cp-form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="cp-form-error">{error}</div>}

          <div className="cp-form-field">
            <label htmlFor="recovery-email">Work email</label>

            <div className="cp-input-wrap">
              <Mail />
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <button className="cp-primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Sending request
              </>
            ) : (
              <>
                Send reset link
                <ArrowRight />
              </>
            )}
          </button>

          <Link className="cp-inline-back" to="/login">
            <ArrowLeft />
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  )
}

function Header({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: React.ReactNode
  body: string
}) {
  return (
    <div className="cp-form-intro">
      <span className="cp-form-eyebrow">
        <i />
        {eyebrow}
      </span>

      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  )
}