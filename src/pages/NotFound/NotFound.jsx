import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <section className={styles.page}>
      <h1>404 - Pagina no encontrada</h1>
      <p>La ruta solicitada no existe en esta etapa del proyecto.</p>
      <Link to="/" className={styles.link}>
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFound
