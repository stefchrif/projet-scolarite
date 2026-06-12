import { useEffect, useState } from 'react'
import api from '../api/client'
import type { DashboardStats } from '../api/types'
import { useAuth } from '../auth/AuthContext'

const CARDS: { key: keyof DashboardStats; label: string; icon: string; color: string }[] = [
  { key: 'nbEtudiants', label: 'Étudiants', icon: '🎓', color: 'bg-indigo-500' },
  { key: 'nbEnseignants', label: 'Enseignants', icon: '👨‍🏫', color: 'bg-emerald-500' },
  { key: 'nbFilieres', label: 'Filières', icon: '🏛️', color: 'bg-amber-500' },
  { key: 'nbModules', label: 'Modules', icon: '📚', color: 'bg-rose-500' },
  { key: 'nbInscriptions', label: 'Inscriptions', icon: '📝', color: 'bg-sky-500' },
  { key: 'nbNotes', label: 'Notes saisies', icon: '✅', color: 'bg-violet-500' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/stats').then((r) => setStats(r.data))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Bonjour, {user?.nomComplet} 👋</h2>
      <p className="mb-6 text-slate-500">Voici un aperçu de votre établissement.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.key} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${c.color} bg-opacity-15`}>
              {c.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats ? stats[c.key] : '—'}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
