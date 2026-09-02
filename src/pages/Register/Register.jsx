import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
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

function Register() {
  const navigate = useNavigate()
  const { register, loginWithGoogle, validatePassword } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

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

  function validateForm() {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return 'Todos los campos son obligatorios.'
    }

    if (!emailRegex.test(email.trim())) {
      return 'Ingresá un correo con formato válido.'
    }

    if (!activeCriteria.meetsMinLength) {
      return 'La contraseña debe tener al menos 8 caracteres.'
    }

    if (!activeCriteria.containsLowercase) {
      return 'La contraseña debe incluir al menos una letra minúscula.'
    }

    if (!activeCriteria.containsUppercase) {
      return 'La contraseña debe incluir al menos una letra mayúscula.'
    }

    if (!activeCriteria.containsNumber) {
      return 'La contraseña debe incluir al menos un número.'
    }

    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Valida la información antes de solicitar el registro
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      // Solicita el registro; el service envía la verificación y cierra la sesión
      await register(email.trim(), password, fullName.trim())

      navigate('/login', { state: { registeredSuccessfully: true } })
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
      navigate('/')
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
            label="Nombre completo"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />

          <FormField
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <FormField
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          {/* Sección visual de ayuda con los requisitos de contraseña */}
          <div className={styles.passwordRules} aria-live="polite">
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
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
        </form>
      </div>
    </section>
  )
}

export default Register
