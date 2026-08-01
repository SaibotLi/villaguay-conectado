import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import styles from './Home.module.css'

function Home() {
  const { user } = useAuth()

  const userStatus = user
    ? `Bienvenido, ${user.displayName || user.email}`
    : 'No hay ningún usuario autenticado.'

  return (
    <section className={styles.page}>
      <h1>VillaguayConectado</h1>
      <p>
        Plataforma para centralizar la difusion de eventos locales de la ciudad de
        Villaguay.
      </p>
      <p>La funcionalidad completa sera implementada en proximas etapas.</p>
      {/* Estado temporal para validar la sincronizacion del contexto de autenticacion. */}
      <p className={styles.authStatus}>{userStatus}</p>

      <nav aria-label="Accesos principales" className={styles.links}>
        <Link to="/eventos" className={styles.link}>
          Eventos
        </Link>
        <Link to="/comunidad" className={styles.link}>
          Comunidad
        </Link>
        <Link to="/sobre" className={styles.link}>
          Sobre
        </Link>
        <Link to="/contacto" className={styles.link}>
          Contacto
        </Link>
      </nav>
    </section>
  )
}

export default Home
