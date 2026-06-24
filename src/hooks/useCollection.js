/**
 * useCollection — React Query bindings over a Bella CRM service object.
 *
 * Given a service that exposes list/create/update/remove, this hook returns the
 * cached list plus memoized mutations that keep the cache fresh. Centralizing it
 * means every feature page gets loading/error states and optimistic refetching
 * for free.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useCollection(key, service) {
  const queryClient = useQueryClient()
  const queryKey = [key]

  const query = useQuery({
    queryKey,
    queryFn: () => service.list(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const createMutation = useMutation({
    mutationFn: (data) => service.create(data),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: invalidate,
  })

  const removeMutation = useMutation({
    mutationFn: (id) => service.remove(id),
    onSuccess: invalidate,
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || removeMutation.isPending,
  }
}

export default useCollection
