import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'

// Transforma el documento de Firebase en un objeto JavaScript estable para React.
function mapEventDocument(eventDocument) {
	const data = eventDocument.data()

	return {
		id: eventDocument.id,
		title: data.title,
		description: data.description,
		location: data.location,
		mapsUrl: data.mapsUrl,
		date: data.date,
		time: data.time,
		imageUrl: data.imageUrl,
		status: data.status,
		createdBy: data.createdBy,
		createdAt: data.createdAt,
	}
}

// Obtiene unicamente los eventos aprobados desde Firestore.
async function getEvents() {
	return getApprovedEvents()
}

// Obtiene todos los eventos publicados (status approved) desde Firestore.
async function getApprovedEvents() {
	const eventsRef = collection(db, 'events')
	const approvedEventsQuery = query(eventsRef, where('status', '==', 'approved'))
	const snapshot = await getDocs(approvedEventsQuery)

	return snapshot.docs.map(mapEventDocument)
}

// Obtiene unicamente los eventos pendientes desde Firestore.
async function getPendingEvents() {
	const eventsRef = collection(db, 'events')
	const pendingEventsQuery = query(eventsRef, where('status', '==', 'pending'))
	const snapshot = await getDocs(pendingEventsQuery)

	return snapshot.docs.map(mapEventDocument)
}

// Aprueba un evento actualizando unicamente su estado a approved.
async function approveEvent(id) {
	const eventRef = doc(db, 'events', id)

	await updateDoc(eventRef, { status: 'approved' })
}

// Rechaza un evento actualizando unicamente su estado a rejected.
async function rejectEvent(id) {
	const eventRef = doc(db, 'events', id)

	await updateDoc(eventRef, { status: 'rejected' })
}

// Elimina un evento publicado de la coleccion events por su id.
async function deleteEvent(id) {
	const eventRef = doc(db, 'events', id)

	await deleteDoc(eventRef)
}

// Actualiza solo los campos editables de un evento existente.
async function updateEvent(id, eventData) {
	const eventRef = doc(db, 'events', id)
	const payload = {
		title: eventData.title.trim(),
		description: eventData.description.trim(),
		location: eventData.location.trim(),
		mapsUrl: eventData.mapsUrl?.trim() ?? '',
		date: eventData.date,
		time: eventData.time,
	}

	await updateDoc(eventRef, payload)
}

// Obtiene un evento por id y retorna null cuando no existe.
async function getEventById(id) {
	const eventRef = doc(db, 'events', id)
	const eventSnapshot = await getDoc(eventRef)

	if (!eventSnapshot.exists()) {
		return null
	}

	return mapEventDocument(eventSnapshot)
}

// Crea una propuesta de evento y la guarda siempre con estado pendiente de revision.
async function createEvent(eventData) {
	const eventsRef = collection(db, 'events')
	const payload = {
		title: eventData.title.trim(),
		description: eventData.description.trim(),
		location: eventData.location.trim(),
		mapsUrl: eventData.mapsUrl?.trim() ?? '',
		date: eventData.date,
		time: eventData.time,
		imageUrl: '',
		status: 'pending',
		createdBy: eventData.createdBy,
		createdAt: serverTimestamp(),
	}

	const newEventRef = await addDoc(eventsRef, payload)

	return newEventRef.id
}

export {
	getEvents,
	getApprovedEvents,
	getPendingEvents,
	approveEvent,
	rejectEvent,
	deleteEvent,
	updateEvent,
	getEventById,
	createEvent,
}
