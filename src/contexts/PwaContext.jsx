import { useEffect, useState, useMemo, useCallback } from 'react'
import { PwaContext } from './pwaContextDef'

function checkIsStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  )
}

function checkIsIos() {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isIosDevice =
    /iphone|ipad|ipod/.test(userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  return isIosDevice
}

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(checkIsStandalone)
  const [isIosModalOpen, setIsIosModalOpen] = useState(false)
  const [isIos] = useState(checkIsIos)

  useEffect(() => {
    // 1. Escuchar si la app ya corre o cambia a modo standalone
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true)
        setDeferredPrompt(null)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange)
    } else {
      mediaQuery.addListener(handleDisplayModeChange)
    }

    // 2. Capturar evento beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir el banner automático del navegador para controlarlo nosotros
      e.preventDefault()
      // Guardar el evento para dispararlo ante una acción explícita del usuario
      setDeferredPrompt(e)
    }

    // 3. Escuchar confirmación de instalación completada
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setIsIosModalOpen(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange)
      } else {
        mediaQuery.removeListener(handleDisplayModeChange)
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const canInstallPrompt = Boolean(deferredPrompt) && !isInstalled
  const canInstallIos = isIos && !isInstalled
  const canInstall = canInstallPrompt || canInstallIos

  const openIosModal = useCallback(() => {
    setIsIosModalOpen(true)
  }, [])

  const closeIosModal = useCallback(() => {
    setIsIosModalOpen(false)
  }, [])

  const promptInstall = useCallback(async () => {
    // Si tenemos prompt nativo (Android / Chrome)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice
        setDeferredPrompt(null)
        return choiceResult.outcome === 'accepted'
      } catch (err) {
        console.error('Error al solicitar instalación nativa:', err)
        return false
      }
    }

    // Si es iOS Safari, abrimos el modal didáctico accesible
    if (canInstallIos) {
      openIosModal()
      return true
    }

    return false
  }, [deferredPrompt, canInstallIos, openIosModal])

  const value = useMemo(
    () => ({
      isInstalled,
      canInstall,
      canInstallPrompt,
      canInstallIos,
      isIos,
      isIosModalOpen,
      openIosModal,
      closeIosModal,
      promptInstall,
    }),
    [
      isInstalled,
      canInstall,
      canInstallPrompt,
      canInstallIos,
      isIos,
      isIosModalOpen,
      openIosModal,
      closeIosModal,
      promptInstall,
    ]
  )

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>
}
