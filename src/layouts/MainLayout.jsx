import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar/Navbar'
import Footer from '../components/layout/Footer/Footer'
import styles from './MainLayout.module.css'

function MainLayout() {
	return (
		<div className={styles.layout}>
			<Navbar />
			<main className={styles.content}>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default MainLayout
