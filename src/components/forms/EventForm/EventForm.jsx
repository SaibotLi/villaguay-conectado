import FormField from '../../ui/FormField/FormField'
import Button from '../../ui/Button/Button'
import Alert from '../../ui/Alert/Alert'

function EventForm({
  title,
  formData,
  onChange,
  onSubmit,
  submitLabel,
  submittingLabel,
  submitVariant = 'primary',
  isSubmitting,
  isFormDisabled,
  helperMessage,
  errorMessage,
  successMessage,
  styles,
}) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>{title}</h1>
      </header>

      <div className={styles.card}>
        {helperMessage ? <Alert variant="warning">{helperMessage}</Alert> : null}

        <form className={styles.form} onSubmit={onSubmit}>
          <FormField
            label="Titulo"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />

          <FormField
            label="Descripcion"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={onChange}
            rows={4}
            required
            disabled={isFormDisabled || isSubmitting}
          />

          <FormField
            label="Ubicacion"
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />

          <FormField
            label="Enlace de Google Maps (opcional)"
            name="mapsUrl"
            type="url"
            value={formData.mapsUrl}
            onChange={onChange}
            placeholder="https://maps.google.com/..."
            disabled={isFormDisabled || isSubmitting}
          />

          <FormField
            label="Fecha"
            name="date"
            type="date"
            value={formData.date}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />

          <FormField
            label="Hora"
            name="time"
            type="time"
            value={formData.time}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />

          <Button type="submit" variant={submitVariant} disabled={isFormDisabled || isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </form>

        {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
      </div>
    </section>
  )
}

export default EventForm
