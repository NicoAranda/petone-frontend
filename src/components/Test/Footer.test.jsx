import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../Footer'

describe('Footer (simple)', () => {
  test('renders brand info and links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(screen.getByText(/Sobre Pet-One/i)).toBeInTheDocument()
    expect(screen.getByText(/contacto@petone.example/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Términos/i).length).toBeGreaterThanOrEqual(1)
  })
})
