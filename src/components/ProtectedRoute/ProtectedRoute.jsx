import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  // Espera a que el contexto termine de resolver el estado de autenticacion.
  if (loading) {
    return <p>Cargando...</p>
  }

  // Redirige a login cuando no existe una sesion iniciada.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Restringe el acceso cuando el rol requerido no coincide.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  // Renderiza la ruta cuando el acceso es valido.
  return children
}

export default ProtectedRoute
