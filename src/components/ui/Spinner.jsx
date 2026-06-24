/** Centered loading spinner. */
export function Spinner({ size = 'md', label = 'טוען...', className = '' }) {
  const dimensions = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size]
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`${dimensions} animate-spin rounded-full border-2 border-gold border-t-transparent`}
      />
      {label && <span className="text-sm text-rose-soft/60">{label}</span>}
    </div>
  )
}

export default Spinner
