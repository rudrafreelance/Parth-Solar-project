import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedLayout from './components/ProtectedLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BillList from './pages/BillList'
import BillForm from './pages/BillForm'
import Parties from './pages/Parties'
import Items from './pages/Items'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bills" element={<BillList />} />
            <Route path="bills/new/:type" element={<BillForm />} />
            <Route path="bills/:id/edit" element={<BillForm />} />
            <Route path="parties" element={<Parties />} />
            <Route path="items" element={<Items />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
