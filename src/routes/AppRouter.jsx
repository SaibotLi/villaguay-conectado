import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import Events from '../pages/Events/Events'
import EventDetail from '../pages/EventDetail/EventDetail'
import CreateEvent from '../pages/CreateEvent/CreateEvent'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Community from '../pages/Community/Community'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import Admin from '../pages/Admin/Admin'
import NotFound from '../pages/NotFound/NotFound'

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="eventos" element={<Events />} />
					<Route path="eventos/:id" element={<EventDetail />} />
					<Route path="proponer-evento" element={<CreateEvent />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="comunidad" element={<Community />} />
					<Route path="sobre" element={<About />} />
					<Route path="contacto" element={<Contact />} />
					<Route path="admin" element={<Admin />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
