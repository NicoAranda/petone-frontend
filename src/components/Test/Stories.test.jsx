import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Stories } from '../StoriesBar/Stories'

describe('Stories (simple)', () => {
  test('renders navigation buttons and story images', () => {
    render(
      <MemoryRouter>
        <Stories />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /chevron-left/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chevron-right/i })).toBeInTheDocument()
    // At least one story image should be present
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(0)
  })
})
