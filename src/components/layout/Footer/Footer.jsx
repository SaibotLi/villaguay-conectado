import containerStyles from '../../../styles/container.module.css'
import isotype from '../../../assets/branding/isotype.png'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${containerStyles.container} ${styles.inner}`}>
        <p className={styles.brand}>
          <img src={isotype} alt="" className={styles.brandMark} />
          VillaguayConectado
        </p>
        <p className={styles.tagline}>Proyecto Final UNL</p>
      </div>
    </footer>
  )
}

export default Footer
