/**
 * Reminders service.
 */
import { supabase } from './supabase'
import { createCollectionService } from './supabaseCrud'

const base = createCollectionService('reminders', { defaultOrderBy: 'send_at' })

export function pendingReminders(reminders, now = new Date()) {
  return reminders.filter((r) => !r.sent && r.send_at && new Date(r.send_at) <= now)
}

async function listByClient(clientId) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('client_id', clientId)
    .order('send_at', { ascending: false })
  if (error) throw error
  return data || []
}

function markSent(id) {
  return base.update(id, { sent: true })
}

export const remindersService = {
  ...base,
  listByClient,
  markSent,
  pendingReminders,
}

export default remindersService
