import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

/** Accessible modal with spring entrance + glass backdrop. */
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-100/95 shadow-soft-lg backdrop-blur-2xl',
              SIZES[size]
            )}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <h2 className="font-serif text-lg font-semibold text-cream">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="סגירה"
                  className="rounded-lg p-1.5 text-cream/50 transition-colors hover:bg-white/5 hover:text-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
