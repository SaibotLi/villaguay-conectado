import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventForm from '../../components/forms/EventForm/EventForm'
import { useEvent } from '../../hooks/useEvent'
import { updateEvent } from '../../services/eventService'
import { uploadEventImage } from '../../services/mediaService'
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
  const [currentImageUrl, setCurrentImageUrl] = useState(() => event.imageUrl ?? '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatusMessage, setUploadStatusMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))
  }

  function handleRemoveExisting() {
    setCurrentImageUrl('')
    setSelectedFile(null)
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault()

    try {
      setIsSubmitting(true)
      setSubmitError('')

      let finalImageUrl = currentImageUrl

      // Si el usuario seleccionó un nuevo archivo, subirlo mediante mediaService
      if (selectedFile) {
        setUploadStatusMessage('Subiendo nuevo flyer...')
        const mediaResult = await uploadEventImage(selectedFile)
        finalImageUrl = mediaResult.url
      }

      setUploadStatusMessage('Guardando cambios...')

      await updateEvent(eventId, {
        ...formData,
        imageUrl: finalImageUrl,
      })

      navigate('/admin')
    } catch (error) {
      setSubmitError(error.message || 'No se pudieron guardar los cambios. Intentá nuevamente.')
    } finally {
      setIsSubmitting(false)
      setUploadStatusMessage('')
    }
  }

  return (
    <EventForm
      title="Editar evento"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
      submittingLabel={selectedFile ? 'Subiendo y guardando...' : 'Guardando...'}
      isSubmitting={isSubmitting}
      isFormDisabled={false}
      helperMessage=""
      errorMessage={submitError}
      successMessage=""
      currentImageUrl={currentImageUrl}
      selectedFile={selectedFile}
      onFileSelect={setSelectedFile}
      onRemoveExisting={handleRemoveExisting}
      uploadStatusMessage={uploadStatusMessage}
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
