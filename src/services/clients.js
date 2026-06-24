/**
 * Clients service.
 * Schema: { name, phone, email, birthdate, notes, createdAt, updatedAt }
 */
import { createCollectionService } from './firestoreCrud'

const base = createCollectionService('clients', { defaultOrderBy: 'name' })

/**
 * Case-insensitive client-side search across name / phone / email.
 * @param {Array} clients
 * @param {string} term
 */
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
