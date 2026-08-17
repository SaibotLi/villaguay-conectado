import styles from './CreateEvent.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import EventForm from '../../components/forms/EventForm/EventForm'
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
    <EventForm
      title="Proponer evento"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Proponer evento"
      submittingLabel="Enviando..."
      isSubmitting={isSubmitting}
      isFormDisabled={!user}
      helperMessage={!user ? 'Debes iniciar sesion para enviar una propuesta.' : ''}
      errorMessage={error}
      successMessage={successMessage}
      styles={styles}
    />
  )
}

export default CreateEvent
