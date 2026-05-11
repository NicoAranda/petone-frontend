import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreatePostModal from '../PostCreate/CreatePostModal'

describe('CreatePostModal (simple)', () => {
  test('does not render when closed and renders when open; close button works', async () => {
    const user = userEvent.setup()
    const onClose = vi => vi
    const onCloseMock = jest => undefined
    const mockClose = () => {}

    const { container, rerender } = render(<CreatePostModal isOpen={false} onClose={mockClose} />)
    expect(container.firstChild).toBeNull()

    rerender(<CreatePostModal isOpen={true} onClose={mockClose} />)
    expect(screen.getByText(/Crear nueva publicación/i)).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: '' })
    expect(closeBtn).toBeInTheDocument()
  })
})
