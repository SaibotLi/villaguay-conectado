import styles from './Icon.module.css'

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 20,
}

function Icon({
  icon: IconComponent,
  size = 'md',
  className = '',
  'aria-hidden': ariaHidden = true,
  ...rest
}) {
  if (!IconComponent) return null

  const resolvedSize = typeof size === 'number' ? size : (sizeMap[size] ?? 16)
  const combinedClassName = [styles.icon, className].filter(Boolean).join(' ')

  return (
    <IconComponent
      size={resolvedSize}
      className={combinedClassName}
      aria-hidden={ariaHidden}
      {...rest}
    />
  )
}

export default Icon
