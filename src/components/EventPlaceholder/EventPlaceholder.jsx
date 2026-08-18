import isotype from '../../assets/branding/isotype.png'
import styles from './EventPlaceholder.module.css'

function EventPlaceholder({ title, date, time }) {
  return (
    <div className={styles.placeholder}>
      <img src={isotype} alt="" className={styles.mark} />
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.metaRow}>
        <p className={styles.metaLabel}>Fecha</p>
        <p className={styles.metaValue}>{date}</p>
      </div>
      <div className={styles.metaRow}>
        <p className={styles.metaLabel}>Hora</p>
        <p className={styles.metaValue}>{time}</p>
      </div>
    </div>
  )
}

export default EventPlaceholder
