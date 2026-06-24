/**
 * Toast store — a tiny global notification queue.
 * Components call addToast(); the <ToastContainer/> renders the list.
 */
import { create } from 'zustand'

let nextId = 1

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info', timeout = 4000) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    if (timeout) {
      setTimeout(() => get().removeToast(id), timeout)
    }
    return id
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}))

/** Convenience helpers so callers don't need to remember the type strings. */
export const toast = {
  success: (msg) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg) => useToastStore.getState().addToast(msg, 'error'),
  info: (msg) => useToastStore.getState().addToast(msg, 'info'),
}

export default useToastStore
