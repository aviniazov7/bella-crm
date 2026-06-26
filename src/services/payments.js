/**
 * Payments service.
 */
import { supabase } from './supabase'
import { createCollectionService } from './supabaseCrud'

const base = createCollectionService('payments', { defaultOrderBy: 'date' })

export const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'bit']
export const PAYMENT_STATUSES = ['paid', 'pending', 'refunded']

async function listByClient(clientId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export function totalRevenue(payments) {
  return payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
}

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
