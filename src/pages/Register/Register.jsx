import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import FormField from '../../components/ui/FormField/FormField'
import Button from '../../components/ui/Button/Button'
import Alert from '../../components/ui/Alert/Alert'
import styles from './Register.module.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mapFirebaseError(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado.'
    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.'
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'La contraseña no cumple con los requisitos de seguridad.'
    default:
      return 'No se pudo crear la cuenta. Intentá nuevamente.'
  }
}

function getSafeRedirectUrl(target) {
  if (typeof target !== 'string') return '/'
  const trimmed = target.trim()
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes(':') ||
    trimmed.startsWith('/login') ||
    trimmed.startsWith('/register')
  ) {
    return '/'
  }
  return trimmed
}

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, loginWithGoogle, validatePassword } = useAuth()
  const safeRedirectTo = getSafeRedirectUrl(location.state?.redirectTo)

  // Título descriptivo de pestaña
  useDocumentTitle('Registrarse')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const fullNameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)

  // Validación reactiva inmediata en base a la política configurada
  const localCriteria = useMemo(() => {
    return {
      meetsMinLength: password.length >= 8,
      containsLowercase: /[a-z]/.test(password),
      containsUppercase: /[A-Z]/.test(password),
      containsNumber: /[0-9]/.test(password),
    }
  }, [password])

  const [firebaseCriteria, setFirebaseCriteria] = useState(null)

  // Consulta complementaria a validatePassword de Firebase Auth para sincronización oficial
  useEffect(() => {
    let isCurrent = true

    if (!password) {
      return
    }

    if (typeof validatePassword === 'function') {
      validatePassword(password)
        .then((status) => {
          if (isCurrent && status) {
            setFirebaseCriteria({
              meetsMinLength: status.meetsMinPasswordLength ?? (password.length >= 8),
              containsLowercase: status.containsLowercaseLetter ?? (/[a-z]/.test(password)),
              containsUppercase: status.containsUppercaseLetter ?? (/[A-Z]/.test(password)),
              containsNumber: status.containsNumericCharacter ?? (/[0-9]/.test(password)),
            })
          }
        })
        .catch(() => {
          // Si no está disponible o falla la red, el fallback local se mantiene activo
        })
    }

    return () => {
      isCurrent = false
    }
  }, [password, validatePassword])

  // Criterios activos: resultado de Firebase Auth o evaluación reactiva local
  const activeCriteria = (password ? firebaseCriteria : null) || localCriteria

  const rules = [
    {
      id: 'length',
      label: 'Al menos 8 caracteres',
      isMet: activeCriteria.meetsMinLength,
    },
    {
      id: 'lowercase',
      label: 'Una letra minúscula',
      isMet: activeCriteria.containsLowercase,
    },
    {
      id: 'uppercase',
      label: 'Una letra mayúscula',
      isMet: activeCriteria.containsUppercase,
    },
    {
      id: 'number',
      label: 'Un número',
      isMet: activeCriteria.containsNumber,
    },
  ]

  function validateRegisterForm() {
    const errors = {}

    if (!fullName.trim()) {
      errors.fullName = 'Ingresá tu nombre completo.'
    }

    if (!email.trim()) {
      errors.email = 'Ingresá tu correo electrónico.'
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Ingresá un correo con formato válido.'
    }

    if (!password.trim()) {
      errors.password = 'Ingresá una contraseña.'
    } else if (
      !activeCriteria.meetsMinLength ||
      !activeCriteria.containsLowercase ||
      !activeCriteria.containsUppercase ||
      !activeCriteria.containsNumber
    ) {
      errors.password = 'La contraseña no cumple con todos los requisitos de seguridad.'
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirmá tu contraseña.'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateRegisterForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErrorMessage('Revisá los datos ingresados para continuar.')

      if (errors.fullName) {
        fullNameInputRef.current?.focus()
      } else if (errors.email) {
        emailInputRef.current?.focus()
      } else if (errors.password) {
        passwordInputRef.current?.focus()
      } else if (errors.confirmPassword) {
        confirmPasswordInputRef.current?.focus()
      }
      return
    }

    setFieldErrors({})
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register(email.trim(), password, fullName.trim())
      navigate('/login', { state: { registeredSuccessfully: true, redirectTo: safeRedirectTo } })
    } catch (error) {
      setErrorMessage(mapFirebaseError(error.code))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage('')
    setIsGoogleSubmitting(true)

    try {
      await loginWithGoogle()
      navigate(safeRedirectTo, { replace: true })
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return
      }

      setErrorMessage('No se pudo crear la cuenta con Google. Intentá nuevamente.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Registro</h1>
        <p className={styles.subtitle}>Creá tu cuenta para proponer eventos y guardar tus favoritos.</p>
      </header>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <FormField
            inputRef={fullNameInputRef}
            label="Nombre completo"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value)
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: '' }))
              }
            }}
            error={fieldErrors.fullName}
            autoComplete="name"
            required
          />

          <FormField
            inputRef={emailInputRef}
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: '' }))
              }
            }}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />

          <FormField
            inputRef={passwordInputRef}
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: '' }))
              }
            }}
            error={fieldErrors.password}
            autoComplete="new-password"
            describedBy="password-rules"
            required
          />

          {/* Sección visual de ayuda con los requisitos de contraseña vinculada al input */}
          <div id="password-rules" className={styles.passwordRules} aria-live="polite">
            <p className={styles.passwordRulesTitle}>Tu contraseña debe tener:</p>
            <ul className={styles.ruleList} aria-label="Requisitos de contraseña">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className={`${styles.ruleItem} ${rule.isMet ? styles.ruleItemMet : ''}`}
                >
                  <span
                    className={`${styles.ruleIcon} ${
                      rule.isMet ? styles.ruleIconMet : styles.ruleIconPending
                    }`}
                    aria-hidden="true"
                  >
                    {rule.isMet ? '✓' : '○'}
                  </span>
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <FormField
            inputRef={confirmPasswordInputRef}
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
              }
            }}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
            required
          />

          {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          <p className={styles.divider}>o</p>

          <Button
            type="button"
            variant="secondary"
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting}
          >
            {isGoogleSubmitting ? 'Conectando...' : 'Continuar con Google'}
          </Button>

          <p className={styles.switchAuthText}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" state={{ redirectTo: safeRedirectTo }} className={styles.switchAuthLink}>
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Register
