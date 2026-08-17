import { useEffect, useState } from 'react'
import {
	deleteEvent as deleteEventInService,
	getApprovedEvents,
} from '../services/eventService'

function useApprovedEvents() {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true

		async function loadApprovedEvents() {
			// Mantiene sincronizado el estado de carga de los eventos publicados.
			setLoading(true)
			setError(null)

			try {
				const approvedEvents = await getApprovedEvents()

				if (!isMounted) {
					return
				}

				setEvents(approvedEvents)
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

		loadApprovedEvents()

		return () => {
			isMounted = false
		}
	}, [])

	// Elimina un evento publicado y actualiza el listado local sin recargar.
	async function deleteApprovedEvent(id) {
		await deleteEventInService(id)
		setEvents((previousEvents) => previousEvents.filter((event) => event.id !== id))
	}

	return {
		events,
		loading,
		error,
		deleteApprovedEvent,
	}
}

export { useApprovedEvents }
