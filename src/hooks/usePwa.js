import { useContext } from 'react'
import { PwaContext } from '../contexts/pwaContextDef'

function usePwa() {
  const context = useContext(PwaContext)
  if (!context) {
    throw new Error('usePwa debe utilizarse dentro de un PwaProvider')
  }
  return context
}

export default usePwa
