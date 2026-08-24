import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '../../components/forms/EventForm/EventForm'
import { useEvent } from '../../hooks/useEvent'
import { updateEvent } from '../../services/eventService'
import styles from '../CreateEvent/CreateEvent.module.css'

function createFormData(event) {
  return {
    title: event.title ?? '',
    description: event.description ?? '',
    location: event.location ?? '',
    mapsUrl: event.mapsUrl ?? '',
    date: event.date ?? '',
    time: event.time ?? '',
  }
}

function EditEventForm({ event, eventId }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => createFormData(event))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault()

    try {
      // Actualiza el evento usando exclusivamente la capa de servicios.
      setIsSubmitting(true)
      setSubmitError('')

      await updateEvent(eventId, formData)
      navigate('/admin')
    } catch {
      setSubmitError('No se pudieron guardar los cambios. Intentá nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <EventForm
      title="Editar evento"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
      submittingLabel="Guardando..."
      isSubmitting={isSubmitting}
      isFormDisabled={false}
      helperMessage=""
      errorMessage={submitError}
      successMessage=""
      styles={styles}
    />
  )
}

function EditEvent() {
  const { id } = useParams()
  const { event, loading, error } = useEvent(id)

  if (loading) {
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1>Editar evento</h1>
        </header>
        <p className={styles.message}>Cargando...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1>Editar evento</h1>
        </header>
        <p className={styles.message}>Ocurrió un problema al cargar el evento. Intentá nuevamente.</p>
      </section>
    )
  }

  if (!event) {
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1>Editar evento</h1>
        </header>
        <p className={styles.message}>No se encontró el evento solicitado.</p>
      </section>
    )
  }

  return <EditEventForm key={event.id} event={event} eventId={id} />
}

export default EditEvent
