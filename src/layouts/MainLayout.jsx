import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar/Navbar'
import Footer from '../components/layout/Footer/Footer'
import containerStyles from '../styles/container.module.css'
import styles from './MainLayout.module.css'

function MainLayout() {
	return (
		<div className={styles.layout}>
			<Navbar />
			<main className={styles.content}>
				<div className={containerStyles.container}>
					<Outlet />
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default MainLayout
