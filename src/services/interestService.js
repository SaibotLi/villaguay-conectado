import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	where,
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

// Obtiene la cantidad de usuarios interesados para un evento.
async function getInterestCount(eventId) {
	const interestsRef = collection(db, 'interests')
	const interestsByEventQuery = query(interestsRef, where('eventId', '==', eventId))
	const snapshot = await getDocs(interestsByEventQuery)

	return snapshot.size
}

// Obtiene los ids de eventos marcados como interes por un usuario.
async function getUserInterests(userId) {
	const interestsRef = collection(db, 'interests')
	const interestsByUserQuery = query(interestsRef, where('userId', '==', userId))
	const snapshot = await getDocs(interestsByUserQuery)

	return snapshot.docs.map((interestDocument) => interestDocument.data().eventId)
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

export { toggleInterest, isInterested, getInterestCount, getUserInterests }
