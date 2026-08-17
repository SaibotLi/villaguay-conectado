import { useState } from 'react'
import styles from './Admin.module.css'
import { usePendingEvents } from '../../hooks/usePendingEvents'
import { useApprovedEvents } from '../../hooks/useApprovedEvents'
import AdminEventCard from '../../components/event/AdminEventCard'
import AdminPublishedEventCard from '../../components/event/AdminPublishedEventCard'

function Admin() {
  const {
    events: pendingEvents,
    loading: pendingLoading,
    error: pendingError,
    approvePendingEvent,
    rejectPendingEvent,
  } = usePendingEvents()
  const {
    events: approvedEvents,
    loading: approvedLoading,
    error: approvedError,
    deleteApprovedEvent,
  } = useApprovedEvents()
  const [feedbackMessage, setFeedbackMessage] = useState('')

  async function handleApprove(eventId) {
    await approvePendingEvent(eventId)
    setFeedbackMessage('Evento aprobado correctamente.')
  }

  async function handleReject(eventId) {
    await rejectPendingEvent(eventId)
    setFeedbackMessage('Evento rechazado correctamente.')
  }

  async function handleDelete(eventId) {
    const shouldDelete = window.confirm('Estas seguro de que deseas eliminar este evento publicado?')

    if (!shouldDelete) {
      return
    }

    await deleteApprovedEvent(eventId)
    setFeedbackMessage('Evento eliminado correctamente.')
  }

  return (
    <section className={styles.page}>
      <h1>Panel de administracion</h1>
      {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eventos pendientes</h2>
        {pendingLoading ? <p className={styles.message}>Cargando eventos...</p> : null}
        {pendingError ? (
          <p className={styles.message}>Ocurrio un problema al cargar los eventos pendientes. Intenta nuevamente en unos minutos.</p>
        ) : null}
        {!pendingLoading && !pendingError && pendingEvents.length === 0 ? (
          <p className={styles.message}>No hay eventos pendientes.</p>
        ) : null}
        {!pendingLoading && !pendingError && pendingEvents.length > 0 ? (
          <ul className={styles.list}>
            {pendingEvents.map((event) => (
              <li key={event.id} className={styles.item}>
                <AdminEventCard event={event} onApprove={handleApprove} onReject={handleReject} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eventos publicados</h2>
        {approvedLoading ? <p className={styles.message}>Cargando eventos...</p> : null}
        {approvedError ? (
          <p className={styles.message}>Ocurrio un problema al cargar los eventos publicados. Intenta nuevamente en unos minutos.</p>
        ) : null}
        {!approvedLoading && !approvedError && approvedEvents.length === 0 ? (
          <p className={styles.message}>No hay eventos publicados.</p>
        ) : null}
        {!approvedLoading && !approvedError && approvedEvents.length > 0 ? (
          <ul className={styles.list}>
            {approvedEvents.map((event) => (
              <li key={event.id} className={styles.item}>
                <AdminPublishedEventCard event={event} onDelete={handleDelete} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  )
}

export default Admin
