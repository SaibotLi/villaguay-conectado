import isotype from '../../assets/branding/isotype.png'
import styles from './EventPlaceholder.module.css'

/**
 * Placeholder gráfico institucional decorativo para eventos sin flyer o cuya imagen falló al cargar.
 * No repite metadatos ni títulos ya visibles en la tarjeta y se marca con aria-hidden="true"
 * para evitar redundancias semánticas en lectores de pantalla.
 */
function EventPlaceholder() {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <div className={styles.badge}>
        <img src={isotype} alt="" className={styles.mark} />
        <span className={styles.brandText}>VillaguayConectado</span>
      </div>
    </div>
  )
}

export default EventPlaceholder
