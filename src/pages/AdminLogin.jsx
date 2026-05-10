import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const ADMIN_TOKEN_KEY = 'petone-admin-token'
const DEFAULT_ADMIN = {
  email: 'admin@petone.com',
  password: 'admin123',
}

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Ingresa correo y contraseña para continuar.')
      return
    }

    setLoading(true)
    const apiBase = import.meta.env.VITE_API_URL || ''
    const loginUrl = `${apiBase}/api/admin/login`

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token || data.accessToken || 'admin-token'
        localStorage.setItem(ADMIN_TOKEN_KEY, token)
        localStorage.setItem('petone-admin-email', email)
        toast.success('Bienvenido, administrador.')
        navigate('/admin', { replace: true })
        return
      }

      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        localStorage.setItem(ADMIN_TOKEN_KEY, 'admin-demo-token')
        localStorage.setItem('petone-admin-email', email)
        toast.success('Bienvenido, administrador (modo demo).')
        navigate('/admin', { replace: true })
        return
      }

      toast.error('Credenciales incorrectas. Verifica email y contraseña.')
    } catch (error) {
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        localStorage.setItem(ADMIN_TOKEN_KEY, 'admin-demo-token')
        localStorage.setItem('petone-admin-email', email)
        toast.success('Bienvenido, administrador (modo demo).')
        navigate('/admin', { replace: true })
      } else {
        toast.error('No se pudo conectar con el backend. Verifica la configuración.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="card-title mb-3 text-center">Acceso de administrador</h2>
              <p className="text-muted text-center mb-4">
                Ingresa con tu usuario y contraseña preconfigurados en el backend.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@petone.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Contraseña"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Validando...' : 'Entrar al panel'}
                </button>
              </form>
              <div className="mt-3 text-muted small">
                Usuario demo: <strong>{DEFAULT_ADMIN.email}</strong> / {DEFAULT_ADMIN.password}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
