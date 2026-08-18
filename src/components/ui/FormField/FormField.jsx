import styles from './FormField.module.css'

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  autoComplete,
  placeholder,
  rows = 4,
}) {
  const fieldId = `field-${name}`
  const isTextarea = type === 'textarea'
  const controlClassName = error ? `${styles.control} ${styles.controlError}` : styles.control

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={controlClassName}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={controlClassName}
        />
      )}

      {error ? (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
