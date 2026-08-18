import styles from './Button.module.css'

const variantClassNames = {
  primary: styles.primary,
  secondary: styles.secondary,
  accent: styles.accent,
  ghost: styles.ghost,
  danger: styles.danger,
}

function Button({
  as,
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const variantClassName = variantClassNames[variant] ?? variantClassNames.primary
  const combinedClassName = [styles.button, variantClassName, className]
    .filter(Boolean)
    .join(' ')
  const Component = as || 'button'
  const typeProp = as ? {} : { type }

  return (
    <Component className={combinedClassName} {...typeProp} {...rest}>
      {children}
    </Component>
  )
}

export default Button
