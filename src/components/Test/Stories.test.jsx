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

    const { container } = render(
      <MemoryRouter>
        <Stories posts={samplePosts} />
      </MemoryRouter>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    expect(container.querySelector('.bi-chevron-left')).toBeInTheDocument()
    expect(container.querySelector('.bi-chevron-right')).toBeInTheDocument()
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(0)
  })
})
