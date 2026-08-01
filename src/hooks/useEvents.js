import { useEffect, useState } from 'react'
import { getEvents } from '../services/eventService'

function useEvents() {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true

		async function loadEvents() {
			// Mantiene sincronizado el estado de carga de los eventos.
			setLoading(true)
			setError(null)

			try {
				const approvedEvents = await getEvents()

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

		loadEvents()

		return () => {
			isMounted = false
		}
	}, [])

	return { events, loading, error }
}

export { useEvents }
