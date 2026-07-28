import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/eventos', label: 'Eventos' },
  { to: '/comunidad', label: 'Comunidad' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/login', label: 'Ingresar' },
]

function Navbar() {
  return (
    <header className={styles.header}>
      <nav aria-label="Navegacion principal">
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
    </header>
  )
}

export default Navbar
