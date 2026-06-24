/**
 * useToast — convenience accessor to the toast store's actions.
 */
import { useToastStore } from '../store/toastStore'

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)
  return {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }
}

export default useToast
