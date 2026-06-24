import { Card } from './Card'

/** Dashboard metric tile. */
export function StatCard({ label, value, icon, accent = 'gold' }) {
  const accentClass = accent === 'rose' ? 'text-rose' : 'text-gold'
  return (
    <Card className="flex items-center gap-4">
      {icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-200 text-2xl ${accentClass}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-rose-soft/60">{label}</p>
        <p className={`text-2xl font-bold ${accentClass}`}>{value}</p>
      </div>
    </Card>
  )
}

export default StatCard
