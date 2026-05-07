import React, { useState } from 'react'
import { isValidEmail, isValidRut, isValidPhone, isNonEmpty } from '../lib/validators'

const RegisterForm = ({ onSubmit, submitLabel = 'Crear cuenta' }) => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rut, setRut] = useState('')
  const [telefono, setTelefono] = useState('')
  const [errors, setErrors] = useState({})

  const validateAll = () => {
    const validationErrors = {}
    if (!isNonEmpty(nombre)) validationErrors.nombre = 'El nombre es obligatorio'
    if (!isNonEmpty(apellido)) validationErrors.apellido = 'El apellido es obligatorio'
    if (!isValidEmail(email)) validationErrors.email = 'Correo inválido (debe terminar en @gmail.com, @hotmail.com o @admin.cl)'
    if (!password || password.length < 6) validationErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    if (!isValidRut(rut)) validationErrors.rut = 'RUT inválido'
    if (!isValidPhone(telefono)) validationErrors.telefono = 'Número de teléfono inválido'

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateAll()) return

    const data = { nombre, apellido, email, password, rut, telefono }
    if (typeof onSubmit === 'function') {
      onSubmit(data)
      return
    }

    // default: preview behaviour when no onSubmit provided
    alert(
      'Preview (no se envía):\n' +
        JSON.stringify({ nombre, apellido, email, password: password ? '***' : '', rut, telefono }, null, 2)
    )
  }

  const handleBlur = (field) => {
    const e = {}
    if (field === 'nombre') if (!isNonEmpty(nombre)) e.nombre = 'El nombre es obligatorio'
    if (field === 'apellido') if (!isNonEmpty(apellido)) e.apellido = 'El apellido es obligatorio'
    if (field === 'email') if (!isValidEmail(email)) e.email = 'Correo inválido (debe terminar en @gmail.com, @hotmail.com o @admin.cl)'
    if (field === 'password') if (!password || password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    if (field === 'rut') if (!isValidRut(rut)) e.rut = 'RUT inválido'
    if (field === 'telefono') if (!isValidPhone(telefono)) e.telefono = 'Número de teléfono inválido'
    setErrors(prev => ({ ...prev, ...e }))
  }

  return (
    <form className="card shadow-sm p-4" onSubmit={handleSubmit}>
      <h3 className="mb-3">Formulario de registro</h3>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={nombre} onChange={e => setNombre(e.target.value)} onBlur={() => handleBlur('nombre')} placeholder="Juan" />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input className={`form-control ${errors.apellido ? 'is-invalid' : ''}`} value={apellido} onChange={e => setApellido(e.target.value)} onBlur={() => handleBlur('apellido')} placeholder="Pérez" />
        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => handleBlur('email')} placeholder="correo@ejemplo.com" />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => handleBlur('password')} placeholder="Mínimo 6 caracteres" />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">RUT</label>
        <input className={`form-control ${errors.rut ? 'is-invalid' : ''}`} value={rut} onChange={e => setRut(e.target.value)} onBlur={() => handleBlur('rut')} placeholder="12.345.678-9" />
        {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Número de teléfono</label>
        <input className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} value={telefono} onChange={e => setTelefono(e.target.value)} onBlur={() => handleBlur('telefono')} placeholder="+56912345678" />
        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => {
          setNombre('')
          setApellido('')
          setEmail('')
          setPassword('')
          setRut('')
          setTelefono('')
          setErrors({})
        }}>Limpiar</button>
      </div>

      <div className="text-muted small mt-3">Componente reutilizable listo para usar.</div>
    </form>
  )
}

export default RegisterForm
