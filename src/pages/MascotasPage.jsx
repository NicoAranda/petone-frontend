import React, { useEffect, useState } from 'react';
import { API } from '../lib/api';
import toast from 'react-hot-toast';

export const MascotasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMascotas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/mascotas`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar las mascotas');
      }
      const data = await response.json();
      const mascotasVisibles = (Array.isArray(data) ? data : []).filter((pet) => {
        const estado = (pet?.estado || '').toString().trim().toLowerCase();
        return estado !== 'perdido' && estado !== 'reportado';
      });
      setMascotas(mascotasVisibles);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const handleLike = async (petId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mascotas/${petId}/like`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error('No se pudo dar like');
      }

      const updatedPet = await response.json();
      setMascotas((prev) => prev.map((pet) => (pet.id === petId ? updatedPet : pet)));
      toast.success('Me gusta agregado');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo dar like');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-3 text-muted">Cargando mascotas...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Mascotas</h2>
        <p className="text-muted">Descubre mascotas publicadas por las cuentas y dale me gusta a las que más te gusten.</p>
      </div>

      {mascotas.length === 0 ? (
        <div className="text-center text-muted py-5">No hay mascotas disponibles.</div>
      ) : (
        <div className="row g-4">
          {mascotas.map((pet) => {
            const petImage = pet.fotoUrl || 'https://placehold.co/600x400?text=Sin+Foto';
            const petState = pet.estado || 'Activo';
            const isReported = petState === 'Reportado';

            return (
              <div key={pet.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={petImage} alt={pet.nombre} style={{ height: '240px', objectFit: 'cover', width: '100%' }} />
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-1">{pet.nombre || 'Mascota sin nombre'}</h5>
                        <p className="text-muted small mb-0">{pet.raza || 'Raza desconocida'}</p>
                      </div>
                      <span className={`badge ${isReported ? 'bg-danger' : 'bg-success'}`}>{petState}</span>
                    </div>
                    <p className="small text-muted mb-3">{pet.descripcion || 'Sin descripción'}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleLike(pet.id)}>
                        <i className="bi bi-heart-fill me-1"></i>
                        Me gusta ({pet.likes ?? 0})
                      </button>
                      <span className="small text-muted">{pet.tamano || 'Tamaño no especificado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
