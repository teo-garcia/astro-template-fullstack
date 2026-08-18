import { QueryClientProvider } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { useHealthcheck } from '~/lib/hooks/use-healthcheck'
import { createQueryClient } from '~/lib/query-client'

const HEALTH_STATUS_DOT = {
  degraded: 'bg-yellow-500 ring-yellow-500/20',
  down: 'bg-red-500 ring-red-500/20',
  ok: 'bg-green-500 ring-green-500/20',
}

// Exported for tests: `HealthStatus` below owns a production QueryClient
// (retry: 2), which would outlive a test's timeout on the error path. Tests
// render this against the shared test providers instead, exactly like the other
// templates.
export function HealthStatusContent() {
  const healthQuery = useHealthcheck()
  const health = healthQuery.data
  const statusLabel = healthQuery.isPending
    ? 'CHECKING'
    : (health?.status ?? 'unreachable').toUpperCase()

  return (
    <div
      aria-live='polite'
      className='group fixed left-4 top-4 z-50 flex items-center rounded-full border border-border/60 bg-card/80 px-1.5 py-1.5 shadow-sm backdrop-blur-md md:left-8 md:top-8'
      role='status'
    >
      {healthQuery.isPending ? (
        <LoaderCircle
          aria-hidden='true'
          className='size-2.5 animate-spin text-muted-foreground'
        />
      ) : (
        <span
          aria-hidden='true'
          className={`size-2.5 rounded-full ring-4 ${
            health ? HEALTH_STATUS_DOT[health.status] : HEALTH_STATUS_DOT.down
          }`}
        />
      )}
      <span className='ml-0 grid grid-cols-[0fr] transition-all duration-300 ease-out group-hover:ml-2 group-hover:grid-cols-[1fr]'>
        <span className='min-w-0 overflow-hidden whitespace-nowrap text-xs font-medium tracking-wide text-muted-foreground'>
          {statusLabel}
        </span>
      </span>
    </div>
  )
}

// Astro hydrates each island separately, so this island cannot read the React
// context published by the `Providers` island in `base.astro`. It owns the
// QueryClient it needs instead.
export function HealthStatus() {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <HealthStatusContent />
    </QueryClientProvider>
  )
}
