import { QueryClientProvider } from '@tanstack/react-query'
import { Zap } from 'lucide-react'
import { useState } from 'react'

import { useHealthcheck } from '~/lib/hooks/use-healthcheck'
import { createQueryClient } from '~/lib/query-client'

function HomePageContent() {
  const healthQuery = useHealthcheck()

  return (
    <section className='flex h-screen flex-col items-center justify-center gap-y-16'>
      <Zap className='size-48 text-primary lg:size-56 xl:size-72' />
      {healthQuery.data ? (
        <p className='text-sm text-muted-foreground'>
          Health status: {healthQuery.data.status}
        </p>
      ) : null}
    </section>
  )
}

// Astro hydrates each island separately, so this island cannot read the React
// context published by the `Providers` island in `base.astro`. It owns the
// QueryClient it needs instead.
export function HomePage() {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <HomePageContent />
    </QueryClientProvider>
  )
}
