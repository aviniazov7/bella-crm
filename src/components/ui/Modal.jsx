import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Accessible modal dialog. Closes on Escape and backdrop click; locks body
 * scroll while open. Rendered through a portal so it escapes overflow contexts.
 */
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const width = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size]

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${width} rounded-t-2xl border border-ink-300 bg-ink-100 shadow-glow
          sm:rounded-2xl`}
      >
        <div className="flex items-center justify-between border-b border-ink-300 px-5 py-4">
          <h2 className="text-lg font-semibold text-rose-soft">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="rounded-md p-1 text-rose-soft/60 hover:bg-ink-200 hover:text-rose-soft"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-300 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default Modal
