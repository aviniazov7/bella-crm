/** Friendly placeholder shown when a list has no items. */
export function EmptyState({ message = 'אין נתונים להצגה', icon = '✦', action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 px-6 py-12 text-center">
      <span className="text-3xl text-gold/60" aria-hidden="true">
        {icon}
      </span>
      <p className="text-sm text-rose-soft/60">{message}</p>
      {action}
    </div>
  )
}

export default EmptyState
