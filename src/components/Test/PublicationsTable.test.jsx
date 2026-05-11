import React from 'react'
import { render, screen } from '@testing-library/react'
import PublicationsTable from '../PublicationsTable'

describe('PublicationsTable (simple)', () => {
  test('renders header and a publication row', () => {
    const publicaciones = [
      { id: 1, nombre: 'Firulais', ubicacion: 'Santiago', estado: 'ACTIVA' }
    ]
    const fetchPublicaciones = jest => undefined

    render(<PublicationsTable publicaciones={publicaciones} fetchPublicaciones={() => {}} API_PUBLICATIONS="/api" loading={false} />)

    expect(screen.getByText(/Publicaciones/i)).toBeInTheDocument()
    expect(screen.getByText(/Firulais/i)).toBeInTheDocument()
    expect(screen.getByText(/Santiago/i)).toBeInTheDocument()
  })
})
