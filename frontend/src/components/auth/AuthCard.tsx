import type { ReactNode } from 'react'

export default function AuthCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`cp-auth-card ${className}`}>
      {children}
    </div>
  )
}