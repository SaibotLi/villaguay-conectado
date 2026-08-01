import { useEffect, useState } from 'react'
import { getEventById } from '../services/eventService'

function useEvent(id) {
	const [event, setEvent] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!id) {
			setEvent(null)
			setLoading(false)
			setError(null)
			return
		}

		let isMounted = true

		async function loadEvent() {
			setLoading(true)
			setError(null)

			try {
				const eventData = await getEventById(id)

				if (!isMounted) {
					return
				}

				setEvent(eventData)
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

		loadEvent()

		return () => {
			isMounted = false
		}
	}, [id])

	return { event, loading, error }
}

export { useEvent }
