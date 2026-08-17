import { useEffect, useState } from 'react'
import {
	approveEvent as approveEventInService,
	getPendingEvents,
	rejectEvent as rejectEventInService,
} from '../services/eventService'

function usePendingEvents() {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true

		async function loadPendingEvents() {
			// Mantiene sincronizado el estado de carga de los eventos pendientes.
			setLoading(true)
			setError(null)

			try {
				const pendingEvents = await getPendingEvents()

				if (!isMounted) {
					return
				}

				setEvents(pendingEvents)
			} catch (loadError) {
				if (!isMounted) {
					return
				}

				setError(loadError)
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadPendingEvents()

		return () => {
			isMounted = false
		}
	}, [])

	// Aprueba un evento pendiente y actualiza el listado local sin recargar.
	async function approvePendingEvent(id) {
		await approveEventInService(id)
		setEvents((previousEvents) => previousEvents.filter((event) => event.id !== id))
	}

	// Rechaza un evento pendiente y actualiza el listado local sin recargar.
	async function rejectPendingEvent(id) {
		await rejectEventInService(id)
		setEvents((previousEvents) => previousEvents.filter((event) => event.id !== id))
	}

	return {
		events,
		loading,
		error,
		approvePendingEvent,
		rejectPendingEvent,
	}
}

export { usePendingEvents }
