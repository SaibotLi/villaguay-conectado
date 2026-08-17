import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth } from '../firebase/auth'
import { db } from '../firebase/firestore'

// Crea el perfil base del usuario en Firestore usando el mismo uid de Authentication.
async function createUserProfile(user, fullName) {
	const profileRef = doc(db, 'users', user.uid)

	await setDoc(profileRef, {
		displayName: fullName,
		email: user.email,
		role: 'user',
		createdAt: serverTimestamp(),
	})
}

async function register(email, password, fullName) {
	const credentials = await createUserWithEmailAndPassword(auth, email, password)

	if (fullName) {
		await updateProfile(credentials.user, { displayName: fullName })
	}

	// Crea el documento users/{uid} luego del registro exitoso en Authentication.
	await createUserProfile(credentials.user, fullName)

	return credentials
}

// Obtiene el perfil del usuario autenticado desde users/{uid}.
async function getUserProfile(uid) {
	const profileRef = doc(db, 'users', uid)
	const profileSnapshot = await getDoc(profileRef)

	if (!profileSnapshot.exists()) {
		return null
	}

	return profileSnapshot.data()
}

function login(email, password) {
	return signInWithEmailAndPassword(auth, email, password)
}

function logout() {
	return signOut(auth)
}

function observeAuthState(callback) {
	return onAuthStateChanged(auth, callback)
}

export { register, login, logout, observeAuthState, getUserProfile }
