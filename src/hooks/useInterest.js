import { useEffect, useState } from 'react'
import {
	getInterestCount,
	isInterested,
	toggleInterest,
} from '../services/interestService'

function useInterest(eventId, userId) {
	const [interested, setInterested] = useState(false)
	const [count, setCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!eventId) {
			setInterested(false)
			setCount(0)
			setLoading(false)
			return
		}

		let isMounted = true

		async function loadInterest() {
			// Mantiene sincronizado el estado local de interes para el evento actual.
			setLoading(true)

			try {
				const interestCount = await getInterestCount(eventId)
				const interestedValue = userId
					? await isInterested(eventId, userId)
					: false

				if (!isMounted) {
					return
				}

				setCount(interestCount)
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
			setCount((previousCount) => {
				if (nextInterested) {
					return previousCount + 1
				}

				return Math.max(0, previousCount - 1)
			})
			return nextInterested
		} finally {
			setLoading(false)
		}
	}

	return { interested, count, loading, toggle }
}

export { useInterest }
