import { Outlet } from 'react-router-dom'
import { Activity } from 'lucide-react'
import BrandMark from '@/components/BrandMark'

export default function AuthLayout() {
  return (
    <div className="cp-auth">
      <div className="cp-auth-grid">
        <section className="cp-auth-visual">
          <div className="cp-auth-grid-lines" />

          <header className="cp-auth-brand">
            <div className="cp-auth-mark">
              <BrandMark size={18} />
            </div>

            <div>
              <strong>Creation</strong>
              <small>AI construction management</small>
            </div>

            <span className="cp-auth-status">
              <i />
              Systems operational
            </span>
          </header>

          <div className="cp-auth-hero">
            <span className="cp-auth-eyebrow">
              <i />
              Project control platform
            </span>

            <h1>
              Construction
              <br />
              control,
              <br />
              <span>without the blind spots.</span>
            </h1>

            <p>
              Bring approved budgets, site progress, materials,
              procurement, deliveries and expenses into one
              operational picture.
            </p>

            <div className="cp-auth-principles">
              <div>
                <small>01</small>
                <strong>Visibility</strong>
                <span>Cost &amp; progress</span>
              </div>

              <div>
                <small>02</small>
                <strong>Control</strong>
                <span>Approvals &amp; workflow</span>
              </div>

              <div>
                <small>03</small>
                <strong>Traceability</strong>
                <span>Every project event</span>
              </div>
            </div>

            <div className="cp-auth-features">
              <Feature
                icon="◫"
                title="Live reporting"
                text="Understand project performance as it changes."
              />
              <Feature
                icon="✓"
                title="Clear approvals"
                text="Keep decisions documented and visible."
              />
              <Feature
                icon="◇"
                title="Protected data"
                text="Keep operational information organized."
              />
            </div>
          </div>

          <footer className="cp-auth-footer">
            <span>
              <Activity className="h-3.5 w-3.5" />
              Operational layer
            </span>
            <small>Budget · Site · Procurement · Cost</small>
            <em>Creation / 01</em>
          </footer>
        </section>

        <section className="cp-auth-panel">
          <div className="cp-auth-panel-inner">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="cp-auth-feature">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  )
}