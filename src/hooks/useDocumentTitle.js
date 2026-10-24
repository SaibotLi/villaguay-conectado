import { useEffect } from 'react'

const BASE_TITLE = 'VillaguayConectado'

/**
 * Hook reutilizable para gestionar el título del documento (pestaña del navegador)
 * de forma reactiva y accesible en aplicaciones SPA.
 *
 * @param {string} [title] - Título específico de la pantalla activa (ej. "Eventos" o el título del evento).
 * @param {boolean} [retainOnUnmount=false] - Si es true, preserva el título al desmontar hasta que el siguiente componente tome el control.
 */
export function useDocumentTitle(title, retainOnUnmount = false) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`
    } else {
      document.title = BASE_TITLE
    }

    return () => {
      if (!retainOnUnmount) {
        document.title = BASE_TITLE
      }
    }
  }, [title, retainOnUnmount])
}

export default useDocumentTitle
