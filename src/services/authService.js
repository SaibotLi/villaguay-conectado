import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
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

	// Envia el correo de verificacion y cierra la sesion hasta que el usuario confirme su correo.
	await sendEmailVerification(credentials.user)
	await signOut(auth)

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

async function login(email, password) {
	const credentials = await signInWithEmailAndPassword(auth, email, password)

	if (!credentials.user.emailVerified) {
		// Corta la sesion si el correo todavia no fue verificado.
		await signOut(auth)

		const verificationError = new Error('El correo electronico aun no fue verificado.')
		verificationError.code = 'auth/email-not-verified'
		throw verificationError
	}

	return credentials
}

async function loginWithGoogle() {
	const provider = new GoogleAuthProvider()
	const credentials = await signInWithPopup(auth, provider)
	const existingProfile = await getUserProfile(credentials.user.uid)

	if (!existingProfile) {
		// Crea el perfil la primera vez que el usuario ingresa con Google.
		await createUserProfile(credentials.user, credentials.user.displayName ?? '')
	}

	return credentials
}

// Reenvia el correo de verificacion sin dejar una sesion abierta.
async function resendVerificationEmail(email, password) {
	const credentials = await signInWithEmailAndPassword(auth, email, password)

	await sendEmailVerification(credentials.user)
	await signOut(auth)
}

function sendPasswordReset(email) {
	return sendPasswordResetEmail(auth, email)
}

function logout() {
	return signOut(auth)
}

function observeAuthState(callback) {
	return onAuthStateChanged(auth, callback)
}

export {
	register,
	login,
	loginWithGoogle,
	logout,
	observeAuthState,
	getUserProfile,
	resendVerificationEmail,
	sendPasswordReset,
}
