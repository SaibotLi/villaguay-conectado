import AppRouter from './routes/AppRouter'
import { AuthProvider } from './contexts/AuthContext'
import { PwaProvider } from './contexts/PwaContext'

function App() {
  return (
    <AuthProvider>
      <PwaProvider>
        <AppRouter />
      </PwaProvider>
    </AuthProvider>
  )
}

export default App
