import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SearchUsersModal from '../UsersSearch/SearchUsersModal'

describe('SearchUsersModal', () => {
  test('does not render when closed and renders when open; header and close button present', () => {
    const onClose = vi.fn()
    const { container, rerender } = render(
      <MemoryRouter>
        <SearchUsersModal isOpen={false} onClose={onClose} />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()

    rerender(
      <MemoryRouter>
        <SearchUsersModal isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Buscar usuarios/i)).toBeInTheDocument()

    const closeBtn = container.querySelector('.btn-close')
    expect(closeBtn).toBeInTheDocument()
  })
})
