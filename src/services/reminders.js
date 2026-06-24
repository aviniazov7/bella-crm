/**
 * Reminders service.
 * Schema: { clientId, appointmentId, message, sendAt, sent }
 */
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { createCollectionService, mapDoc } from './firestoreCrud'

const base = createCollectionService('reminders', { defaultOrderBy: 'sendAt' })

/** Reminders whose sendAt is in the past and that have not been sent yet. */
export function pendingReminders(reminders, now = new Date()) {
  return reminders.filter((r) => !r.sent && r.sendAt && new Date(r.sendAt) <= now)
}

/** Fetch reminders for a given client. */
async function listByClient(clientId) {
  const q = query(
    collection(db, 'reminders'),
    where('clientId', '==', clientId),
    orderBy('sendAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapDoc)
}

/** Mark a reminder as sent. */
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
