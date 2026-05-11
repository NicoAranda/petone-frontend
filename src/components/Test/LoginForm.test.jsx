import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { LoginForm } from '../LoginForm'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

describe('LoginForm (simple)', () => {
  test('renders heading and inputs', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument()
  })

  test('calls onSwitchForm when clicking register text', async () => {
    const user = userEvent.setup()
    const onSwitch = vi.fn()
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm onSwitchForm={onSwitch} />
        </AuthProvider>
      </MemoryRouter>
    )

    const switchEl = screen.getByText(/¿No tienes cuenta\? Regístrate/i)
    await user.click(switchEl)

    expect(onSwitch).toHaveBeenCalled()
  })
})
