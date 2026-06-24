import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../services/auth'
import { useUiStore } from '../store/uiStore'
import { useToast } from '../hooks/useToast'
import { Button } from './ui/Button'

const NAV_ITEMS = [
  { to: '/', label: 'דשבורד', icon: '◈', end: true },
  { to: '/clients', label: 'לקוחות', icon: '👤' },
  { to: '/calendar', label: 'יומן', icon: '📅' },
  { to: '/payments', label: 'תשלומים', icon: '💳' },
  { to: '/photos', label: 'תמונות', icon: '🖼' },
  { to: '/reminders', label: 'תזכורות', icon: '🔔' },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gold/15 text-gold'
                : 'text-rose-soft/70 hover:bg-ink-200 hover:text-rose-soft'
            }`
          }
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** App shell: responsive sidebar + top bar + routed content. */
export function Layout() {
  const navigate = useNavigate()
  const toast = useToast()
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUiStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('התנתקת בהצלחה')
      navigate('/login')
    } catch {
      toast.error('שגיאה בהתנתקות')
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-ink text-rose-soft">
      {/* Sidebar — fixed on desktop, slide-over on mobile */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 transform border-l border-ink-300 bg-ink-100 p-4
          transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}
      >
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl">💅</span>
          <span className="bg-gradient-to-l from-gold to-rose bg-clip-text text-xl font-bold text-transparent">
            Bella CRM
          </span>
        </div>
        <NavItems onNavigate={closeSidebar} />
        <div className="absolute inset-x-4 bottom-4">
          <Button variant="secondary" className="w-full" onClick={handleSignOut}>
            התנתקות
          </Button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-300 bg-ink-100/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="פתח תפריט"
            className="rounded-md p-2 text-rose-soft hover:bg-ink-200"
          >
            ☰
          </button>
          <span className="font-semibold text-gold">Bella CRM</span>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
