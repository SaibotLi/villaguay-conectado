import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useInterest } from '../../hooks/useInterest'
import styles from './InterestButton.module.css'

function InterestButton({ eventId }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { interested, loading, toggle } = useInterest(eventId, user?.uid)

  async function handleClick() {
    if (!user) {
      navigate('/login')
      return
    }

    await toggle()
  }

  return (
    <button type="button" className={styles.button} onClick={handleClick} disabled={loading}>
      {interested ? '💖 Ya te interesa' : '❤️ Me interesa'}
    </button>
  )
}

export default InterestButton
