import styles from './EmptyState.module.css'

function EmptyState({ title, description, children }) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  )
}

export default EmptyState
