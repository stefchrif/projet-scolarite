import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Inscription, Etudiant, Module } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'

export default function InscriptionsPage() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')
  const [items, setItems] = useState<Inscription[]>([])
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [open, setOpen] = useState(false)
  const [etudiantId, setEtudiantId] = useState('')
  const [moduleId, setModuleId] = useState('')
  const [error, setError] = useState('')

  const load = () => api.get<Inscription[]>('/inscriptions').then((r) => setItems(r.data))
  useEffect(() => {
    load()
    api.get<Etudiant[]>('/etudiants').then((r) => setEtudiants(r.data))
    api.get<Module[]>('/modules').then((r) => setModules(r.data))
  }, [])

  const openCreate = () => { setEtudiantId(''); setModuleId(''); setError(''); setOpen(true) }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    try {
      await api.post('/inscriptions', { etudiantId: Number(etudiantId), moduleId: Number(moduleId) })
      setOpen(false); load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette inscription ?')) return
    await api.delete(`/inscriptions/${id}`); load()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Inscriptions</h2>
        {isAdmin && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Nouvelle inscription
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Étudiant</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Date</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{i.etudiantNom}</td>
                <td className="px-4 py-3">{i.moduleIntitule}</td>
                <td className="px-4 py-3 text-slate-500">{i.dateInscription}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(i.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Aucune inscription</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Nouvelle inscription" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Étudiant</label>
            <select value={etudiantId} onChange={(e) => setEtudiantId(e.target.value)} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— Choisir —</option>
              {etudiants.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom} ({e.cne})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Module</label>
            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— Choisir —</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.intitule} ({m.code})</option>)}
            </select>
          </div>
          {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Inscrire</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
