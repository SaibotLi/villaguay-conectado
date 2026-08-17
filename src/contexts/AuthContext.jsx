import { createContext, useEffect, useMemo, useState } from 'react'
import {
	getUserProfile,
	login,
	logout,
	observeAuthState,
	register,
} from '../services/authService'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Mantiene sincronizado el estado local con la sesión real en Firebase Authentication.
		const unsubscribe = observeAuthState(async (firebaseUser) => {
			if (!firebaseUser) {
				setUser(null)
				setLoading(false)
				return
			}

			try {
				// Enriquece el usuario de Authentication con el perfil guardado en Firestore.
				const profile = await getUserProfile(firebaseUser.uid)

				setUser({
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: profile?.displayName ?? firebaseUser.displayName ?? '',
					role: profile?.role ?? null,
				})
			} catch {
				// Mantiene la app estable si falla la lectura del perfil.
				setUser({
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: firebaseUser.displayName ?? '',
					role: null,
				})
			} finally {
				setLoading(false)
			}
		})

		return unsubscribe
	}, [])

	const value = useMemo(
		() => ({
			user,
			loading,
			register,
			login,
			logout,
		}),
		[user, loading],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
