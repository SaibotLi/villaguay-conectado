import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import Events from '../pages/Events/Events'
import EventDetail from '../pages/EventDetail/EventDetail'
import CreateEvent from '../pages/CreateEvent/CreateEvent'
import EditEvent from '../pages/EditEvent/EditEvent'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Community from '../pages/Community/Community'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import Admin from '../pages/Admin/Admin'
import MyInterests from '../pages/MyInterests/MyInterests'
import NotFound from '../pages/NotFound/NotFound'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'

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
					<Route
						path="mis-intereses"
						element={(
							<ProtectedRoute>
								<MyInterests />
							</ProtectedRoute>
						)}
					/>
					<Route
						path="admin"
						element={(
							<ProtectedRoute requiredRole="admin">
								<Admin />
							</ProtectedRoute>
						)}
					/>
					<Route
						path="admin/eventos/:id/editar"
						element={(
							<ProtectedRoute requiredRole="admin">
								<EditEvent />
							</ProtectedRoute>
						)}
					/>
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
