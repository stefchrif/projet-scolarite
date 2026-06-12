import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Filiere } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'
import FormField from '../components/FormField'

type Form = { nom: string; niveau: string }
const EMPTY: Form = { nom: '', niveau: '' }

export default function FilieresPage() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')
  const [items, setItems] = useState<Filiere[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [error, setError] = useState('')

  const load = () => api.get<Filiere[]>('/filieres').then((r) => setItems(r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (f: Filiere) => { setForm({ nom: f.nom, niveau: f.niveau }); setEditId(f.id); setError(''); setOpen(true) }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    try {
      if (editId) await api.put(`/filieres/${editId}`, form)
      else await api.post('/filieres', form)
      setOpen(false); load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette filière ?')) return
    await api.delete(`/filieres/${id}`); load()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Filières</h2>
        {isAdmin && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Nouvelle filière
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Niveau</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{f.nom}</td>
                <td className="px-4 py-3">{f.niveau}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(f)} className="text-indigo-600 hover:underline">Modifier</button>
                    <button onClick={() => remove(f.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">Aucune filière</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editId ? 'Modifier la filière' : 'Nouvelle filière'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <FormField label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required />
          <FormField label="Niveau (ex: Licence 3)" value={form.niveau} onChange={(v) => setForm({ ...form, niveau: v })} required />
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
