import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EtudiantsPage from './pages/EtudiantsPage'
import EnseignantsPage from './pages/EnseignantsPage'
import FilieresPage from './pages/FilieresPage'
import ModulesPage from './pages/ModulesPage'
import InscriptionsPage from './pages/InscriptionsPage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/etudiants" element={<EtudiantsPage />} />
        <Route path="/enseignants" element={<EnseignantsPage />} />
        <Route path="/filieres" element={<FilieresPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/inscriptions" element={<InscriptionsPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
