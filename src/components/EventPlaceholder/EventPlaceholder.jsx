import styles from './EventPlaceholder.module.css'

function EventPlaceholder({ title, date, time }) {
  return (
    <div className={styles.placeholder}>
      <div className={styles.badge}>VillaguayConectado</div>
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
