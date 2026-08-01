import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/auth'

async function register(email, password, fullName) {
	const credentials = await createUserWithEmailAndPassword(auth, email, password)

	if (fullName) {
		await updateProfile(credentials.user, { displayName: fullName })
	}

	return credentials
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

export { register, login, logout, observeAuthState }
