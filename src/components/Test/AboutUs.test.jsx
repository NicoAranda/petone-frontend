import React from 'react'
import { render, screen } from '@testing-library/react'
import { AboutUs } from '../AboutUs'

describe('AboutUs (simple)', () => {
  test('renders heading and paragraphs', () => {
    render(<AboutUs />)

    expect(screen.getByText(/Sobre/i)).toBeInTheDocument()
    expect(screen.getByText(/Somos una comunidad/i)).toBeInTheDocument()
  })
})
