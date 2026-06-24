/**
 * UI store — global interface state such as the mobile sidebar toggle.
 */
import { create } from 'zustand'

export const useUiStore = create((set) => ({
  sidebarOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}))

export default useUiStore
