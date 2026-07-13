import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { PersonalInfo } from '../Perfil/PersonalInfo'

describe('PersonalInfo', () => {
  it('renders the user description when available', () => {
    render(
      <PersonalInfo
        userData={{
          nombre: 'Ana',
          apellido: 'Pérez',
          descripcion: 'Soy veterinaria y me encanta ayudar a mascotas.'
        }}
      />
    )

    expect(screen.getByText(/Soy veterinaria/i)).toBeInTheDocument()
  })

  it('saves the privacy toggle for the owner profile', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    global.fetch = fetchMock
    localStorage.setItem('token', 'token.test')

    render(
      <PersonalInfo
        userData={{
          nombre: 'Ana',
          apellido: 'Pérez',
          descripcion: 'Soy veterinaria.',
          privacidadDatos: false
        }}
        currentUserId={7}
        isOwnProfile={true}
        onProfileUpdated={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /editar/i }))
    fireEvent.click(screen.getByLabelText(/perfil público/i))
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.privacidadDatos).toBe(true)
  })
})
