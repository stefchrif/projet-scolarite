interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}

/** Champ de saisie texte reutilisable. */
export default function FormField({ label, value, onChange, type = 'text', required = false }: Props) {
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
