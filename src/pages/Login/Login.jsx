import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import FormField from '../../components/ui/FormField/FormField'
import Button from '../../components/ui/Button/Button'
import Alert from '../../components/ui/Alert/Alert'
import styles from './Login.module.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mapFirebaseError(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No existe una cuenta con ese correo.'
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.'
    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.'
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.'
    default:
      return 'No se pudo iniciar sesión. Intentá nuevamente.'
  }
}

/**
 * Valida de forma estricta que la ruta de retorno sea una ruta interna segura,
 * evitando vulnerabilidades de Open Redirect hacia dominios externos o bucles de login.
 */
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

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, resendVerificationEmail, sendPasswordReset } = useAuth()

  const safeRedirectTo = getSafeRedirectUrl(location.state?.redirectTo)
  const noticeMessage = location.state?.notice || ''
  const registeredSuccessfully = Boolean(location.state?.registeredSuccessfully)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isUnverified, setIsUnverified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [isResending, setIsResending] = useState(false)

  const [isResetMode, setIsResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetFieldError, setResetFieldError] = useState('')
  const [isResetSubmitting, setIsResetSubmitting] = useState(false)

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const resetEmailInputRef = useRef(null)

  // Título descriptivo de pestaña según el modo activo
  useDocumentTitle(isResetMode ? 'Recuperar contraseña' : 'Iniciar sesión')

  function validateLoginForm() {
    const errors = {}

    if (!email.trim()) {
      errors.email = 'Ingresá tu correo electrónico.'
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Ingresá un correo con formato válido.'
    }

    if (!password.trim()) {
      errors.password = 'Ingresá tu contraseña.'
    }

    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateLoginForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErrorMessage('Revisá los campos obligatorios para continuar.')
      setIsUnverified(false)

      if (errors.email) {
        emailInputRef.current?.focus()
      } else if (errors.password) {
        passwordInputRef.current?.focus()
      }
      return
    }

    setFieldErrors({})
    setErrorMessage('')
    setIsUnverified(false)
    setResendMessage('')
    setIsSubmitting(true)

    try {
      await login(email.trim(), password)
      navigate(safeRedirectTo, { replace: true })
    } catch (error) {
      if (error.code === 'auth/email-not-verified') {
        setIsUnverified(true)
        setErrorMessage('Tu correo electrónico aún no fue verificado.')
      } else {
        setErrorMessage(mapFirebaseError(error.code))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage('')
    setIsUnverified(false)
    setIsGoogleSubmitting(true)

    try {
      await loginWithGoogle()
      navigate(safeRedirectTo, { replace: true })
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return
      }

      setErrorMessage('No se pudo iniciar sesión con Google. Intentá nuevamente.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  async function handleResendVerification() {
    setResendMessage('')
    setIsResending(true)

    try {
      await resendVerificationEmail(email.trim(), password)
      setResendMessage('Te reenviamos el correo de verificación.')
    } catch {
      setResendMessage('No se pudo reenviar el correo. Intentá nuevamente en unos minutos.')
    } finally {
      setIsResending(false)
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault()
    setResetMessage('')
    setResetError('')

    if (!resetEmail.trim()) {
      setResetFieldError('Ingresá tu correo electrónico.')
      resetEmailInputRef.current?.focus()
      return
    }

    if (!emailRegex.test(resetEmail.trim())) {
      setResetFieldError('Ingresá un correo con formato válido.')
      resetEmailInputRef.current?.focus()
      return
    }

    setResetFieldError('')
    setIsResetSubmitting(true)

    try {
      await sendPasswordReset(resetEmail.trim())
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        setResetError('No se pudo enviar el correo. Intentá nuevamente.')
        setIsResetSubmitting(false)
        return
      }
    }

    setResetMessage('Si el correo existe, te enviamos un enlace para restablecer tu contraseña.')
    setIsResetSubmitting(false)
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>{isResetMode ? 'Recuperar contraseña' : 'Ingresar'}</h1>
        <p className={styles.subtitle}>
          {isResetMode
            ? 'Ingresá tu correo electrónico y te enviaremos las instrucciones para recuperar tu cuenta.'
            : 'Accedé a tu cuenta para gestionar tus intereses y propuestas.'}
        </p>
      </header>

      <div className={styles.card}>
        {noticeMessage && !registeredSuccessfully ? (
          <Alert variant="info">{noticeMessage}</Alert>
        ) : null}

        {registeredSuccessfully ? (
          <Alert variant="success">
            Tu cuenta fue creada correctamente. Te enviamos un correo para verificar tu dirección de
            email. Una vez verificada podrás iniciar sesión.
          </Alert>
        ) : null}

        {isResetMode ? (
          <form className={styles.form} onSubmit={handleResetSubmit} noValidate>
            <FormField
              inputRef={resetEmailInputRef}
              label="Correo electrónico"
              name="resetEmail"
              type="email"
              value={resetEmail}
              onChange={(event) => {
                setResetEmail(event.target.value)
                if (resetFieldError) setResetFieldError('')
              }}
              error={resetFieldError}
              autoComplete="email"
              required
            />

            {resetError ? <Alert variant="error">{resetError}</Alert> : null}
            {resetMessage ? <Alert variant="success">{resetMessage}</Alert> : null}

            <Button type="submit" variant="primary" disabled={isResetSubmitting}>
              {isResetSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsResetMode(false)
                setResetFieldError('')
                setResetError('')
              }}
            >
              Volver a iniciar sesión
            </Button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
              required
            />

            {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

            {isUnverified ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? 'Reenviando...' : 'Reenviar correo de verificación'}
              </Button>
            ) : null}

            {resendMessage ? <Alert variant="info">{resendMessage}</Alert> : null}

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className={styles.forgotButton}
              onClick={() => {
                setIsResetMode(true)
                setFieldErrors({})
                setErrorMessage('')
              }}
            >
              ¿Olvidaste tu contraseña?
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
              ¿Todavía no tenés cuenta?{' '}
              <Link
                to="/register"
                state={{ redirectTo: safeRedirectTo }}
                className={styles.switchAuthLink}
              >
                Registrate
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

export default Login
