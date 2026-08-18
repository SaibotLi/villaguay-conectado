import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      // Solicita el inicio de sesión utilizando el contexto de autenticación.
      await login(email.trim(), password)
      navigate('/')
    } catch (error) {
      setErrorMessage(mapFirebaseError(error.code))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Ingresar</h1>
        <p className={styles.subtitle}>Accede a tu cuenta para gestionar tus intereses y propuestas.</p>
      </header>

      <div className={styles.card}>
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

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Login
