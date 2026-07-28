import { Link } from 'react-router-dom'
import styles from './Home.module.css'

function Home() {
  return (
    <section className={styles.page}>
      <h1>VillaguayConectado</h1>
      <p>
        Plataforma para centralizar la difusion de eventos locales de la ciudad de
        Villaguay.
      </p>
      <p>La funcionalidad completa sera implementada en proximas etapas.</p>

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
