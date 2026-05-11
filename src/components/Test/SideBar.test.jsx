import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { SideBar } from '../SideBar/SideBar'

describe('SideBar (simple)', () => {
  test('renders menu items and calls onOpenModal', async () => {
    const user = userEvent.setup()
    const mockOpen = vi.fn()

    render(
      <MemoryRouter>
        <AuthProvider>
          <SideBar onOpenModal={mockOpen} />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/Inicio/i)).toBeInTheDocument()
    const createLabel = screen.getByText(/Crear publicación/i)
    expect(createLabel).toBeInTheDocument()

    await user.click(createLabel)
    expect(mockOpen).toHaveBeenCalled()
  })
})
