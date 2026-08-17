import { useEffect, useState } from 'react'
import { getEventsByIds } from '../services/eventService'
import { getUserInterests } from '../services/interestService'

function useMyInterests(userId) {
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!userId) {
			setEvents([])
			setError(null)
			setLoading(false)
			return
		}

		let isMounted = true

		async function loadMyInterests() {
			// Carga los eventos correspondientes a los intereses del usuario autenticado.
			setLoading(true)
			setError(null)

			try {
				const eventIds = await getUserInterests(userId)

				if (!isMounted) {
					return
				}

				if (eventIds.length === 0) {
					setEvents([])
					return
				}

				const interestedEvents = await getEventsByIds(eventIds)

				if (!isMounted) {
					return
				}

				setEvents(interestedEvents)
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

		loadMyInterests()

		return () => {
			isMounted = false
		}
	}, [userId])

	return { events, loading, error }
}

export { useMyInterests }
