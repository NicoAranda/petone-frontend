import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Post from '../Post'

describe('Post (simple)', () => {
  const sample = {
    nombre: 'Rex',
    descripcion: 'Perro muy amigable',
    fotos: ['https://example.com/dog.jpg'],
    ubicacion: 'Santiago',
    especie: 'Perro',
    usuario: { id: 42, nombre: 'Rex', apellido: 'Mendoza' },
    fechaPublicacion: new Date(Date.now() - 60 * 1000).toISOString(),
  }

  test('renders title and image without likes', () => {
    render(
      <MemoryRouter>
        <Post post={sample} />
      </MemoryRouter>
    )
    render(<Post post={sample} />)

    const rexMatches = screen.getAllByText(/Rex/i)
    expect(rexMatches.length).toBeGreaterThanOrEqual(1)
    const img = screen.getByAltText(/Publicación de mascota/i)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', sample.fotos[0])
    expect(screen.queryByText(/Me gusta/i)).not.toBeInTheDocument()
    const especieMatches = screen.getAllByText(/Perro/i)
    expect(especieMatches.length).toBeGreaterThanOrEqual(1)
  })

  test('navigates to the author profile when clicking the author name', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Post post={sample} />} />
          <Route path="/perfil/42" element={<div>Perfil del usuario</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /Rex Mendoza/i }))

    expect(screen.getByText(/Perfil del usuario/i)).toBeInTheDocument()
  })
})
