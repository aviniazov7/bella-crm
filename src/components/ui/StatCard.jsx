import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from './Card'
import { cn } from '../../lib/cn'

/** Animated count-up that preserves any non-digit prefix/suffix (e.g. currency). */
function CountUp({ value }) {
  const isNumeric = typeof value === 'number'
  const str = String(value)
  const match = str.match(/-?[\d,]+(\.\d+)?/)
  const target = isNumeric ? value : match ? parseFloat(match[0].replace(/,/g, '')) : null
  const [display, setDisplay] = useState(target === null ? str : '0')

  useEffect(() => {
    if (target === null) {
      setDisplay(str)
      return
    }
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const rounded = Number.isInteger(target) ? Math.round(v) : v.toFixed(0)
        const formatted = Number(rounded).toLocaleString('he-IL')
        setDisplay(isNumeric ? formatted : str.replace(match[0], formatted))
      },
    })
    return () => controls.stop()
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span>{display}</span>
}

const ACCENTS = {
  gold: { badge: 'text-gold', stroke: '#c9a96e', fill: 'rgba(201,169,110,0.12)' },
  rose: { badge: 'text-rose', stroke: '#d4a5a5', fill: 'rgba(212,165,165,0.12)' },
  neutral: { badge: 'text-muted', stroke: '#6f6f6f', fill: 'rgba(160,160,160,0.10)' },
}

/** Tiny inline area sparkline. */
function Sparkline({ data, stroke, fill }) {
  if (!data || data.length < 2) return null
  const w = 120
  const h = 36
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((d, i) => [i * step, h - ((d - min) / range) * (h - 6) - 3])
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z'
  return (
    <svg viewBox={'0 0 ' + w + ' ' + h} preserveAspectRatio="none" className="h-9 w-full" aria-hidden="true">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Dashboard metric tile: label, count-up value, trend indicator + sparkline. */
export function StatCard({ label, value, icon, accent = 'neutral', trend, spark }) {
  const a = ACCENTS[accent] || ACCENTS.neutral
  const up = typeof trend === 'number' ? trend >= 0 : null
  return (
    <Card hover className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        {icon && <span className={cn('shrink-0', a.badge)}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-serif text-3xl font-bold leading-none text-cream">
          <CountUp value={value} />
        </p>
        {up !== null && (
          <span className={cn('mb-1 flex items-center gap-1 text-xs font-medium', up ? 'text-positive' : 'text-negative')}>
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {(up ? '+' : '') + trend + '%'}
          </span>
        )}
      </div>
      <div className="-mb-1">
        <Sparkline data={spark} stroke={a.stroke} fill={a.fill} />
      </div>
      {up !== null && <p className="text-[11px] text-muted/70">מהחודש שעבר</p>}
    </Card>
  )
}

export default StatCard
