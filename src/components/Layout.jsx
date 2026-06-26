import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Images,
  BellRing,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { signOut } from '../services/auth'
import { useUiStore } from '../store/uiStore'
import { useToast } from '../hooks/useToast'
import { cn } from '../lib/cn'

const NAV_ITEMS = [
  { to: '/', label: 'דשבורד', icon: LayoutDashboard, end: true },
  { to: '/clients', label: 'לקוחות', icon: Users },
  { to: '/calendar', label: 'יומן', icon: CalendarDays },
  { to: '/payments', label: 'תשלומים', icon: CreditCard },
  { to: '/photos', label: 'תמונות', icon: Images },
  { to: '/reminders', label: 'תזכורות', icon: BellRing },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-cream' : 'text-muted hover:text-cream hover:bg-white/[0.03]'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-white/[0.05]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    'relative z-10 h-[18px] w-[18px] transition-colors',
                    isActive ? 'text-gold' : 'text-muted group-hover:text-cream'
                  )}
                />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <div className="mb-8 flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient text-ink shadow-gold">
        <Sparkles className="h-5 w-5" />
      </span>
      <div>
        <p className="font-serif text-lg font-bold leading-none text-cream">Bella</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Beauty Studio</p>
      </div>
    </div>
  )
}

/** App shell: animated sidebar + top bar + page transitions. */
export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const closeSidebar = useUiStore((s) => s.closeSidebar)

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('התנתקת בהצלחה')
      navigate('/login')
    } catch {
      toast.error('שגיאה בהתנתקות')
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-ink text-cream">
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-40 w-64 transform border-l border-line bg-ink-100/80 p-4 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        )}
      >
        <Brand />
        <NavItems onNavigate={closeSidebar} />
        <div className="absolute inset-x-4 bottom-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-rose-deep/10 hover:text-rose"
          >
            <LogOut className="h-[18px] w-[18px]" />
            התנתקות
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink/70 px-4 py-3 backdrop-blur-xl md:px-8">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-cream md:hidden"
            aria-label="תפריט"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 px-4 py-6 md:px-10 md:py-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Layout
