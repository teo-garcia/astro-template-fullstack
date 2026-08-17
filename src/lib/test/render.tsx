import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  render as tlRender,
  renderHook as tlRenderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react'
import { ThemeProvider } from 'better-themes'
import { createElement, type ReactNode } from 'react'

function createWrapper(queryClient?: QueryClient) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { gcTime: 0, retry: false },
        mutations: { retry: false },
      },
    })

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children)
  }
}

const QueryWrapper = createWrapper()

const AllProviders = ({ children }: React.PropsWithChildren) => (
  <QueryWrapper>
    <ThemeProvider attribute='class' defaultTheme='light'>
      {children}
    </ThemeProvider>
  </QueryWrapper>
)

const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => tlRender(ui, { wrapper: AllProviders, ...options })

const renderHookWithProviders = <Result, Properties>(
  hook: (initialProps: Properties) => Result,
  options?: Omit<RenderHookOptions<Properties>, 'wrapper'>
) => tlRenderHook(hook, { wrapper: AllProviders, ...options })

export { renderHookWithProviders as renderHook }
export { renderWithProviders as render }
export { screen, waitFor, within } from '@testing-library/react'
