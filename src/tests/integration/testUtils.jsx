import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Render a component wrapped in the providers it needs: React Query + Router.
 * Returns everything from RTL's render plus the query client.
 */
export function renderWithProviders(ui, { route = '/', routerProps = {} } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]} {...routerProps}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  )

  return { ...result, queryClient }
}

/** A small list of fake clients shared across integration tests. */
export const fakeClients = [
  { id: 'c1', name: 'בלה כהן', phone: '0501112222', email: 'bella@x.com' },
  { id: 'c2', name: 'דנה לוי', phone: '0523334444', email: 'dana@y.com' },
]
