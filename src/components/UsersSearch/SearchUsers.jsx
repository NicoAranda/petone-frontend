import React, { useEffect, useState } from 'react'
import { API } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import './SearchUsers.css'

const normalizeText = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const matchesQuery = (value, query) => {
  if (!value) return false
  return normalizeText(value).includes(normalizeText(query))
}

const buildUserLabel = (user) => {
  const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ').trim()
  return fullName || user.email || 'Usuario'
}

export const SearchUsers = ({ maxWidth = 470, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    const id = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        const [usersResponse, publicationsResponse, petsResponse] = await Promise.all([
          fetch(`${API}/usuarios/buscar?q=${encodeURIComponent(query.trim())}`),
          fetch(`${API}/publicaciones`),
          fetch(`${API}/mascotas`)
        ])

        const users = usersResponse.ok ? await usersResponse.json() : []
        const publications = publicationsResponse.ok ? await publicationsResponse.json() : []
        const pets = petsResponse.ok ? await petsResponse.json() : []

        const normalizedResults = []

        users.forEach((user) => {
          const searchableText = [user.nombre, user.apellido, user.email].join(' ')
          if (matchesQuery(searchableText, query)) {
            normalizedResults.push({
              id: `user-${user.id}`,
              type: 'usuario',
              name: buildUserLabel(user),
              subtitle: user.email,
              imageName: buildUserLabel(user),
              route: `/perfil/${user.id}`
            })
          }
        })

        publications.forEach((publication) => {
          const searchableText = [
            publication.nombre,
            publication.especie,
            publication.ubicacion,
            publication.estado,
            publication.descripcion,
            publication.usuario?.nombre,
            publication.usuario?.apellido,
            publication.usuario?.email
          ].join(' ')

          if (matchesQuery(searchableText, query)) {
            normalizedResults.push({
              id: `publication-${publication.id}`,
              type: 'publicacion',
              name: publication.nombre || 'Mascota en adopción',
              subtitle: [publication.especie, publication.ubicacion, publication.estado].filter(Boolean).join(' • '),
              imageName: publication.nombre || publication.especie || 'Publicación',
              route: `/post/${publication.id}`
            })
          }
        })

        pets.forEach((pet) => {
          const searchableText = [
            pet.nombre,
            pet.raza,
            pet.estado,
            pet.descripcion,
            pet.usuario?.nombre,
            pet.usuario?.apellido,
            pet.usuario?.email
          ].join(' ')

          if (matchesQuery(searchableText, query)) {
            normalizedResults.push({
              id: `pet-${pet.id}`,
              type: 'mascota',
              name: pet.nombre || 'Mascota',
              subtitle: [pet.raza, pet.estado].filter(Boolean).join(' • '),
              imageName: pet.nombre || pet.raza || 'Mascota',
              route: pet.usuarioId ? `/perfil/${pet.usuarioId}` : '/perfil'
            })
          }
        })

        setResults(normalizedResults.slice(0, 10))
      } catch (e) {
        setError(e.message || 'No se pudo completar la búsqueda')
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(id)
  }, [query])

  return (
    <div className="search-users-container mb-3" style={{ maxWidth }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por nombre de usuario, especie, raza, comuna o estado"
        className="form-control search-input"
      />

      {loading && <div className="search-loading">Cargando...</div>}

      {!loading && results.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div
              key={result.id}
              className="search-result-card"
              onClick={() => {
                navigate(result.route)
                if (onClose) onClose()
              }}
            >
              <div className="search-result-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(result.imageName)}&background=198754&color=fff`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: 44, height: 44, objectFit: 'cover' }}
                />
                <div>
                  <div className="search-result-name">{result.name}</div>
                  <div className="search-result-meta">{result.subtitle}</div>
                  <div className="search-result-type">{result.type === 'usuario' ? 'Usuario' : result.type === 'publicacion' ? 'Publicación' : 'Mascota'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="search-empty">No se encontraron resultados que coincidan con la búsqueda.</div>
      )}

      {error && <div className="search-error">{error}</div>}
    </div>
  )
}

export default SearchUsers
