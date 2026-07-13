import React, { useState } from 'react'
import './Perfil.css'
import { API } from '../../lib/api'
import CreatePetModal from '../PetCreate/CreatePetModal'
import CreatePostModal from '../PostCreate/CreatePostModal'
import toast from 'react-hot-toast'

export const PetPerfilView = ({ mascotas = [], onMascotasUpdated, onPublicacionesUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [selectedPetForReport, setSelectedPetForReport] = useState(null)
  const [loading, setLoading] = useState({})

  const handleEliminarMascota = async (pet) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar a ${pet.nombre}?`)
    if (!confirmDelete) return

    try {
      setLoading(prev => ({ ...prev, [`delete-${pet.id}`]: true }))

      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${API}/mascotas/${pet.id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        toast.success('Mascota eliminada correctamente')
        if (onMascotasUpdated) {
          await onMascotasUpdated()
        }
      } else {
        toast.error('Error al eliminar la mascota')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar la mascota')
    } finally {
      setLoading(prev => ({ ...prev, [`delete-${pet.id}`]: false }))
    }
  }

  const handleReportarPerdida = (pet) => {
    setSelectedPetForReport(pet)
    setIsPostModalOpen(true)
  }

  const handleEncontrada = async (pet) => {
    try {
      setLoading(prev => ({ ...prev, [`encontrada-${pet.id}`]: true }))

      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Eliminar la publicación asociada (búsqueda por nombre/descripción)
      const publicacionesResponse = await fetch(`${API}/publicaciones`, {
        headers
      })

      const publicaciones = await publicacionesResponse.json()
      const publicacionAsociada = publicaciones.find(
        p => p.nombre === pet.nombre && p.estado === 'Perdido'
      )

      if (publicacionAsociada) {
        await fetch(`${API}/publicaciones/${publicacionAsociada.id}`, {
          method: 'DELETE',
          headers
        })
      }

      // Actualizar estado de mascota a Activo
      await fetch(`${API}/mascotas/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ ...pet, estado: 'Activo' })
      })

      toast.success('Mascota marcada como encontrada')
      if (onMascotasUpdated) {
        await onMascotasUpdated()
      }
      if (onPublicacionesUpdated) {
        await onPublicacionesUpdated()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al marcar mascota como encontrada')
    } finally {
      setLoading(prev => ({ ...prev, [`encontrada-${pet.id}`]: false }))
    }
  }

  if (!mascotas.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-paw fs-1 text-muted"></i>
        <p className="mt-3 text-muted">No tienes mascotas registradas.</p>
        <button
          className="btn btn-success mt-3"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Crear Mascota
        </button>
        <CreatePetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => {
            if (onMascotasUpdated) {
              onMascotasUpdated();
            }
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Mis Mascotas</h6>
        <button
          className="btn btn-sm btn-success"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Crear Mascota
        </button>
      </div>

      <div className="row g-3">
        {mascotas.map((pet) => {
          const petName = pet.nombre || 'Mascota sin nombre'
          const petBreed = pet.raza || 'Raza desconocida'
          const petSize = pet.tamano || 'Tamaño no especificado'
          const petState = pet.estado || 'Estado no disponible'
          const isReported = pet.estado === 'Reportado'
          const petImage = pet.fotoUrl || 'https://placehold.co/600x400?text=Sin+Foto'

          return (
            <div key={pet.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm" style={{ borderRadius: '14px' }}>
                <img
                  src={petImage}
                  alt={petName}
                  className="pet-card-image"
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="card-title mb-2">{petName}</h5>
                      <p className="mb-1 text-muted small">{petBreed}</p>
                    </div>
                    <span className={`badge ${isReported ? 'bg-danger' : 'bg-success'}`}>
                      {petState}
                    </span>
                  </div>

                  <p className="mb-1 small">Tamaño: <strong>{petSize}</strong></p>

                  <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
                    <i className="bi bi-heart-fill text-danger"></i>
                    <span>{pet.likes ?? 0} me gusta</span>
                  </div>

                  {pet.descripcion && (
                    <p className="mb-3 small text-muted">{pet.descripcion}</p>
                  )}

                  <div className="d-grid gap-2">
                    {!isReported ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleReportarPerdida(pet)}
                        disabled={loading[pet.id]}
                      >
                        {loading[pet.id] ? (
                          <>
                            <span className='spinner-border spinner-border-sm me-1' aria-hidden="true"></span>
                            <span>Reportando...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-exclamation-circle me-1"></i>
                            Reportar como Perdida
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleEncontrada(pet)}
                        disabled={loading[`encontrada-${pet.id}`]}
                      >
                        {loading[`encontrada-${pet.id}`] ? (
                          <>
                            <span className='spinner-border spinner-border-sm me-1' aria-hidden="true"></span>
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Encontrada
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarMascota(pet)}
                      disabled={loading[`delete-${pet.id}`]}
                    >
                      {loading[`delete-${pet.id}`] ? (
                        <>
                          <span className='spinner-border spinner-border-sm me-1' aria-hidden="true"></span>
                          <span>Eliminando...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-1"></i>
                          Eliminar Mascota
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <CreatePetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          if (onMascotasUpdated) {
            onMascotasUpdated();
          }
        }}
      />

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false)
          setSelectedPetForReport(null)
        }}
        initialPetData={selectedPetForReport}
        onCreated={async () => {
          // Marcar la mascota como reportada
          if (selectedPetForReport) {
            try {
              const token = localStorage.getItem('token')
              const headers = token ? { Authorization: `Bearer ${token}` } : {}

              await fetch(`${API}/mascotas/${selectedPetForReport.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...headers
                },
                body: JSON.stringify({ ...selectedPetForReport, estado: 'Reportado' })
              })

              toast.success('Mascota reportada como perdida')
              if (onMascotasUpdated) {
                await onMascotasUpdated()
              }
              if (onPublicacionesUpdated) {
                await onPublicacionesUpdated()
              }
            } catch (error) {
              console.error('Error al marcar mascota como reportada:', error)
              toast.error('Error al marcar mascota como reportada')
            }
          }

          setIsPostModalOpen(false)
          setSelectedPetForReport(null)
        }}
      />
    </>
  )
}

