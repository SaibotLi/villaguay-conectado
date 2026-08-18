import { useState } from 'react'
import styles from './Admin.module.css'
import { usePendingEvents } from '../../hooks/usePendingEvents'
import { useApprovedEvents } from '../../hooks/useApprovedEvents'
import AdminEventCard from '../../components/event/AdminEventCard'
import AdminPublishedEventCard from '../../components/event/AdminPublishedEventCard'
import Alert from '../../components/ui/Alert/Alert'
import EmptyState from '../../components/ui/EmptyState/EmptyState'

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
      <header className={styles.header}>
        <h1>Panel de administración</h1>
        <p className={styles.subtitle}>Moderá, aprobá y gestioná los eventos de VillaguayConectado.</p>
      </header>

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Eventos pendientes</p>
          <p className={styles.statValue}>{pendingEvents.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Eventos publicados</p>
          <p className={styles.statValue}>{approvedEvents.length}</p>
        </div>
      </div>

      {feedbackMessage ? <Alert variant="success">{feedbackMessage}</Alert> : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eventos pendientes</h2>
        {pendingLoading ? <p className={styles.message}>Cargando eventos...</p> : null}
        {!pendingLoading && pendingError ? (
          <Alert variant="error">
            Ocurrio un problema al cargar los eventos pendientes. Intenta nuevamente en unos minutos.
          </Alert>
        ) : null}
        {!pendingLoading && !pendingError && pendingEvents.length === 0 ? (
          <EmptyState
            title="No hay eventos pendientes"
            description="Las nuevas propuestas de la comunidad van a aparecer aca para su revision."
          />
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
        {!approvedLoading && approvedError ? (
          <Alert variant="error">
            Ocurrio un problema al cargar los eventos publicados. Intenta nuevamente en unos minutos.
          </Alert>
        ) : null}
        {!approvedLoading && !approvedError && approvedEvents.length === 0 ? (
          <EmptyState
            title="No hay eventos publicados"
            description="Los eventos aprobados van a aparecer aca y quedaran visibles para la comunidad."
          />
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
