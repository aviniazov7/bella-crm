/**
 * Clients service.
 */
import { createCollectionService } from './supabaseCrud'

const base = createCollectionService('clients', { defaultOrderBy: 'name' })

export function filterClients(clients, term) {
  if (!term) return clients
  const needle = term.trim().toLowerCase()
  return clients.filter((c) =>
    [c.name, c.phone, c.email].filter(Boolean).some((v) => String(v).toLowerCase().includes(needle))
  )
}

export const clientsService = {
  ...base,
  filterClients,
}

export default clientsService
