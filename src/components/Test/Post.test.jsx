import React from 'react'
import { render, screen } from '@testing-library/react'
import Post from '../Post'

describe('Post (simple)', () => {
  const sample = {
    nombre: 'Rex',
    descripcion: 'Perro muy amigable',
    fotos: ['https://example.com/dog.jpg'],
    ubicacion: 'Santiago',
    especie: 'Perro',
    fechaPublicacion: new Date(Date.now() - 60 * 1000).toISOString(),
  }

  test('renders title and image without likes', () => {
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
})
