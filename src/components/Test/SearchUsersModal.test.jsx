import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SearchUsersModal from '../UsersSearch/SearchUsersModal'

describe('SearchUsersModal', () => {
  test('does not render when closed and renders when open; header and close button present', () => {
    const onClose = vi.fn()
    const { container, rerender } = render(
      <MemoryRouter>
        <SearchUsersModal isOpen={false} onClose={onClose} />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()

    rerender(
      <MemoryRouter>
        <SearchUsersModal isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Buscar/i)).toBeInTheDocument()

    const closeBtn = container.querySelector('.btn-close')
    expect(closeBtn).toBeInTheDocument()
  })

  test('renders results for publication metadata such as species, commune, or status', async () => {
    const onClose = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 10,
          type: 'publicacion',
          nombre: 'Luna',
          especie: 'Perro',
          ubicacion: 'Providencia',
          estado: 'ACTIVA',
          usuario: { nombre: 'Ana', apellido: 'Pérez' }
        }
      ]
    })

    vi.stubGlobal('fetch', fetchMock)

    render(
      <MemoryRouter>
        <SearchUsersModal isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/nombre de usuario|especie|raza|comuna|estado/i)
    await userEvent.type(input, 'prov')

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText(/Luna/i)).toBeInTheDocument())
    expect(screen.getByText(/Providencia/i)).toBeInTheDocument()
  })
})
