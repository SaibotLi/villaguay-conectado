function EventForm({
  title,
  formData,
  onChange,
  onSubmit,
  submitLabel,
  submittingLabel,
  isSubmitting,
  isFormDisabled,
  helperMessage,
  errorMessage,
  successMessage,
  styles,
}) {
  return (
    <section className={styles.page}>
      <h1>{title}</h1>

      {helperMessage ? (
        <p className={styles.feedback}>
          {helperMessage}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Titulo</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Descripcion</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            required
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Ubicacion</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Enlace de Google Maps (opcional)</span>
          <input
            type="url"
            name="mapsUrl"
            value={formData.mapsUrl}
            onChange={onChange}
            placeholder="https://maps.google.com/..."
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Fecha</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <label className={styles.field}>
          <span>Hora</span>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={onChange}
            required
            disabled={isFormDisabled || isSubmitting}
          />
        </label>

        <button type="submit" className={styles.submitButton} disabled={isFormDisabled || isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>

      {errorMessage ? <p className={styles.feedback}>{errorMessage}</p> : null}
      {successMessage ? <p className={styles.success}>{successMessage}</p> : null}
    </section>
  )
}

export default EventForm
