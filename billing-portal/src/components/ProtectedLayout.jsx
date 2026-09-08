import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Sidebar from '../components/Sidebar'
import Spinner from '../components/Spinner'

export default function ProtectedLayout() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f3f6ef]">
        <Spinner label="Checking session…" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
