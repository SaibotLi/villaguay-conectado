import styles from './EmptyState.module.css'

function EmptyState({ title, description }) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  )
}

export default EmptyState
