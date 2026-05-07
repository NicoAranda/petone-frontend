import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidEmail, isValidRut, isValidPhone, isNonEmpty } from '../lib/validators'

export const LoginPage = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rut, setRut] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  const API_BASE = import.meta.env.VITE_API_BASE || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    // client-side validations
    const validationErrors = {}
    if (!isNonEmpty(nombre)) validationErrors.nombre = 'El nombre es obligatorio'
    if (!isNonEmpty(apellido)) validationErrors.apellido = 'El apellido es obligatorio'
    if (!isValidEmail(email)) validationErrors.email = 'Correo inválido (debe terminar en @gmail.com, @hotmail.com o @admin.cl)'
    if (!password || password.length < 6) validationErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    if (!isValidRut(rut)) validationErrors.rut = 'RUT inválido'
    if (!isValidPhone(telefono)) validationErrors.telefono = 'Número de teléfono inválido'

    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)

    const payload = {
      nombre,
      apellido,
      email,
      password,
      rut,
      telefono,
      rol: 'CLIENTE'
    }

    try {
      const res = await fetch(`${API_BASE}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Error en el registro')
      }

      alert('Registro exitoso')
      navigate('/HomePage')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBlurValidate = (field) => {
    const e = {}
    if (field === 'nombre') {
      if (!isNonEmpty(nombre)) e.nombre = 'El nombre es obligatorio'
    }
    if (field === 'apellido') {
      if (!isNonEmpty(apellido)) e.apellido = 'El apellido es obligatorio'
    }
    if (field === 'email') {
      if (!isValidEmail(email)) e.email = 'Correo inválido (debe terminar en @gmail.com, @hotmail.com o @admin.cl)'
    }
    if (field === 'password') {
      if (!password || password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (field === 'rut') {
      if (!isValidRut(rut)) e.rut = 'RUT inválido'
    }
    if (field === 'telefono') {
      if (!isValidPhone(telefono)) e.telefono = 'Número de teléfono inválido'
    }
    setErrors(prev => ({ ...prev, ...e }))
  }

  return (
    <div className="d-flex justify-content-center align-items-center w-100 pt-4">
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, width: '100%' }}>
        <h3 className="mb-4">Crear cuenta</h3>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onBlur={() => handleBlurValidate('nombre')}
            placeholder="Juan"
            required
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            onBlur={() => handleBlurValidate('apellido')}
            placeholder="Pérez"
            required
          />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => handleBlurValidate('email')}
            placeholder="correo@ejemplo.com"
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => handleBlurValidate('password')}
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
            value={rut}
            onChange={e => setRut(e.target.value)}
            onBlur={() => handleBlurValidate('rut')}
            placeholder="12.345.678-9"
            required
          />
          {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Número de teléfono</label>
          <input
            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            onBlur={() => handleBlurValidate('telefono')}
            placeholder="+56912345678"
            required
          />
          {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>
      </form>
    </div>
  )
}

export default LoginPage
