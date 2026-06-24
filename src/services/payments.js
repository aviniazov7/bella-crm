/**
 * Payments service.
 * Schema: { clientId, amount, date, method, status, appointmentId }
 * method ∈ 'cash' | 'card' | 'transfer' | 'bit'
 * status ∈ 'paid' | 'pending' | 'refunded'
 */
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { createCollectionService, mapDoc } from './firestoreCrud'

const base = createCollectionService('payments', { defaultOrderBy: 'date' })

export const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'bit']
export const PAYMENT_STATUSES = ['paid', 'pending', 'refunded']

/** Fetch all payments belonging to a client. */
async function listByClient(clientId) {
  const q = query(
    collection(db, 'payments'),
    where('clientId', '==', clientId),
    orderBy('date', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapDoc)
}

/** Sum the amounts of `paid` payments. */
export function totalRevenue(payments) {
  return payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
}

/** Sum `paid` payments whose date falls within the given month (Date object). */
export function revenueForMonth(payments, reference = new Date()) {
  const year = reference.getFullYear()
  const month = reference.getMonth()
  return totalRevenue(
    payments.filter((p) => {
      if (!p.date) return false
      const d = new Date(p.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
  )
}

export const paymentsService = {
  ...base,
  listByClient,
  totalRevenue,
  revenueForMonth,
  METHODS: PAYMENT_METHODS,
  STATUSES: PAYMENT_STATUSES,
}

export default paymentsService
