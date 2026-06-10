import React, { useEffect, useState } from 'react'
import { API } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import './SearchUsers.css'

export const SearchUsers = ({ maxWidth = 470 }) => {
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
        const res = await fetch(`${API}/usuarios/buscar?q=${encodeURIComponent(query)}`)
        if (!res.ok) {
          const errorBody = await res.text()
          throw new Error(errorBody || 'Error fetching users')
        }
        const data = await res.json()
        setResults(data.slice(0, 8))
      } catch (e) {
        setError(e.message)
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
        placeholder="Buscar usuarios... (nombre, apellido o email)"
        className="form-control search-input"
      />

      {loading && <div className="search-loading">Cargando...</div>}

      {!loading && results.length > 0 && (
        <div className="search-results">
          {results.map(u => (
            <div
              key={u.id}
              className="search-result-card"
              onClick={() => navigate(`/perfil/${u.id}`)}
            >
              <div className="search-result-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent((u.nombre || '') + ' ' + (u.apellido || ''))}&background=198754&color=fff`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: 44, height: 44, objectFit: 'cover' }}
                />
                <div>
                  <div className="search-result-name">{u.nombre} {u.apellido}</div>
                  <div className="search-result-meta">{u.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="search-empty">No se encontraron usuarios que coincidan.</div>
      )}

      {error && <div className="search-error">{error}</div>}
    </div>
  )
}

export default SearchUsers
