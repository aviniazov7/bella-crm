import { useToastStore } from '../../store/toastStore'

const STYLES = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-deep/50 bg-rose-deep/10 text-rose',
  info: 'border-gold/40 bg-gold/10 text-gold',
}

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }

/** Fixed-position container that renders the global toast queue. */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[60] flex w-[92%] max-w-sm -translate-x-1/2 flex-col gap-2"
      aria-live="assertive"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm
            shadow-glow backdrop-blur ${STYLES[t.type] || STYLES.info}`}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{ICONS[t.type] || ICONS.info}</span>
            {t.message}
          </span>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            aria-label="סגור התראה"
            className="opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
