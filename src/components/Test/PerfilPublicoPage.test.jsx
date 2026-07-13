import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { PerfilPublicoPage } from '../../pages/PerfilPublicoPage'

vi.mock('../Post', () => ({
  default: ({ post }) => <div>{post.id}</div>
}))

describe('PerfilPublicoPage', () => {
  it('renders the user description for other users to see', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 7, nombre: 'Ana', apellido: 'García', email: 'ana@test.com', descripcion: 'Soy una veterinaria apasionada' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

    render(
      <MemoryRouter initialEntries={['/perfil/7']}>
        <Routes>
          <Route path="/perfil/:id" element={<PerfilPublicoPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Soy una veterinaria apasionada/i)).toBeInTheDocument()
    })
  })
})
