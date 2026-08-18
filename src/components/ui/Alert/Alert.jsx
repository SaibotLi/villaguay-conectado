import styles from './Alert.module.css'

const variantClassNames = {
  error: styles.error,
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
}

function Alert({ variant = 'info', children }) {
  const variantClassName = variantClassNames[variant] ?? variantClassNames.info
  const role = variant === 'error' || variant === 'success' ? 'alert' : undefined

  return (
    <p className={`${styles.alert} ${variantClassName}`} role={role}>
      {children}
    </p>
  )
}

export default Alert
