import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../api/types'

interface NavItem {
  to: string
  label: string
  icon: string
  roles?: Role[]
}

const NAV: NavItem[] = [
  { to: '/', label: 'Tableau de bord', icon: '📊' },
  { to: '/etudiants', label: 'Étudiants', icon: '🎓' },
  { to: '/enseignants', label: 'Enseignants', icon: '👨‍🏫' },
  { to: '/filieres', label: 'Filières', icon: '🏛️' },
  { to: '/modules', label: 'Modules', icon: '📚' },
  { to: '/inscriptions', label: 'Inscriptions', icon: '📝' },
  { to: '/notes', label: 'Notes', icon: '✅' },
]

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrateur',
  ENSEIGNANT: 'Enseignant',
  ETUDIANT: 'Étudiant',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white">ScolaritéApp</h1>
          <p className="text-xs text-slate-400">Gestion de scolarité · UIT</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.filter((i) => !i.roles || (user && i.roles.includes(user.role))).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700 text-xs text-slate-400">
          v1.0 · Spring Boot + React
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="text-sm text-slate-500">Espace {user ? ROLE_LABEL[user.role] : ''}</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-800">{user?.nomComplet}</div>
              <div className="text-xs text-slate-400">@{user?.username}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {user?.nomComplet?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
