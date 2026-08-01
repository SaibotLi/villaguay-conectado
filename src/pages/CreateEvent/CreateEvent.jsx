import styles from './CreateEvent.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { createEvent } from '../../services/eventService'

function CreateEvent() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    mapsUrl: '',
    date: '',
    time: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      setError('Debes iniciar sesion para proponer un evento.')
      return
    }

    try {
      // Crea la propuesta utilizando la capa de servicios para mantener la arquitectura.
      setIsSubmitting(true)
      setError(null)

      await createEvent({
        ...formData,
        createdBy: user.uid,
      })

      setSuccessMessage('Evento propuesto con exito. Sera revisado por un administrador.')
      setFormData({
        title: '',
        description: '',
        location: '',
        mapsUrl: '',
        date: '',
        time: '',
      })

      setTimeout(() => {
        navigate('/eventos')
      }, 1200)
    } catch (submitError) {
      setError('No se pudo enviar la propuesta. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <h1>Proponer evento</h1>
        <p>Cargando...</p>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <h1>Proponer evento</h1>

      {!user && (
        <p className={styles.feedback}>
          Debes iniciar sesion para enviar una propuesta.
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Titulo</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={!user || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Descripcion</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            disabled={!user || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Ubicacion</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={!user || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Enlace de Google Maps (opcional)</span>
          <input
            type="url"
            name="mapsUrl"
            value={formData.mapsUrl}
            onChange={handleChange}
            placeholder="https://maps.google.com/..."
            disabled={!user || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Fecha</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={!user || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Hora</span>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            disabled={!user || isSubmitting}
          />
        </label>

        <button type="submit" className={styles.submitButton} disabled={!user || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Proponer evento'}
        </button>
      </form>

      {error && <p className={styles.feedback}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </section>
  )
}

export default CreateEvent
