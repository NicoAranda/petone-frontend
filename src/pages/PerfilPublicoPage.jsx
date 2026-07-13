import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../lib/api'
import Post from '../components/Post'

export const PerfilPublicoPage = () => {
  const { id } = useParams()
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [uRes, pRes] = await Promise.all([
          fetch(`${API}/usuarios/${id}`),
          fetch(`${API}/publicaciones`)
        ])
        if (!uRes.ok) throw new Error('Error fetching usuario')
        if (!pRes.ok) throw new Error('Error fetching publicaciones')
        const uData = await uRes.json()
        const pData = await pRes.json()
        setUserData(uData)
        const filtered = pData.filter(p => (p.userId && String(p.userId) === String(id)) || (p.usuario && String(p.usuario.id) === String(id)))
        filtered.sort((a,b) => {
          const da = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0
          const db = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0
          return db - da
        })
        setPosts(filtered)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">Cargando perfil...</div>
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>

  return (
    <div className="container mt-4">
      <div className="card mb-4 p-3 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent((userData.nombre||'')+' '+(userData.apellido||''))}&background=198754&color=fff`} alt="avatar" className="rounded-circle" style={{ width: 72, height:72 }} />
          <div>
            <h4 className="mb-0">{userData.nombre} {userData.apellido}</h4>
            {!userData.privacidadDatos ? (
              <>
                <div className="text-muted">{userData.email}</div>
                {userData.telefono ? <div className="text-muted">{userData.telefono}</div> : null}
              </>
            ) : null}
            {!userData.privacidadDatos && userData.descripcion ? (
              <p className="mt-2 mb-0 text-secondary">{userData.descripcion}</p>
            ) : null}
            {userData.privacidadDatos ? (
              <p className="mt-2 mb-0 text-secondary">Este usuario ha decidido mantener sus datos privados.</p>
            ) : null}
          </div>
        </div>
      </div>

      <h5>Publicaciones</h5>
      {posts.length === 0 ? (
        <div className="text-muted">Este usuario no tiene publicaciones.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {posts.map(p => <Post key={p.id || Math.random()} post={p} />)}
        </div>
      )}
    </div>
  )
}

export default PerfilPublicoPage
