import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCollection } from '../../hooks/useCollection'

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

function fakeService() {
  return {
    list: vi.fn().mockResolvedValue([{ id: '1', name: 'A' }]),
    create: vi.fn().mockResolvedValue({ id: '2', name: 'B' }),
    update: vi.fn().mockResolvedValue({ id: '1', name: 'A2' }),
    remove: vi.fn().mockResolvedValue('1'),
  }
}

describe('useCollection', () => {
  it('loads items from the service', async () => {
    const service = fakeService()
    const { result } = renderHook(() => useCollection('widgets', service), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toEqual([{ id: '1', name: 'A' }])
  })

  it('create() calls the service and refetches', async () => {
    const service = fakeService()
    const { result } = renderHook(() => useCollection('widgets', service), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => {
      await result.current.create({ name: 'B' })
    })
    expect(service.create).toHaveBeenCalledWith({ name: 'B' })
  })

  it('remove() calls the service with the id', async () => {
    const service = fakeService()
    const { result } = renderHook(() => useCollection('widgets', service), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => {
      await result.current.remove('1')
    })
    expect(service.remove).toHaveBeenCalledWith('1')
  })
})
