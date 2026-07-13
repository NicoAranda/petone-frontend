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

    expect(screen.getAllByText(/Inicio/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Mascotas/i).length).toBeGreaterThan(0)
    const createLabel = screen.getAllByText(/Crear publicación/i)[0]
    expect(createLabel).toBeInTheDocument()

    await user.click(createLabel)
    expect(mockOpen).toHaveBeenCalled()
  })
})
