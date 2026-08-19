import { Building2 } from 'lucide-react'

import type { Client } from '../types'

interface ClientBadgeProps {
  client?: Client | null
  name?: string | null
}

export function ClientBadge({
  client,
  name,
}: ClientBadgeProps) {
  const displayName = client?.name ?? name ?? 'No client assigned'

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Building2 className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">
          {displayName}
        </p>

        {client?.email && (
          <p className="truncate text-xs text-slate-400">
            {client.email}
          </p>
        )}
      </div>
    </div>
  )
}