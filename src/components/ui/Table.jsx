import { Spinner } from './Spinner'
import { EmptyState } from './EmptyState'

/**
 * Generic data table.
 * @param {Array<{key:string,header:string,render?:(row)=>any,className?:string}>} columns
 * @param {Array} data
 */
export function Table({ columns, data, loading, emptyMessage = 'אין נתונים', onRowClick }) {
  if (loading) return <Spinner />
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-300">
      <table className="min-w-full divide-y divide-ink-300 text-sm">
        <thead className="bg-ink-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-3 text-right font-medium text-rose">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-300">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`transition-colors hover:bg-ink-200 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-rose-soft ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
