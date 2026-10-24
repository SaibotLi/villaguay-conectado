import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar/Navbar'
import Footer from '../components/layout/Footer/Footer'
import containerStyles from '../styles/container.module.css'
import styles from './MainLayout.module.css'

function MainLayout() {
  return (
    <div className={styles.layout}>
      {/* Enlace accesible para saltar directamente al contenido principal */}
      <a href="#main-content" className={styles.skipLink}>
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className={styles.content}>
        <div className={containerStyles.container}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
