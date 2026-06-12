import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Enseignant } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'
import FormField from '../components/FormField'

type Form = { nom: string; prenom: string; email: string; specialite: string }
const EMPTY: Form = { nom: '', prenom: '', email: '', specialite: '' }

export default function EnseignantsPage() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')
  const [items, setItems] = useState<Enseignant[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [error, setError] = useState('')

  const load = () => api.get<Enseignant[]>('/enseignants').then((r) => setItems(r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (e: Enseignant) => {
    setForm({ nom: e.nom, prenom: e.prenom, email: e.email, specialite: e.specialite ?? '' })
    setEditId(e.id); setError(''); setOpen(true)
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    try {
      if (editId) await api.put(`/enseignants/${editId}`, form)
      else await api.post('/enseignants', form)
      setOpen(false); load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cet enseignant ?')) return
    await api.delete(`/enseignants/${id}`); load()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Enseignants</h2>
        {isAdmin && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Nouvel enseignant
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom complet</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Spécialité</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{e.prenom} {e.nom}</td>
                <td className="px-4 py-3 text-slate-500">{e.email}</td>
                <td className="px-4 py-3">{e.specialite ?? '—'}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(e)} className="text-indigo-600 hover:underline">Modifier</button>
                    <button onClick={() => remove(e.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Aucun enseignant</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editId ? 'Modifier l\'enseignant' : 'Nouvel enseignant'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} required />
            <FormField label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required />
          </div>
          <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <FormField label="Spécialité" value={form.specialite} onChange={(v) => setForm({ ...form, specialite: v })} />
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
