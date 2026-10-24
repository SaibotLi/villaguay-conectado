import styles from './CreateEvent.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import Button from '../../components/ui/Button/Button'
import EventForm from '../../components/forms/EventForm/EventForm'
import { createEvent } from '../../services/eventService'
import { uploadEventImage } from '../../services/mediaService'

function CreateEvent() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useDocumentTitle('Proponer evento')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    mapsUrl: '',
    date: '',
    time: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatusMessage, setUploadStatusMessage] = useState('')
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
      setError('Debés iniciar sesión para proponer un evento.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      let uploadedImageUrl = ''

      // Si el usuario seleccionó un flyer, subirlo primero mediante mediaService hacia el Worker / R2
      if (selectedFile) {
        setUploadStatusMessage('Subiendo flyer del evento...')
        const mediaResult = await uploadEventImage(selectedFile)
        uploadedImageUrl = mediaResult.url
      }

      setUploadStatusMessage('Guardando propuesta de evento...')

      await createEvent({
        ...formData,
        imageUrl: uploadedImageUrl,
        createdBy: user.uid,
      })

      setSuccessMessage('Evento propuesto con éxito. Será revisado por un administrador.')
      setFormData({
        title: '',
        description: '',
        location: '',
        mapsUrl: '',
        date: '',
        time: '',
      })
      setSelectedFile(null)
      setUploadStatusMessage('')

      setTimeout(() => {
        navigate('/eventos')
      }, 1200)
    } catch (submitError) {
      setError(submitError.message || 'No se pudo enviar la propuesta. Intentá nuevamente.')
    } finally {
      setIsSubmitting(false)
      setUploadStatusMessage('')
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1>Proponer evento</h1>
        </header>
        <p className={styles.message}>Cargando...</p>
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
      submittingLabel={selectedFile ? 'Subiendo y enviando...' : 'Enviando...'}
      submitVariant="accent"
      isSubmitting={isSubmitting}
      isFormDisabled={!user}
      helperMessage={!user ? 'Debés iniciar sesión para enviar una propuesta.' : ''}
      helperAction={
        !user ? (
          <div>
            <Button
              as={Link}
              to="/login"
              state={{ redirectTo: '/proponer-evento' }}
              variant="primary"
            >
              Iniciar sesión para proponer
            </Button>
          </div>
        ) : null
      }
      errorMessage={error}
      successMessage={successMessage}
      selectedFile={selectedFile}
      onFileSelect={setSelectedFile}
      uploadStatusMessage={uploadStatusMessage}
      styles={styles}
    />
  )
}

export default CreateEvent
