import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}))
import toast from 'react-hot-toast'

import CreatePetModal from '../PetCreate/CreatePetModal'

describe('CreatePetModal', () => {
  test('does not render when closed and renders when open; close button works', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    const { container, rerender } = render(<CreatePetModal isOpen={false} onClose={onClose} />)
    expect(container.firstChild).toBeNull()

    rerender(<CreatePetModal isOpen={true} onClose={onClose} />)
    expect(screen.getByText(/Registrar nueva mascota/i)).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: '' })
    expect(closeBtn).toBeInTheDocument()

    await user.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  test('shows error toast when submitting without nombre', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<CreatePetModal isOpen={true} onClose={onClose} />)

    // Disable HTML5 form validation so onSubmit runs even when required inputs are empty
    const form = container.querySelector('form')
    if (form) form.noValidate = true

    const submitBtn = screen.getByRole('button', { name: /Crear Mascota/i })
    await user.click(submitBtn)

    expect(toast.error).toHaveBeenCalled()
  })
})
