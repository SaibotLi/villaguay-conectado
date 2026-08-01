import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import styles from './Register.module.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mapFirebaseError(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo ya esta registrado.'
    case 'auth/invalid-email':
      return 'El correo ingresado no es valido.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    default:
      return 'No se pudo crear la cuenta. Intenta nuevamente.'
  }
}

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateForm() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return 'Todos los campos son obligatorios.'
    }

    if (!emailRegex.test(email.trim())) {
      return 'Ingresa un correo con formato valido.'
    }

    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Valida la informacion antes de solicitar el registro.
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      // Solicita el registro utilizando el contexto de autenticacion.
      await register(email.trim(), password, fullName.trim())

      // Redirige al inicio y deja que AuthContext refleje la nueva sesion.
      navigate('/')
    } catch (error) {
      setErrorMessage(mapFirebaseError(error.code))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1>Registro</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span>Nombre completo</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
          />
        </label>

        <label className={styles.field}>
          <span>Correo electronico</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>

        <label className={styles.field}>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  )
}

export default Register
