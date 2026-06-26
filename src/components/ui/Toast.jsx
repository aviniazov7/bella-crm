import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'
import { cn } from '../../lib/cn'

const STYLES = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-deep/40 bg-rose-deep/10 text-rose',
  info: 'border-gold/30 bg-gold/10 text-gold',
}

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }

/** Fixed-position container that renders the global toast queue. */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      className="fixed bottom-5 left-1/2 z-[60] flex w-[92%] max-w-sm -translate-x-1/2 flex-col gap-2.5"
      aria-live="assertive"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || ICONS.info
          return (
            <motion.div
              key={t.id}
              role="alert"
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-glow backdrop-blur-xl',
                STYLES[t.type] || STYLES.info
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-5 w-5 shrink-0" />
                {t.message}
              </span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="סגור התראה"
                className="opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
