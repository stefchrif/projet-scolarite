import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../api/types'

interface Props {
  children: ReactNode
  roles?: Role[]
}

/** Protege une route : redirige vers /login si non connecte, vers / si role insuffisant. */
export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
