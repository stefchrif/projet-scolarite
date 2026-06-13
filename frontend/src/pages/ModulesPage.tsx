import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Module, ModuleRequest, Filiere, Enseignant } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'
import FormField from '../components/FormField'

const EMPTY: ModuleRequest = { code: '', intitule: '', semestre: '', filiereId: null, enseignantId: null }

export default function ModulesPage() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')
  const [items, setItems] = useState<Module[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<ModuleRequest>(EMPTY)
  const [error, setError] = useState('')

  const load = () => api.get<Module[]>('/modules').then((r) => setItems(r.data))
  useEffect(() => {
    load()
    api.get<Filiere[]>('/filieres').then((r) => setFilieres(r.data))
    api.get<Enseignant[]>('/enseignants').then((r) => setEnseignants(r.data))
  }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (m: Module) => {
    setForm({ code: m.code, intitule: m.intitule, semestre: m.semestre ?? '', filiereId: m.filiereId, enseignantId: m.enseignantId })
    setEditId(m.id); setError(''); setOpen(true)
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('')
    try {
      if (editId) await api.put(`/modules/${editId}`, form)
      else await api.post('/modules', form)
      setOpen(false); load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce module ?')) return
    await api.delete(`/modules/${id}`); load()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Modules</h2>
        {isAdmin && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Nouveau module
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Intitulé</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3">Filière</th>
              <th className="px-4 py-3">Enseignant</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{m.code}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{m.intitule}</td>
                <td className="px-4 py-3">{m.semestre ?? '—'}</td>
                <td className="px-4 py-3">{m.filiereNom ?? '—'}</td>
                <td className="px-4 py-3">{m.enseignantNom ?? '—'}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(m)} className="text-indigo-600 hover:underline">Modifier</button>
                    <button onClick={() => remove(m.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Aucun module</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editId ? 'Modifier le module' : 'Nouveau module'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required />
            <FormField label="Semestre (ex: S5)" value={form.semestre ?? ''} onChange={(v) => setForm({ ...form, semestre: v })} />
          </div>
          <FormField label="Intitulé" value={form.intitule} onChange={(v) => setForm({ ...form, intitule: v })} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Filière</label>
            <select value={form.filiereId ?? ''} onChange={(e) => setForm({ ...form, filiereId: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— Aucune —</option>
              {filieres.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Enseignant</label>
            <select value={form.enseignantId ?? ''} onChange={(e) => setForm({ ...form, enseignantId: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— Aucun —</option>
              {enseignants.map((en) => <option key={en.id} value={en.id}>{en.prenom} {en.nom}</option>)}
            </select>
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
