// Types TypeScript correspondant aux DTO du backend Spring Boot.

export type Role = 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT'

export interface AuthResponse {
  token: string
  username: string
  nomComplet: string
  role: Role
}

export interface Filiere {
  id: number
  nom: string
  niveau: string
}

export interface Etudiant {
  id: number
  nom: string
  prenom: string
  cne: string
  email: string
  dateNaissance: string | null
  filiereId: number | null
  filiereNom: string | null
}

export interface EtudiantRequest {
  nom: string
  prenom: string
  cne: string
  email: string
  dateNaissance: string | null
  filiereId: number | null
}

export interface Enseignant {
  id: number
  nom: string
  prenom: string
  email: string
  specialite: string | null
}

export interface Module {
  id: number
  code: string
  intitule: string
  semestre: string | null
  filiereId: number | null
  filiereNom: string | null
  enseignantId: number | null
  enseignantNom: string | null
}

export interface ModuleRequest {
  code: string
  intitule: string
  semestre: string | null
  filiereId: number | null
  enseignantId: number | null
}

export interface Inscription {
  id: number
  etudiantId: number
  etudiantNom: string
  moduleId: number
  moduleIntitule: string
  dateInscription: string
}

export interface Note {
  id: number
  inscriptionId: number
  etudiantId: number
  etudiantNom: string
  moduleId: number
  moduleIntitule: string
  valeur: number
  type: string
}

export interface DashboardStats {
  nbEtudiants: number
  nbEnseignants: number
  nbFilieres: number
  nbModules: number
  nbInscriptions: number
  nbNotes: number
}
