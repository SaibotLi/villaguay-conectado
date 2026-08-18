import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
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
      return 'No se pudo iniciar sesión. Intenta nuevamente.'
  }
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, resendVerificationEmail, sendPasswordReset } = useAuth()

  const registeredSuccessfully = Boolean(location.state?.registeredSuccessfully)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isUnverified, setIsUnverified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [isResending, setIsResending] = useState(false)

  const [isResetMode, setIsResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [isResetSubmitting, setIsResetSubmitting] = useState(false)

  function validateForm() {
    if (!email.trim() || !password.trim()) {
      return 'Todos los campos son obligatorios.'
    }

    if (!emailRegex.test(email.trim())) {
      return 'Ingresa un correo con formato válido.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Valida lo mínimo necesario antes de llamar al contexto.
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      setIsUnverified(false)
      return
    }

    setErrorMessage('')
    setIsUnverified(false)
    setResendMessage('')
    setIsSubmitting(true)

    try {
      // Solicita el inicio de sesión utilizando el contexto de autenticación.
      await login(email.trim(), password)
      navigate('/')
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
      navigate('/')
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // El usuario cancelo el popup: no se muestra ningun error.
        return
      }

      setErrorMessage('No se pudo iniciar sesión con Google. Intenta nuevamente.')
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
      setResendMessage('No se pudo reenviar el correo. Intenta nuevamente en unos minutos.')
    } finally {
      setIsResending(false)
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault()
    setResetMessage('')

    if (!resetEmail.trim() || !emailRegex.test(resetEmail.trim())) {
      setResetError('Ingresa un correo con formato válido.')
      return
    }

    setResetError('')
    setIsResetSubmitting(true)

    try {
      await sendPasswordReset(resetEmail.trim())
    } catch (error) {
      // Nunca revela si el correo existe: solo se informa un error real de envio.
      if (error.code !== 'auth/user-not-found') {
        setResetError('No se pudo enviar el correo. Intenta nuevamente.')
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
        <h1>Ingresar</h1>
        <p className={styles.subtitle}>Accede a tu cuenta para gestionar tus intereses y propuestas.</p>
      </header>

      <div className={styles.card}>
        {registeredSuccessfully ? (
          <Alert variant="success">
            Tu cuenta fue creada correctamente. Te enviamos un correo para verificar tu dirección de
            email. Una vez verificada podrás iniciar sesión.
          </Alert>
        ) : null}

        {isResetMode ? (
          <form className={styles.form} onSubmit={handleResetSubmit} noValidate>
            <FormField
              label="Correo electrónico"
              name="resetEmail"
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              autoComplete="email"
              required
            />

            {resetError ? <Alert variant="error">{resetError}</Alert> : null}
            {resetMessage ? <Alert variant="success">{resetMessage}</Alert> : null}

            <Button type="submit" variant="primary" disabled={isResetSubmitting}>
              {isResetSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>

            <Button type="button" variant="ghost" onClick={() => setIsResetMode(false)}>
              Volver a iniciar sesión
            </Button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              onClick={() => setIsResetMode(true)}
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
          </form>
        )}
      </div>
    </section>
  )
}

export default Login
