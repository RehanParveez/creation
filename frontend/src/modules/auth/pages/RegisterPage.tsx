import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from 'lucide-react'

import { api } from '@/services/api'
import { useAuthStore } from '@/app/store'

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    setUser,
    setOrganization,
  } = useAuthStore()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    organization_name: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordChecks = useMemo(
    () => [
      {
        label: '8+ characters',
        valid: form.password.length >= 8,
      },
      {
        label: 'Uppercase letter',
        valid: /[A-Z]/.test(form.password),
      },
      {
        label: 'Lowercase letter',
        valid: /[a-z]/.test(form.password),
      },
      {
        label: 'Number',
        valid: /[0-9]/.test(form.password),
      },
      {
        label: 'Special character',
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(
          form.password,
        ),
      },
    ],
    [form.password],
  )

  const passwordStrength = passwordChecks.filter(
    (item) => item.valid,
  ).length

  const passwordComplete = passwordChecks.every(
    (item) => item.valid,
  )

  const formComplete =
    form.full_name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.organization_name.trim() !== '' &&
    passwordComplete

  const update = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')

    if (!form.full_name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!form.email.trim()) {
      setError('Please enter your work email.')
      return
    }

    if (!form.organization_name.trim()) {
      setError('Please enter your organization name.')
      return
    }

    if (!passwordComplete) {
      setError(
        'Please satisfy all password requirements.',
      )
      return
    }

    setLoading(true)

    try {
      const { user } = await api.register(
        form.email.trim(),
        form.password,
        form.full_name.trim(),
        form.organization_name.trim(),
      )

      setUser(user)

      const orgs = await api.getMyOrganizations()

      if (orgs.length > 0) {
        setOrganization(orgs[0])

        localStorage.setItem(
          'current_org_id',
          orgs[0].id,
        )
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="register-page">
      <style>{`

        /* =========================================================
           PAGE
        ========================================================= */

        .register-page {
          --ink: #1f2a23;
          --ink-soft: #344136;
          --muted: #718078;
          --muted-light: #96a39a;
          --green: #7da46c;
          --green-dark: #648957;
          --green-soft: #a0b69a;
          --line: #dce5dc;
          --line-soft: rgba(177, 197, 181, 0.42);
          --paper: #f8faf6;
          --white: #ffffff;

          position: relative;

          width: 100%;
          height: 100dvh;
          min-height: 100dvh;

          display: grid;
          grid-template-columns:
            minmax(0, 70%)
            minmax(390px, 30%);

          overflow: hidden;

          background:
            radial-gradient(
              circle at 46% 12%,
              rgba(216, 234, 209, 0.92) 0,
              rgba(233, 242, 229, 0.72) 25%,
              rgba(248, 250, 246, 0) 55%
            ),
            #f8faf6;

          color: var(--ink);

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .register-page,
        .register-page * ,
        .register-page *::before,
        .register-page *::after {
          box-sizing: border-box;
        }

        /* =========================================================
           GRID BACKGROUND
        ========================================================= */

        .register-page::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;

          background-image:
            linear-gradient(
              to right,
              rgba(113, 143, 117, 0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(113, 143, 117, 0.085) 1px,
              transparent 1px
            );

          background-size: 72px 64px;
        }

        /* =========================================================
           HEADER
        ========================================================= */

        .register-header {
          position: absolute;
          z-index: 20;

          top: 0;
          left: 0;
          right: 0;

          height: 64px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          padding:
            16px
            20px
            0
            20px;

          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .brand-mark {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #202820;
          color: #eef5eb;

          font-size: 19px;
          font-weight: 500;
          line-height: 1;

          box-shadow:
            0 8px 24px rgba(32, 40, 32, 0.14);
        }

        .brand-copy {
          padding-top: 1px;
        }

        .brand-name {
          color: #202820;

          font-size: 17px;
          line-height: 18px;
          font-weight: 750;

          letter-spacing: -0.035em;
        }

        .brand-subtitle {
          margin-top: 4px;

          color: #718278;

          font-size: 7.5px;
          line-height: 9px;

          font-weight: 700;
          letter-spacing: 0.23em;

          white-space: nowrap;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-top: 1px;

          color: #738876;

          font-size: 9px;
          line-height: 1;

          font-weight: 700;
          letter-spacing: 0.22em;

          text-transform: uppercase;
        }

        .system-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #83a96e;
        }

        /* =========================================================
           LEFT VISUAL
        ========================================================= */

        .register-visual {
          position: relative;
          z-index: 2;

          min-width: 0;
          height: 100dvh;

          border-right:
            1px solid
            rgba(183, 201, 183, 0.48);

          overflow: hidden;
        }

        .register-visual::after {
          content: "";
          position: absolute;

          top: 0;
          right: 0;

          width: 48%;
          height: 100%;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(217, 234, 210, 0.18)
            );
        }

        .hero-content {
          position: absolute;
          z-index: 3;

          left: clamp(48px, 9.2vw, 136px);
          right: clamp(44px, 8vw, 132px);

          top: 50%;

          transform: translateY(-48%);

          max-width: 820px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 18px;

          color: #66895b;

          font-size: 10px;
          line-height: 1;

          font-weight: 750;
          letter-spacing: 0.24em;

          text-transform: uppercase;
        }

        .eyebrow::before {
          content: "";

          width: 38px;
          height: 1px;

          background: #7da46c;
        }

        .hero-title {
          margin: 0;

          max-width: 820px;

          font-size:
            clamp(
              56px,
              5.15vw,
              82px
            );

          line-height: 0.91;

          font-weight: 700;

          letter-spacing: -0.065em;
        }

        .hero-title-dark {
          display: block;
          color: #202820;
        }

        .hero-title-soft {
          display: block;

          color: #9aac98;

          white-space: nowrap;
        }

        .hero-description {
          max-width: 700px;

          margin: 22px 0 0;

          color: #698078;

          font-size: 15px;
          line-height: 1.55;

          letter-spacing: -0.01em;
        }

        .feature-section {
          width: min(100%, 760px);

          margin-top: 14px;
        }

        .feature-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);

          border-top:
            1px solid
            var(--line-soft);

          border-bottom:
            1px solid
            var(--line-soft);
        }

        .feature-top-item {
          min-height: 73px;

          padding:
            12px
            18px
            12px
            0;
        }

        .feature-top-item + .feature-top-item {
          border-left:
            1px solid
            var(--line-soft);

          padding-left: 17px;
        }

        .feature-number {
          display: block;

          margin-bottom: 5px;

          color: #83a96e;

          font-size: 8px;
          line-height: 1;

          font-weight: 750;
          letter-spacing: 0.15em;
        }

        .feature-name {
          color: #263126;

          font-size: 13px;
          line-height: 1.15;

          font-weight: 700;

          letter-spacing: -0.01em;
        }

        .feature-caption {
          margin-top: 4px;

          color: #849188;

          font-size: 9px;
          line-height: 1.2;
        }

        .feature-bottom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);

          border-bottom:
            1px solid
            var(--line-soft);
        }

        .feature-bottom-item {
          min-height: 76px;

          display: flex;
          align-items: center;

          gap: 10px;

          padding:
            11px
            18px
            11px
            0;
        }

        .feature-bottom-item + .feature-bottom-item {
          border-left:
            1px solid
            var(--line-soft);

          padding-left: 17px;
        }

        .feature-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;

          display: grid;
          place-items: center;

          border:
            1px solid
            #d7e3d5;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.54);

          color: #71955f;
        }

        .feature-icon svg {
          width: 14px;
          height: 14px;
        }

        .feature-bottom-title {
          color: #344134;

          font-size: 11px;
          line-height: 1.15;

          font-weight: 700;
        }

        .feature-bottom-copy {
          max-width: 145px;

          margin-top: 3px;

          color: #87948a;

          font-size: 9px;
          line-height: 1.35;
        }

        .visual-footer {
          position: absolute;
          z-index: 5;

          left: 20px;
          right: 24px;
          bottom: 10px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #91a092;

          font-size: 8px;
          line-height: 1;

          font-weight: 650;
          letter-spacing: 0.18em;

          text-transform: uppercase;
        }

        .visual-footer-left {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .visual-footer-mark {
          width: 15px;
          height: 15px;

          display: grid;
          place-items: center;

          border:
            1px solid
            #d2dfd0;

          border-radius: 5px;

          color: #78996d;
        }

        /* =========================================================
           RIGHT REGISTER PANEL
           
           IMPORTANT FIX:
           The panel itself scrolls instead of the whole page.
        ========================================================= */

        .register-panel {
          position: relative;
          z-index: 4;

          height: 100dvh;
          min-height: 0;
          min-width: 0;

          display: block;

          overflow-y: auto;
          overflow-x: hidden;

          padding:
            76px
            clamp(24px, 3vw, 46px)
            28px;

          background:
            rgba(249, 251, 248, 0.44);

          scrollbar-width: thin;
          scrollbar-color:
            rgba(126, 153, 126, 0.35)
            transparent;
        }

        .register-panel::-webkit-scrollbar {
          width: 5px;
        }

        .register-panel::-webkit-scrollbar-track {
          background: transparent;
        }

        .register-panel::-webkit-scrollbar-thumb {
          background:
            rgba(126, 153, 126, 0.35);

          border-radius: 999px;
        }

        .register-panel-inner {
          width: min(100%, 405px);

          min-height: 100%;

          margin:
            0
            auto;

          display: flex;
          flex-direction: column;

          justify-content: flex-start;
        }

        .panel-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;

          margin-bottom: 13px;

          color: #66895b;

          font-size: 9px;
          line-height: 1;

          font-weight: 750;
          letter-spacing: 0.21em;

          text-transform: uppercase;
        }

        .panel-eyebrow::before {
          content: "";

          width: 38px;
          height: 1px;

          background: #7ca36e;
        }

        .panel-eyebrow::after {
          content: "";

          width: 6px;
          height: 6px;

          margin-left: -3px;

          border-radius: 50%;

          background: #7ca36e;

          order: -1;
        }

        .panel-title {
          margin: 0;

          max-width: 360px;

          color: #1f2a23;

          font-size:
            clamp(
              34px,
              2.7vw,
              46px
            );

          line-height: 0.92;

          font-weight: 700;

          letter-spacing: -0.058em;
        }

        .panel-description {
          max-width: 375px;

          margin: 12px 0 0;

          color: #728278;

          font-size: 12px;
          line-height: 1.4;
        }

        /* =========================================================
           STEP
        ========================================================= */

        .step-header {
          display: flex;
          align-items: center;
          gap: 9px;

          margin:
            16px
            0
            8px;

          color: #65786c;

          font-size: 8px;
          line-height: 1;

          font-weight: 750;
          letter-spacing: 0.18em;

          text-transform: uppercase;
        }

        .step-circle {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #79a06c;
          color: white;

          font-size: 8px;
          font-weight: 750;

          letter-spacing: 0;
        }

        .step-line {
          height: 1px;
          flex: 1;

          background: #d9e2da;
        }

        .step-secure {
          color: #a0aca4;

          font-size: 7px;

          letter-spacing: 0.15em;

          white-space: nowrap;
        }

        /* =========================================================
           FORM
        ========================================================= */

        .register-form {
          width: 100%;

          border:
            1px solid
            #d8e1d9;

          background:
            rgba(255,255,255,0.76);

          padding:
            15px
            17px
            0;

          box-shadow:
            0 12px 34px
            rgba(44, 67, 49, 0.035);
        }

        .form-error {
          margin:
            0 0
            9px;

          padding:
            8px 10px;

          border:
            1px solid
            #efd5d0;

          background: #fff5f2;

          color: #a86259;

          font-size: 9px;
          line-height: 1.35;
        }

        .field {
          margin-bottom: 8px;
        }

        .field:last-of-type {
          margin-bottom: 0;
        }

        .field-label {
          display: block;

          margin:
            0 0
            4px;

          color: #596c60;

          font-size: 8px;
          line-height: 1;

          font-weight: 750;
          letter-spacing: 0.14em;

          text-transform: uppercase;
        }

        .input-shell {
          position: relative;

          height: 41px;

          display: flex;
          align-items: center;

          border:
            1px solid
            #d5dfd6;

          border-radius: 8px;

          background:
            rgba(255,255,255,0.82);

          transition:
            border-color 120ms ease,
            box-shadow 120ms ease,
            background 120ms ease;
        }

        .input-shell:focus-within {
          border-color: #9eb991;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(171, 201, 159, 0.18);
        }

        .input-icon {
          position: absolute;

          left: 12px;

          width: 14px;
          height: 14px;

          color: #9baa9f;

          pointer-events: none;
        }

        .input {
          width: 100%;
          height: 100%;

          border: 0;
          outline: 0;

          padding:
            0
            38px;

          background: transparent;

          color: #334034;

          font: inherit;

          font-size: 11px;
          line-height: 1;
        }

        .input::placeholder {
          color: #a1aea4;
        }

        .password-toggle {
          position: absolute;

          right: 6px;

          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          border: 0;
          border-radius: 7px;

          background: transparent;

          color: #9aa79d;

          cursor: pointer;
        }

        .password-toggle:hover {
          background: #f1f5ef;
          color: #61715f;
        }

        /* =========================================================
           PASSWORD
        ========================================================= */

        .password-strength {
          margin-top: 6px;
        }

        .strength-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 4px;

          color: #9aa69d;

          font-size: 7px;
          line-height: 1;

          font-weight: 700;
          letter-spacing: 0.13em;

          text-transform: uppercase;
        }

        .strength-status {
          color: #8c9990;
        }

        .strength-status.medium {
          color: #aa9362;
        }

        .strength-status.strong {
          color: #6f9760;
        }

        .strength-bars {
          display: grid;
          grid-template-columns: repeat(5, 1fr);

          gap: 3px;
        }

        .strength-bar {
          height: 3px;

          background: #dfe6df;

          border-radius: 999px;
        }

        .strength-bar.active {
          background: #89aa7b;
        }

        .requirements {
          margin-top: 6px;

          display: grid;
          grid-template-columns: 1fr 1fr;

          gap: 3px 10px;

          padding:
            7px
            9px;

          border:
            1px solid
            #dce7d9;

          background:
            #f3f8f0;
        }

        .requirement {
          display: flex;
          align-items: center;
          gap: 6px;

          min-width: 0;

          color: #a0aaa2;

          font-size: 8px;
          line-height: 1.15;
        }

        .requirement.valid {
          color: #6c8965;
        }

        .requirement-icon {
          width: 10px;
          height: 10px;
          flex: 0 0 10px;

          display: grid;
          place-items: center;
        }

        /* =========================================================
           BUTTON
        ========================================================= */

        .submit-button {
          width: 100%;
          height: 39px;

          margin-top: 9px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border: 0;
          border-radius: 8px;

          background: #202820;
          color: white;

          cursor: pointer;

          font: inherit;

          font-size: 10px;
          font-weight: 700;

          box-shadow:
            0 7px 18px
            rgba(32, 40, 32, 0.11);

          transition:
            transform 120ms ease,
            background 120ms ease,
            opacity 120ms ease;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: #2c392e;
        }

        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }

        .submit-button svg {
          width: 13px;
          height: 13px;
        }

        /* =========================================================
           SECURE STRIP
        ========================================================= */

        .secure-strip {
          min-height: 27px;

          margin:
            9px
            -17px
            0;

          padding:
            0
            17px;

          display: flex;
          align-items: center;

          gap: 6px;

          border-top:
            1px solid
            #dce5dd;

          color: #819087;

          font-size: 7px;
          line-height: 1;

          letter-spacing: 0.14em;

          text-transform: uppercase;
        }

        .secure-strip svg {
          width: 10px;
          height: 10px;

          color: #789b6e;
        }

        .signin {
          margin-top: 8px;

          padding-bottom: 8px;

          text-align: center;

          color: #8b9991;

          font-size: 9px;
          line-height: 12px;
        }

        .signin-button {
          color: #4f7654;

          font-weight: 700;

          text-decoration: none;
        }

        .signin-button:hover {
          color: #365f3b;
        }

        /* =========================================================
           SHORT DESKTOP SCREENS
           
           This is the important part for 720/768/800px screens.
        ========================================================= */

        @media (max-height: 850px) and (min-width: 901px) {
          .register-header {
            height: 56px;

            padding:
              13px
              18px
              0;
          }

          .brand-mark {
            width: 32px;
            height: 32px;
            flex-basis: 32px;

            border-radius: 9px;

            font-size: 17px;
          }

          .brand-name {
            font-size: 15px;
            line-height: 16px;
          }

          .brand-subtitle {
            margin-top: 2px;
            font-size: 6.5px;
          }

          .hero-content {
            transform: translateY(-50%);
          }

          .eyebrow {
            margin-bottom: 12px;
          }

          .hero-title {
            font-size:
              clamp(
                48px,
                4.8vw,
                70px
              );
          }

          .hero-description {
            margin-top: 14px;
            font-size: 12px;
          }

          .feature-section {
            margin-top: 9px;
          }

          .feature-top-item {
            min-height: 58px;

            padding:
              8px
              14px
              8px
              0;
          }

          .feature-top-item + .feature-top-item {
            padding-left: 13px;
          }

          .feature-bottom-item {
            min-height: 60px;

            padding:
              8px
              14px
              8px
              0;
          }

          .feature-bottom-item + .feature-bottom-item {
            padding-left: 13px;
          }

          .feature-icon {
            width: 29px;
            height: 29px;
            flex-basis: 29px;
          }

          .feature-bottom-title {
            font-size: 10px;
          }

          .feature-bottom-copy {
            font-size: 8px;
          }

          /* RIGHT SIDE */

          .register-panel {
            padding:
              62px
              22px
              20px;
          }

          .panel-eyebrow {
            margin-bottom: 10px;
          }

          .panel-title {
            font-size: 34px;
          }

          .panel-description {
            margin-top: 8px;
            font-size: 10px;
          }

          .step-header {
            margin:
              11px
              0
              6px;
          }

          .step-circle {
            width: 20px;
            height: 20px;
            flex-basis: 20px;
          }

          .register-form {
            padding:
              11px
              14px
              0;
          }

          .field {
            margin-bottom: 5px;
          }

          .field-label {
            margin-bottom: 3px;
            font-size: 7px;
          }

          .input-shell {
            height: 34px;
          }

          .input {
            font-size: 9px;
          }

          .input-icon {
            left: 10px;
            width: 12px;
            height: 12px;
          }

          .password-toggle {
            width: 26px;
            height: 26px;
          }

          .password-strength {
            margin-top: 4px;
          }

          .strength-header {
            margin-bottom: 3px;
            font-size: 6px;
          }

          .strength-bar {
            height: 2px;
          }

          .requirements {
            margin-top: 4px;

            padding:
              5px
              7px;

            gap:
              2px
              7px;
          }

          .requirement {
            font-size: 6.5px;
          }

          .requirement-icon {
            width: 9px;
            height: 9px;
            flex-basis: 9px;
          }

          .submit-button {
            height: 34px;
            margin-top: 6px;
            font-size: 8px;
          }

          .secure-strip {
            min-height: 22px;

            margin:
              6px
              -14px
              0;

            padding:
              0
              14px;

            font-size: 6px;
          }

          .signin {
            margin-top: 5px;
            font-size: 7px;
          }
        }

        /* =========================================================
           VERY SHORT DESKTOP SCREENS
        ========================================================= */

        @media (max-height: 720px) and (min-width: 901px) {
          .register-panel {
            padding-top: 52px;
            padding-bottom: 14px;
          }

          .panel-title {
            font-size: 30px;
          }

          .panel-description {
            font-size: 9px;
          }

          .step-header {
            margin-top: 8px;
            margin-bottom: 5px;
          }

          .register-form {
            padding-top: 9px;
          }

          .field {
            margin-bottom: 4px;
          }

          .input-shell {
            height: 31px;
          }

          .requirements {
            padding:
              4px
              6px;
          }

          .submit-button {
            height: 31px;
            margin-top: 5px;
          }

          .secure-strip {
            min-height: 20px;
          }
        }

        /* =========================================================
           WIDTH
        ========================================================= */

        @media (max-width: 1250px) and (min-width: 901px) {
          .register-page {
            grid-template-columns:
              minmax(0, 67%)
              minmax(390px, 33%);
          }

          .hero-content {
            left: 7vw;
            right: 5vw;
          }

          .hero-title {
            font-size:
              clamp(
                52px,
                5.2vw,
                74px
              );
          }

          .hero-title-soft {
            white-space: normal;
          }

          .register-panel {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        /* =========================================================
           TABLET / MOBILE
        ========================================================= */

        @media (max-width: 900px) {
          .register-page {
            height: auto;
            min-height: 100dvh;

            display: block;

            overflow-x: hidden;
            overflow-y: auto;
          }

          .register-header {
            position: relative;

            height: 66px;

            padding:
              16px
              18px
              0;
          }

          .system-status {
            display: none;
          }

          .register-visual {
            height: auto;
            min-height: 500px;

            border-right: 0;
            border-bottom:
              1px solid
              rgba(183, 201, 183, 0.48);
          }

          .hero-content {
            position: relative;

            left: auto;
            right: auto;
            top: auto;

            transform: none;

            padding:
              72px
              28px
              46px;

            max-width: 820px;
          }

          .hero-title {
            font-size:
              clamp(
                52px,
                9vw,
                78px
              );
          }

          .hero-title-soft {
            white-space: normal;
          }

          .hero-description {
            font-size: 14px;
          }

          .register-panel {
            height: auto;
            min-height: auto;

            overflow: visible;

            padding:
              52px
              28px
              64px;
          }

          .register-panel-inner {
            min-height: auto;
            margin: 0 auto;
          }
        }

        @media (max-width: 560px) {
          .register-header {
            padding-left: 14px;
            padding-right: 14px;
          }

          .brand-mark {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
          }

          .brand-name {
            font-size: 15px;
          }

          .brand-subtitle {
            font-size: 6.5px;
            letter-spacing: 0.19em;
          }

          .hero-content {
            padding:
              58px
              20px
              38px;
          }

          .eyebrow {
            font-size: 8px;
          }

          .hero-title {
            font-size:
              clamp(
                44px,
                13vw,
                66px
              );
          }

          .hero-description {
            font-size: 13px;
          }

          .feature-top,
          .feature-bottom {
            grid-template-columns: 1fr;
          }

          .feature-top-item,
          .feature-bottom-item,
          .feature-top-item + .feature-top-item,
          .feature-bottom-item + .feature-bottom-item {
            border-left: 0;
            padding-left: 0;
            padding-right: 0;
          }

          .feature-top-item {
            min-height: auto;

            padding:
              11px
              0;

            border-bottom:
              1px solid
              rgba(172, 193, 177, 0.4);
          }

          .feature-bottom-item {
            min-height: auto;

            padding:
              10px
              0;

            border-bottom:
              1px solid
              rgba(172, 193, 177, 0.4);
          }

          .register-panel {
            padding:
              42px
              18px
              52px;
          }

          .panel-title {
            font-size: 37px;
          }

          .register-form {
            padding:
              15px
              15px
              0;
          }

          .requirements {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

      <header className="register-header">
        <div className="brand">
          <div className="brand-mark">
            A
          </div>

          <div className="brand-copy">
            <div className="brand-name">
              Creation
            </div>

            <div className="brand-subtitle">
              AI CONSTRUCTION MANAGEMENT
            </div>
          </div>
        </div>

        <div className="system-status">
          <span className="system-dot" />
          Systems operational
        </div>
      </header>

      {/* =========================================================
          LEFT SIDE
      ========================================================= */}

      <section className="register-visual">
        <div className="hero-content">
          <div className="eyebrow">
            Project control platform
          </div>

          <h1 className="hero-title">
            <span className="hero-title-dark">
              Construction
              <br />
              control,
            </span>

            <span className="hero-title-soft">
              without the blind spots.
            </span>
          </h1>

          <p className="hero-description">
            Bring approved budgets, site progress,
            materials, procurement, deliveries and
            expenses into one operational picture.
          </p>

          <div className="feature-section">
            <div className="feature-top">
              <div className="feature-top-item">
                <span className="feature-number">
                  01
                </span>

                <div className="feature-name">
                  Visibility
                </div>

                <div className="feature-caption">
                  Cost &amp; progress
                </div>
              </div>

              <div className="feature-top-item">
                <span className="feature-number">
                  02
                </span>

                <div className="feature-name">
                  Control
                </div>

                <div className="feature-caption">
                  Approvals &amp; workflow
                </div>
              </div>

              <div className="feature-top-item">
                <span className="feature-number">
                  03
                </span>

                <div className="feature-name">
                  Traceability
                </div>

                <div className="feature-caption">
                  Every project event
                </div>
              </div>
            </div>

            <div className="feature-bottom">
              <FeatureItem
                type="reporting"
                title="Live reporting"
                copy="Understand project performance as it changes."
              />

              <FeatureItem
                type="approval"
                title="Clear approvals"
                copy="Keep decisions documented and visible."
              />

              <FeatureItem
                type="security"
                title="Protected data"
                copy="Keep operational information organized."
              />
            </div>
          </div>
        </div>

        <div className="visual-footer">
          <div className="visual-footer-left">
            <span className="visual-footer-mark">
              <svg
                viewBox="0 0 24 24"
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M5 12h3l2-5 3 10 2-5h4" />
              </svg>
            </span>

            <span>
              Operational layer
            </span>

            <span>
              Budget · Site · Procurement · Cost
            </span>
          </div>

          <span>
            ConstructPro / 01
          </span>
        </div>
      </section>

      {/* =========================================================
          RIGHT SIDE
      ========================================================= */}

      <section className="register-panel">
        <div className="register-panel-inner">

          <div className="panel-eyebrow">
            Organization setup
          </div>

          <h2 className="panel-title">
            Create your
            <br />
            workspace.
          </h2>

          <p className="panel-description">
            Establish your organization and start
            controlling projects from one operational
            system.
          </p>

          <div className="step-header">
            <span className="step-circle">
              01
            </span>

            <span>
              Organization
            </span>

            <span className="step-line" />

            <span className="step-secure">
              Secure setup
            </span>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div
                className="form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* FULL NAME */}

            <div className="field">
              <label
                className="field-label"
                htmlFor="register-full-name"
              >
                Full name
              </label>

              <div className="input-shell">
                <UserRound className="input-icon" />

                <input
                  id="register-full-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(event) =>
                    update(
                      'full_name',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="field">
              <label
                className="field-label"
                htmlFor="register-email"
              >
                Work email
              </label>

              <div className="input-shell">
                <Mail className="input-icon" />

                <input
                  id="register-email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) =>
                    update(
                      'email',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="field">
              <label
                className="field-label"
                htmlFor="register-organization"
              >
                Organization
              </label>

              <div className="input-shell">
                <Building2 className="input-icon" />

                <input
                  id="register-organization"
                  className="input"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company name"
                  value={form.organization_name}
                  onChange={(event) =>
                    update(
                      'organization_name',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="field">
              <label
                className="field-label"
                htmlFor="register-password"
              >
                Password
              </label>

              <div className="input-shell">
                <LockKeyhole className="input-icon" />

                <input
                  id="register-password"
                  className="input"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(event) =>
                    update(
                      'password',
                      event.target.value,
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>

              <div className="password-strength">
                <div className="strength-header">
                  <span>
                    Password strength
                  </span>

                  <span
                    className={[
                      'strength-status',
                      passwordStrength >= 5
                        ? 'strong'
                        : passwordStrength >= 3
                          ? 'medium'
                          : '',
                    ].join(' ')}
                  >
                    {passwordStrength >= 5
                      ? 'Strong'
                      : passwordStrength >= 3
                        ? 'Good'
                        : 'Incomplete'}
                  </span>
                </div>

                <div className="strength-bars">
                  {passwordChecks.map(
                    (check, index) => (
                      <span
                        key={check.label}
                        className={[
                          'strength-bar',
                          index <
                          passwordStrength
                            ? 'active'
                            : '',
                        ].join(' ')}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="requirements">
                {passwordChecks.map(
                  (check) => (
                    <div
                      key={check.label}
                      className={[
                        'requirement',
                        check.valid
                          ? 'valid'
                          : '',
                      ].join(' ')}
                    >
                      <span className="requirement-icon">
                        {check.valid ? (
                          <Check size={9} />
                        ) : (
                          <X size={9} />
                        )}
                      </span>

                      <span>
                        {check.label}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={
                loading ||
                !formComplete
              }
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={13}
                  />

                  Creating workspace
                </>
              ) : (
                <>
                  Create workspace

                  <ArrowRight size={13} />
                </>
              )}
            </button>

            <div className="secure-strip">
              <LockKeyhole size={10} />

              <span>
                Organization-scoped secure setup
              </span>
            </div>
          </form>

          <div className="signin">
            Already have an account?{' '}

            <Link
              to="/login"
              className="signin-button"
            >
              Sign in
            </Link>
          </div>

        </div>
      </section>
    </main>
  )
}

function FeatureItem({
  type,
  title,
  copy,
}: {
  type: 'reporting' | 'approval' | 'security'
  title: string
  copy: string
}) {
  return (
    <div className="feature-bottom-item">
      <div className="feature-icon">

        {type === 'reporting' && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 19V10" />
            <path d="M10 19V5" />
            <path d="M15 19v-7" />
            <path d="M20 19V8" />
          </svg>
        )}

        {type === 'approval' && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7 4h10" />
            <path d="M8 2h8v4H8z" />
            <path d="M6 5h12a2 2 0 0 1 2 2v13H4V7a2 2 0 0 1 2-2Z" />
            <path d="m8 13 2 2 5-5" />
          </svg>
        )}

        {type === 'security' && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 3 19 6v5c0 4.6-2.8 8.2-7 10-4.2-1.8-7-5.4-7-10V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        )}

      </div>

      <div>
        <div className="feature-bottom-title">
          {title}
        </div>

        <div className="feature-bottom-copy">
          {copy}
        </div>
      </div>
    </div>
  )
}