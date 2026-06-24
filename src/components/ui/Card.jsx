/** Container card matching the dark brand surface. */
export function Card({ children, className = '', ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-rose-soft">{title}</h3>
        {subtitle && <p className="text-sm text-rose-soft/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default Card
