import { collection, getDocs, query, where } from 'firebase/firestore'
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
	const eventsRef = collection(db, 'events')
	const approvedEventsQuery = query(eventsRef, where('status', '==', 'approved'))
	const snapshot = await getDocs(approvedEventsQuery)

	return snapshot.docs.map(mapEventDocument)
}

export { getEvents }
