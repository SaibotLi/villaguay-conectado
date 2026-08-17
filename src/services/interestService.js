import {
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'

// Genera un id estable para identificar el interes por evento y usuario.
function buildInterestId(eventId, userId) {
	return `${eventId}_${userId}`
}

// Informa si el usuario marco o no un evento como interes.
async function isInterested(eventId, userId) {
	const interestId = buildInterestId(eventId, userId)
	const interestRef = doc(db, 'interests', interestId)
	const snapshot = await getDoc(interestRef)

	return snapshot.exists()
}

// Alterna el interes de un usuario en un evento creando o eliminando el documento.
async function toggleInterest(eventId, userId) {
	const interestId = buildInterestId(eventId, userId)
	const interestRef = doc(db, 'interests', interestId)
	const snapshot = await getDoc(interestRef)

	if (snapshot.exists()) {
		await deleteDoc(interestRef)
		return false
	}

	await setDoc(interestRef, {
		eventId,
		userId,
		createdAt: serverTimestamp(),
	})

	return true
}

export { toggleInterest, isInterested }
