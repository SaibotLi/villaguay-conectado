import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import containerStyles from '../../../styles/container.module.css'
import isotype from '../../../assets/branding/isotype.png'
import Button from '../../ui/Button/Button'
import styles from './Navbar.module.css'

const baseNavItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/eventos', label: 'Eventos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contacto', label: 'Contacto' },
]

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = user
    ? [
        ...baseNavItems,
        { to: '/mis-intereses', label: 'Mis intereses' },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Panel de administración' }] : []),
      ]
    : baseNavItems

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
      <div className={`${containerStyles.container} ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <img src={isotype} alt="" className={styles.brandMark} />
          VillaguayConectado
        </Link>

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
        </nav>

        <div className={styles.authArea}>
          {user ? (
            <>
            {/* Actualiza la barra cuando cambia el usuario autenticado. */}
            <span className={styles.userText}>Hola, {user.displayName || user.email}</span>
            <Button type="button" variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">
                Ingresar
              </Button>
              <Button as={Link} to="/register" variant="primary">
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
