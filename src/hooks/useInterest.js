import { useEffect, useState } from 'react'
import { isInterested, toggleInterest } from '../services/interestService'

function useInterest(eventId, userId) {
	const [interested, setInterested] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!eventId || !userId) {
			setInterested(false)
			setLoading(false)
			return
		}

		let isMounted = true

		async function loadInterest() {
			// Mantiene sincronizado el estado local de interes para el evento actual.
			setLoading(true)

			try {
				const interestedValue = await isInterested(eventId, userId)

				if (!isMounted) {
					return
				}

				setInterested(interestedValue)
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadInterest()

		return () => {
			isMounted = false
		}
	}, [eventId, userId])

	// Alterna el interes y actualiza el estado sin recargar la pagina.
	async function toggle() {
		if (!eventId || !userId) {
			return false
		}

		setLoading(true)
		try {
			const nextInterested = await toggleInterest(eventId, userId)
			setInterested(nextInterested)
			return nextInterested
		} finally {
			setLoading(false)
		}
	}

	return { interested, loading, toggle }
}

export { useInterest }
