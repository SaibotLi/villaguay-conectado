import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import containerStyles from '../../../styles/container.module.css'
import isotype from '../../../assets/branding/isotype.png'
import styles from './Footer.module.css'

const navigationItems = [
  { to: '/', label: 'Inicio' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/sobre', label: 'Sobre nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

function Footer() {
  const { user } = useAuth()
  const accountItems = user
    ? [
        { to: '/mis-intereses', label: 'Mis intereses' },
        { to: '/proponer-evento', label: 'Proponer evento' },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Panel de administración' }] : []),
      ]
    : [{ to: '/proponer-evento', label: 'Proponer evento' }]

  return (
    <footer className={styles.footer}>
      <div className={`${containerStyles.container} ${styles.inner}`}>
        <section className={styles.brandColumn} aria-label="VillaguayConectado">
          <Link to="/" className={styles.brand}>
            <img src={isotype} alt="" className={styles.brandMark} />
            VillaguayConectado
          </Link>
          <p className={styles.description}>
            Una agenda simple para descubrir, compartir y proponer actividades en Villaguay.
          </p>
        </section>

        <nav className={styles.column} aria-label="Navegación del pie de página">
          <h2 className={styles.title}>Explorá</h2>
          <ul className={styles.linkList}>
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.column} aria-label="Accesos de cuenta">
          <h2 className={styles.title}>Participá</h2>
          <ul className={styles.linkList}>
            {accountItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.column} aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title" className={styles.title}>Contacto</h2>
          <ul className={styles.linkList}>
            <li>
              <a href="mailto:TobiL8485@gmail.com">TobiL8485@gmail.com</a>
            </li>
            <li>
              <a href="https://wa.me/5493455436036" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://instagram.com/tobias.linares" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className={`${containerStyles.container} ${styles.bottomBar}`}>
        <p>Proyecto Final · Universidad Nacional del Litoral</p>
        <a href="https://github.com/SaibotLi/villaguay-conectado" target="_blank" rel="noreferrer">
          Ver repositorio en GitHub
        </a>
      </div>
    </footer>
  )
}

export default Footer
