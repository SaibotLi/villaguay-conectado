import { useId } from 'react'
import styles from './FormField.module.css'

function FormField({
  id,
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
  inputRef,
  describedBy,
}) {
  const generatedId = useId()
  const fieldId = id || (name ? `field-${name}` : `field-${generatedId}`)
  const isTextarea = type === 'textarea'
  const controlClassName = error ? `${styles.control} ${styles.controlError}` : styles.control

  const errorId = error ? `${fieldId}-error` : null
  const combinedDescribedBy = [describedBy, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>

      {isTextarea ? (
        <textarea
          ref={inputRef}
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={controlClassName}
          aria-invalid={Boolean(error)}
          aria-required={required || undefined}
          aria-describedby={combinedDescribedBy}
        />
      ) : (
        <input
          ref={inputRef}
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
          aria-invalid={Boolean(error)}
          aria-required={required || undefined}
          aria-describedby={combinedDescribedBy}
        />
      )}

      {error ? (
        <p id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
