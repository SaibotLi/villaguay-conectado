import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          La dirección a la que intentás acceder no existe o fue movida.
        </p>
        <div>
          <Button as={Link} to="/" variant="primary">
            Volver al inicio
          </Button>
        </div>
      </div>
    </section>
  )
}

export default NotFound
