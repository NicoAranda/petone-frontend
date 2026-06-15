import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Stories } from '../StoriesBar/Stories'

describe('Stories (simple)', () => {
  test('renders navigation buttons and story images', () => {
    const samplePosts = [
      {
        id: 1,
        usuario: { nombre: 'User', apellido: 'One' },
        fotos: ['https://example.com/story1.jpg'],
        fechaPublicacion: new Date().toISOString()
      }
    ]

    render(
      <MemoryRouter>
        <Stories posts={samplePosts} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /chevron-left/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chevron-right/i })).toBeInTheDocument()
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(0)
  })
})
