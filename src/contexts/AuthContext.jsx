import { createContext, useEffect, useMemo, useState } from 'react'
import {
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
		const unsubscribe = observeAuthState((firebaseUser) => {
			setUser(firebaseUser)
			setLoading(false)
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
