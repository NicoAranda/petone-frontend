import React from 'react'
import { render, screen } from '@testing-library/react'
import UsersTable from '../UsersTable'

describe('UsersTable (simple)', () => {
  test('shows empty state when no users', () => {
    render(<UsersTable usuarios={[]} fetchUsuarios={() => {}} API_USERS="/api" loading={false} />)

    expect(screen.getByText(/No se encontraron usuarios\.|Cargando usuarios.../i)).toBeInTheDocument()
  })
})
