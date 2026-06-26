import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { EmptyState } from './EmptyState'

/** Data table with animated rows, hover states + skeleton loading. */
export function Table({
  columns,
  data,
  loading,
  emptyMessage = 'אין נתונים',
  emptyState,
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl">
        <div className="flex flex-col divide-y divide-line/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-4">
              {columns.map((c) => (
                <div key={c.key} className="skeleton h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return emptyState || <EmptyState message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/80',
                  c.className
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.id ?? i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
              onClick={() => onRowClick?.(row)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              className={cn(
                'border-b border-line/60 text-cream/90 last:border-0',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn('px-5 py-4 align-middle', c.cellClassName)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
