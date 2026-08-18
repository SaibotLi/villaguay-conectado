import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '../../components/forms/EventForm/EventForm'
import { useEvent } from '../../hooks/useEvent'
import { updateEvent } from '../../services/eventService'
import styles from '../CreateEvent/CreateEvent.module.css'

function EditEvent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { event, loading, error } = useEvent(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    mapsUrl: '',
    date: '',
    time: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!event) {
      return
    }

    setFormData({
      title: event.title ?? '',
      description: event.description ?? '',
      location: event.location ?? '',
      mapsUrl: event.mapsUrl ?? '',
      date: event.date ?? '',
      time: event.time ?? '',
    })
  }, [event])

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

      await updateEvent(id, formData)
      navigate('/admin')
    } catch {
      setSubmitError('No se pudieron guardar los cambios. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <p className={styles.message}>Ocurrio un problema al cargar el evento. Intenta nuevamente.</p>
      </section>
    )
  }

  if (!event) {
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1>Editar evento</h1>
        </header>
        <p className={styles.message}>No se encontro el evento solicitado.</p>
      </section>
    )
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

export default EditEvent
