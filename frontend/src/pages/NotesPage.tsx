import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Note, Inscription } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'

export default function NotesPage() {
  const { hasRole } = useAuth()
  const canEdit = hasRole('ADMIN', 'ENSEIGNANT')
  const [items, setItems] = useState<Note[]>([])
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [inscriptionId, setInscriptionId] = useState('')
  const [valeur, setValeur] = useState('')
  const [type, setType] = useState('CC')
  const [error, setError] = useState('')

  const load = () => api.get<Note[]>('/notes').then((r) => setItems(r.data))
  useEffect(() => {
    load()
    api.get<Inscription[]>('/inscriptions').then((r) => setInscriptions(r.data))
  }, [])

  const openCreate = () => { setEditId(null); setInscriptionId(''); setValeur(''); setType('CC'); setError(''); setOpen(true) }
  const openEdit = (n: Note) => {
    setEditId(n.id); setInscriptionId(String(n.inscriptionId)); setValeur(String(n.valeur)); setType(n.type); setError(''); setOpen(true)
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    const payload = { inscriptionId: Number(inscriptionId), valeur: Number(valeur), type }
    try {
      if (editId) await api.put(`/notes/${editId}`, payload)
      else await api.post('/notes', payload)
      setOpen(false); load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette note ?')) return
    await api.delete(`/notes/${id}`); load()
  }

  const color = (v: number) => (v >= 10 ? 'text-emerald-600' : 'text-red-600')

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Notes</h2>
        {canEdit && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Saisir une note
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Étudiant</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Note /20</th>
              {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{n.etudiantNom}</td>
                <td className="px-4 py-3">{n.moduleIntitule}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{n.type}</span>
                </td>
                <td className={`px-4 py-3 font-bold ${color(n.valeur)}`}>{n.valeur.toFixed(2)}</td>
                {canEdit && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(n)} className="text-indigo-600 hover:underline">Modifier</button>
                    <button onClick={() => remove(n.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Aucune note</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editId ? 'Modifier la note' : 'Saisir une note'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Inscription (étudiant · module)</label>
            <select value={inscriptionId} onChange={(e) => setInscriptionId(e.target.value)} required disabled={!!editId}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100">
              <option value="">— Choisir —</option>
              {inscriptions.map((i) => <option key={i.id} value={i.id}>{i.etudiantNom} · {i.moduleIntitule}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Note /20</label>
              <input type="number" step="0.25" min="0" max="20" value={valeur} onChange={(e) => setValeur(e.target.value)} required
                className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="CC">Contrôle continu</option>
                <option value="EXAM">Examen</option>
              </select>
            </div>
          </div>
          {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Enregistrer</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
