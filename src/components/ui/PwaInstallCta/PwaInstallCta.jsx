import { Smartphone, Download, CheckCircle2 } from 'lucide-react'
import usePwa from '../../../hooks/usePwa'
import Button from '../Button/Button'
import isotype from '../../../assets/branding/isotype.png'
import styles from './PwaInstallCta.module.css'

function PwaInstallCta() {
  const { canInstall, isInstalled, canInstallIos, promptInstall, openIosModal } = usePwa()

  // No renderizar si ya está instalado en standalone o si el navegador no soporta instalación
  if (isInstalled || !canInstall) {
    return null
  }

  const handleAction = () => {
    if (canInstallIos) {
      openIosModal()
    } else {
      promptInstall()
    }
  }

  return (
    <section className={styles.section} aria-labelledby="pwa-install-heading">
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.headerGroup}>
            <span className={styles.eyebrow}>
              <Smartphone size={14} aria-hidden="true" />
              Acceso rápido desde tu celular
            </span>
            <h2 id="pwa-install-heading" className={styles.title}>
              Llevá la agenda de Villaguay con vos
            </h2>
          </div>

          <p className={styles.description}>
            Instalá la aplicación en la pantalla de inicio de tu teléfono para enterarte de los eventos al instante, sin ocupar espacio y con acceso directo.
          </p>

          <ul className={styles.benefitsList} aria-label="Beneficios de instalar la aplicación">
            <li className={styles.benefitItem}>
              <CheckCircle2 size={16} className={styles.benefitIcon} aria-hidden="true" />
              <span>Acceso directo con un toque</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircle2 size={16} className={styles.benefitIcon} aria-hidden="true" />
              <span>Pantalla completa sin barra de navegador</span>
            </li>
            <li className={styles.benefitItem}>
              <CheckCircle2 size={16} className={styles.benefitIcon} aria-hidden="true" />
              <span>Sin descargas pesadas desde tiendas</span>
            </li>
          </ul>

          <div className={styles.actionArea}>
            <Button
              type="button"
              variant="accent"
              className={styles.actionButton}
              onClick={handleAction}
            >
              <Download size={18} aria-hidden="true" />
              <span>
                {canInstallIos ? 'Cómo instalar en iPhone / iPad' : 'Instalar en tu teléfono'}
              </span>
            </Button>
          </div>
        </div>

        <div className={styles.visualContainer} aria-hidden="true">
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.phoneAppIcon}>
                <img src={isotype} alt="" className={styles.phoneIsotype} />
              </div>
              <span className={styles.phoneAppName}>VillaguayConectado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PwaInstallCta
