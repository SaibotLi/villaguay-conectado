import { useEffect, useRef } from 'react'
import { Share, PlusSquare, X } from 'lucide-react'
import usePwa from '../../../hooks/usePwa'
import Button from '../Button/Button'
import isotype from '../../../assets/branding/isotype.png'
import styles from './PwaIosModal.module.css'

function PwaIosModal() {
  const { isIosModalOpen, closeIosModal } = usePwa()
  const modalRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  useEffect(() => {
    if (!isIosModalOpen) return

    // Guardar elemento con foco previo para restaurarlo al cerrar
    previousActiveElementRef.current = document.activeElement

    // Bloquear scroll de fondo
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Foco inicial en el modal
    const focusTimer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector('button')
      closeBtn?.focus()
    }, 50)

    // Manejo de teclado (Escape y Focus Trap)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeIosModal()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElementRef.current?.focus) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isIosModalOpen, closeIosModal])

  if (!isIosModalOpen) return null

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeIosModal()
        }
      }}
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-modal-title"
      >
        <div className={styles.header}>
          <div className={styles.brandGroup}>
            <img src={isotype} alt="" className={styles.brandIcon} />
            <h2 id="ios-modal-title" className={styles.title}>
              Instalar en tu iPhone o iPad
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeIconButton}
            onClick={closeIosModal}
            aria-label="Cerrar instrucciones"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className={styles.subtitle}>
          Seguí estos tres sencillos pasos desde Safari para tener la aplicación en tu pantalla de inicio:
        </p>

        <ol className={styles.stepsList}>
          <li className={styles.stepItem}>
            <div className={styles.stepBadge} aria-hidden="true">
              <Share size={18} />
            </div>
            <div className={styles.stepText}>
              <strong>1. Tocá el botón Compartir</strong>
              <span>Ubicado en la barra de herramientas inferior de Safari.</span>
            </div>
          </li>

          <li className={styles.stepItem}>
            <div className={styles.stepBadge} aria-hidden="true">
              <PlusSquare size={18} />
            </div>
            <div className={styles.stepText}>
              <strong>2. Elegí «Agregar a pantalla de inicio»</strong>
              <span>Desplazate hacia abajo en la lista de opciones y seleccionala.</span>
            </div>
          </li>

          <li className={styles.stepItem}>
            <div className={styles.stepNumberBadge} aria-hidden="true">
              3
            </div>
            <div className={styles.stepText}>
              <strong>3. Confirmá tocando «Agregar»</strong>
              <span>Arriba a la derecha. ¡Listo! El ícono aparecerá en tu teléfono.</span>
            </div>
          </li>
        </ol>

        <div className={styles.actions}>
          <Button type="button" variant="primary" onClick={closeIosModal}>
            Entendido
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PwaIosModal
