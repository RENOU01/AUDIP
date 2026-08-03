import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import MatrixRain from './components/MatrixRain'

import Home from './pages/Home'
import Autoridades from './pages/Autoridades'
import Mapa from './pages/Mapa'
import Grupos from './pages/Grupos'
import Login from './pages/Login'

import AdminLayout from './pages/admin/AdminLayout'
import AdminAgrupaciones from './pages/admin/AdminAgrupaciones'
import AdminIntegrantes from './pages/admin/AdminIntegrantes'
import AdminAutoridades from './pages/admin/AdminAutoridades'
import AdminMensajes from './pages/admin/AdminMensajes'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <MatrixRain />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autoridades" element={<Autoridades />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminAgrupaciones />} />
            <Route path="integrantes" element={<AdminIntegrantes />} />
            <Route path="autoridades" element={<AdminAutoridades />} />
            <Route path="mensajes" element={<AdminMensajes />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
