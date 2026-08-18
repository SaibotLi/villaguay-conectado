import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useInterest } from '../../hooks/useInterest'
import Button from '../ui/Button/Button'
import styles from './InterestButton.module.css'

function InterestButton({ eventId }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { interested, count, loading, toggle } = useInterest(eventId, user?.uid)

  const interestedLabel = count === 1
    ? '1 persona interesada'
    : `${count} personas interesadas`

  async function handleClick() {
    if (!user) {
      navigate('/login')
      return
    }

    await toggle()
  }

  return (
    <div className={styles.container}>
      <Button type="button" variant="accent" onClick={handleClick} disabled={loading}>
        {interested ? '💖 Ya te interesa' : '❤️ Me interesa'}
      </Button>
      <p className={styles.count}>{interestedLabel}</p>
    </div>
  )
}

export default InterestButton
