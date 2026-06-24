/**
 * useDebounce — returns a debounced copy of a fast-changing value.
 * Used by search inputs so we don't filter on every keystroke.
 */
import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handle)
  }, [value, delay])

  return debounced
}

export default useDebounce
