import { NavLink } from 'react-router-dom'
import {
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Settings,
  Users,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/bills', label: 'Bills', icon: ReceiptText },
  { to: '/bills/new/sale', label: 'New sale', icon: FilePlus2 },
  { to: '/bills/new/purchase', label: 'New purchase', icon: FilePlus2 },
  { to: '/parties', label: 'Parties', icon: Users },
  { to: '/items', label: 'Items', icon: Package },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="flex w-full flex-col border-b border-emerald-950/10 bg-[#071c16] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">Ideal Energy</p>
        <h1 className="mt-1 text-lg font-bold">Billing Portal</h1>
        <p className="mt-2 truncate text-xs text-white/55">{user?.email}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-visible">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                isActive ? 'bg-lime-300 text-emerald-950' : 'text-white/75 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
