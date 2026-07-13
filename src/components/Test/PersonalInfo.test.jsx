import React from 'react'
import { render, screen } from '@testing-library/react'
import { PersonalInfo } from '../Perfil/PersonalInfo'

describe('PersonalInfo', () => {
  it('renders the user description when available', () => {
    render(
      <PersonalInfo
        userData={{
          nombre: 'Ana',
          apellido: 'Pérez',
          descripcion: 'Soy veterinaria y me encanta ayudar a mascotas.'
        }}
      />
    )

    expect(screen.getByText(/Soy veterinaria/i)).toBeInTheDocument()
  })
})
