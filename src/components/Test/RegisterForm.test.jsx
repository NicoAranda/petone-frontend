import React from 'react'
import { render, screen } from '@testing-library/react'
import { RegisterForm } from '../RegisterForm'

describe('RegisterForm (simple)', () => {
  test('renders heading and inputs', () => {
    render(<RegisterForm />)

    expect(screen.getByRole('heading', { name: /Regístrate/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument()
  })

  test('shows switch-to-login text', () => {
    render(<RegisterForm />)
    expect(screen.getByText(/¿Ya tienes cuenta\? Inicia Sesión/i)).toBeInTheDocument()
  })
})
