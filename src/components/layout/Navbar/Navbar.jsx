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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = user
    ? [
        ...baseNavItems,
        { to: '/mis-intereses', label: 'Mis intereses' },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Panel de administración' }] : []),
      ]
    : baseNavItems

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

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
        <div className={styles.topRow}>
          <Link to="/" className={styles.brand} onClick={closeMenu}>
            <img src={isotype} alt="" className={styles.brandMark} />
            VillaguayConectado
          </Link>

          <button
            type="button"
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg
                className={styles.hamburgerIcon}
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className={styles.hamburgerIcon}
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`${styles.menuContainer} ${isMenuOpen ? styles.menuOpen : ''}`}
        >
          <nav aria-label="Navegacion principal" className={styles.nav}>
            <ul className={styles.list}>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeMenu}
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
                <span className={styles.userText}>Hola, {user.displayName || user.email}</span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    closeMenu()
                    handleLogout()
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" onClick={closeMenu}>
                  Ingresar
                </Button>
                <Button as={Link} to="/register" variant="primary" onClick={closeMenu}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
