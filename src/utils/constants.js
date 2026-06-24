/** Shared domain constants used across the UI. */

export const SERVICE_TYPES = [
  'מניקור',
  'פדיקור',
  'לק ג׳ל',
  'בניית ציפורניים',
  'איפור',
  'עיצוב גבות',
  'טיפול פנים',
  'הסרת שיער',
]

export const APPOINTMENT_STATUS_LABELS = {
  scheduled: 'מתוכנן',
  completed: 'הושלם',
  cancelled: 'בוטל',
  'no-show': 'לא הגיע/ה',
}

export const APPOINTMENT_STATUS_VARIANTS = {
  scheduled: 'gold',
  completed: 'green',
  cancelled: 'rose',
  'no-show': 'gray',
}

export const PAYMENT_METHOD_LABELS = {
  cash: 'מזומן',
  card: 'אשראי',
  transfer: 'העברה',
  bit: 'ביט',
}

export const PAYMENT_STATUS_LABELS = {
  paid: 'שולם',
  pending: 'ממתין',
  refunded: 'הוחזר',
}

export const PAYMENT_STATUS_VARIANTS = {
  paid: 'green',
  pending: 'gold',
  refunded: 'rose',
}

export const DURATIONS = [30, 45, 60, 90, 120]
