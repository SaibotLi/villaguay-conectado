import styles from './Badge.module.css'

const variantClassNames = {
  pending: styles.pending,
  approved: styles.approved,
  rejected: styles.rejected,
}

function Badge({ variant = 'pending', children }) {
  const variantClassName = variantClassNames[variant] ?? variantClassNames.pending

  return <span className={`${styles.badge} ${variantClassName}`}>{children}</span>
}

export default Badge
