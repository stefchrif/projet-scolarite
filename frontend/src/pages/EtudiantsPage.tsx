import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Etudiant, EtudiantRequest, Filiere } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import Modal from '../components/Modal'

const EMPTY: EtudiantRequest = {
  nom: '', prenom: '', cne: '', email: '', dateNaissance: '', filiereId: null,
}

export default function EtudiantsPage() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<EtudiantRequest>(EMPTY)
  const [error, setError] = useState('')

  const load = () => {
    api.get<Etudiant[]>('/etudiants').then((r) => setEtudiants(r.data))
  }

  useEffect(() => {
    load()
    api.get<Filiere[]>('/filieres').then((r) => setFilieres(r.data))
  }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditId(null)
    setError('')
    setOpen(true)
  }

  const openEdit = (e: Etudiant) => {
    setForm({
      nom: e.nom, prenom: e.prenom, cne: e.cne, email: e.email,
      dateNaissance: e.dateNaissance ?? '', filiereId: e.filiereId,
    })
    setEditId(e.id)
    setError('')
    setOpen(true)
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    const payload = { ...form, dateNaissance: form.dateNaissance || null }
    try {
      if (editId) await api.put(`/etudiants/${editId}`, payload)
      else await api.post('/etudiants', payload)
      setOpen(false)
      load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur lors de l\'enregistrement')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Supprimer cet étudiant ?')) return
    await api.delete(`/etudiants/${id}`)
    load()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Étudiants</h2>
        {isAdmin && (
          <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Nouvel étudiant
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">CNE</th>
              <th className="px-4 py-3">Nom complet</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Filière</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {etudiants.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{e.cne}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{e.prenom} {e.nom}</td>
                <td className="px-4 py-3 text-slate-500">{e.email}</td>
                <td className="px-4 py-3">{e.filiereNom ?? '—'}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(e)} className="text-indigo-600 hover:underline">Modifier</button>
                    <button onClick={() => remove(e.id)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
            {etudiants.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Aucun étudiant</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editId ? 'Modifier l\'étudiant' : 'Nouvel étudiant'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} required />
            <Field label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required />
          </div>
          <Field label="CNE" value={form.cne} onChange={(v) => setForm({ ...form, cne: v })} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Date de naissance" type="date" value={form.dateNaissance ?? ''} onChange={(v) => setForm({ ...form, dateNaissance: v })} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Filière</label>
            <select
              value={form.filiereId ?? ''}
              onChange={(e) => setForm({ ...form, filiereId: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">— Aucune —</option>
              {filieres.map((f) => <option key={f.id} value={f.id}>{f.nom} ({f.niveau})</option>)}
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

function Field({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
      />
    </div>
  )
}
