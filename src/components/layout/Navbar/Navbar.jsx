import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import styles from './Navbar.module.css'

const baseNavItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/eventos', label: 'Eventos' },
  { to: '/comunidad', label: 'Comunidad' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contacto', label: 'Contacto' },
]

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = user
    ? [...baseNavItems, { to: '/mis-intereses', label: 'Mis intereses' }]
    : [...baseNavItems, { to: '/login', label: 'Ingresar' }, { to: '/register', label: 'Registrarse' }]

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      // Finaliza la sesión y permite que el contexto actualice toda la interfaz.
      await logout()
      navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className={styles.header}>
      <nav aria-label="Navegacion principal" className={styles.nav}>
        <ul className={styles.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {user ? (
          <div className={styles.authArea}>
            {/* Actualiza la barra cuando cambia el usuario autenticado. */}
            <span className={styles.userText}>Hola, {user.displayName || user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={styles.logoutButton}
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
