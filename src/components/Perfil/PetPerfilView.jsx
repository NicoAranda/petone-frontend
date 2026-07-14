import React, { useState } from 'react';
import './Perfil.css';
import { API } from '../../lib/api';
import CreatePetModal from '../PetCreate/CreatePetModal';
import CreatePostModal from '../PostCreate/CreatePostModal';
import toast from 'react-hot-toast';

export const PetPerfilView = ({
  mascotas = [],
  onMascotasUpdated,
  onPublicacionesUpdated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] =
    useState(false);
  const [selectedPetForReport, setSelectedPetForReport] =
    useState(null);
  const [loading, setLoading] = useState({});

  const getHeaders = (includeContentType = false) => {
    const token = localStorage.getItem('token');

    return {
      ...(includeContentType
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {})
    };
  };

  const handleEliminarMascota = async (pet) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${pet.nombre || 'esta mascota'
      }?`
    );

    if (!confirmDelete) {
      return;
    }

    const loadingKey = `delete-${pet.id}`;

    try {
      setLoading((previous) => ({
        ...previous,
        [loadingKey]: true
      }));

      const response = await fetch(
        `${API}/mascotas/${pet.id}`,
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar la mascota');
      }

      toast.success('Mascota eliminada correctamente');

      if (onMascotasUpdated) {
        await onMascotasUpdated();
      }
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      toast.error('Error al eliminar la mascota');
    } finally {
      setLoading((previous) => ({
        ...previous,
        [loadingKey]: false
      }));
    }
  };

  const handleReportarPerdida = (pet) => {
    setSelectedPetForReport(pet);
    setIsPostModalOpen(true);
  };

  const handleEncontrada = async (pet) => {
    const loadingKey = `encontrada-${pet.id}`;

    try {
      setLoading((previous) => ({
        ...previous,
        [loadingKey]: true
      }));

      const publicacionesResponse = await fetch(
        `${API}/publicaciones`,
        {
          headers: getHeaders()
        }
      );

      if (publicacionesResponse.ok) {
        const publicaciones =
          await publicacionesResponse.json();

        const publicacionAsociada = Array.isArray(
          publicaciones
        )
          ? publicaciones.find(
            (publication) =>
              publication.nombre === pet.nombre &&
              publication.estado === 'Perdido'
          )
          : null;

        if (publicacionAsociada) {
          await fetch(
            `${API}/publicaciones/${publicacionAsociada.id}`,
            {
              method: 'DELETE',
              headers: getHeaders()
            }
          );
        }
      }

      const petResponse = await fetch(
        `${API}/mascotas/${pet.id}`,
        {
          method: 'PUT',
          headers: getHeaders(true),
          body: JSON.stringify({
            ...pet,
            estado: 'Activo'
          })
        }
      );

      if (!petResponse.ok) {
        throw new Error(
          'No se pudo actualizar el estado de la mascota'
        );
      }

      toast.success('Mascota marcada como encontrada');

      if (onMascotasUpdated) {
        await onMascotasUpdated();
      }

      if (onPublicacionesUpdated) {
        await onPublicacionesUpdated();
      }
    } catch (error) {
      console.error(
        'Error marcando mascota como encontrada:',
        error
      );

      toast.error(
        'Error al marcar la mascota como encontrada'
      );
    } finally {
      setLoading((previous) => ({
        ...previous,
        [loadingKey]: false
      }));
    }
  };

  const handlePetCreated = async () => {
    setIsModalOpen(false);

    if (onMascotasUpdated) {
      await onMascotasUpdated();
    }
  };

  if (!mascotas.length) {
    return (
      <>
        <div className="profile-empty-state text-center py-5 px-3">
          <div className="profile-empty-icon mx-auto mb-3">
            <i className="bi bi-heart-fill" />
          </div>

          <h3 className="h6 fw-bold mb-2">
            No tienes mascotas registradas
          </h3>

          <p className="text-muted mb-4">
            Registra tus mascotas para administrarlas desde tu
            perfil.
          </p>

          <button
            type="button"
            className="btn btn-success rounded-pill px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bi bi-plus-circle me-2" />
            Registrar mascota
          </button>
        </div>

        <CreatePetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handlePetCreated}
        />
      </>
    );
  }

  return (
    <>
      <div className="profile-section-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3">
        <div>
          <h2 className="h6 fw-bold mb-1">
            Mis mascotas
          </h2>

          <small className="text-muted">
            Administra las mascotas asociadas a tu cuenta.
          </small>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-success rounded-pill px-3 w-100 w-sm-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="bi bi-plus-circle me-2" />
          Registrar mascota
        </button>
      </div>

      <div className="row g-3">
        {mascotas.map((pet) => {
          const petName =
            pet.nombre || 'Mascota sin nombre';
          const petBreed =
            pet.raza || 'Raza desconocida';
          const petSize =
            pet.tamano || 'No especificado';
          const petState =
            pet.estado || 'Sin estado';
          const isReported =
            pet.estado?.toUpperCase() === 'REPORTADO';

          const petImage =
            pet.fotoUrl ||
            pet.foto ||
            'https://placehold.co/600x400?text=Sin+Foto';

          const deleteLoading =
            loading[`delete-${pet.id}`];

          const foundLoading =
            loading[`encontrada-${pet.id}`];

          return (
            <div
              key={pet.id}
              className="col-12 col-sm-6 col-xl-4"
            >
              <article className="profile-pet-card card h-100 border-0 shadow-sm">
                <div className="profile-pet-image-wrapper">
                  <img
                    src={petImage}
                    alt={petName}
                    className="profile-pet-image"
                    loading="lazy"
                  />

                  <span
                    className={`profile-pet-status badge ${isReported
                        ? 'bg-danger'
                        : 'bg-success'
                      }`}
                  >
                    {petState}
                  </span>
                </div>

                <div className="card-body d-flex flex-column p-3 p-md-4">
                  <div className="mb-3">
                    <h3 className="h5 fw-bold mb-1 text-break">
                      {petName}
                    </h3>

                    <div className="d-flex flex-wrap gap-2">
                      <span className="profile-pet-detail">
                        <i className="bi bi-tag me-1" />
                        {petBreed}
                      </span>

                      <span className="profile-pet-detail">
                        <i className="bi bi-arrows-angle-expand me-1" />
                        {petSize}
                      </span>
                    </div>
                  </div>

                  <p className="mb-1 small">Tamaño: <strong>{petSize}</strong></p>

                  <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
                    <i className="bi bi-heart-fill text-danger"></i>
                    <span>{pet.likes ?? 0} me gusta</span>
                  </div>

                  {pet.descripcion && (
                    <p className="small text-muted text-break mb-3">
                      {pet.descripcion}
                    </p>
                  )}

                  <div className="d-grid gap-2 mt-auto">
                    {!isReported ? (
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        onClick={() =>
                          handleReportarPerdida(pet)
                        }
                        disabled={foundLoading}
                      >
                        <i className="bi bi-exclamation-triangle me-2" />
                        Reportar como perdida
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleEncontrada(pet)}
                        disabled={foundLoading}
                      >
                        {foundLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              aria-hidden="true"
                            />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2" />
                            Marcar como encontrada
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleEliminarMascota(pet)
                      }
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-2" />
                          Eliminar mascota
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <CreatePetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handlePetCreated}
      />

      <CreatePostModal
        isOpen={isPostModalOpen}
        initialPetData={selectedPetForReport}
        onClose={() => {
          setIsPostModalOpen(false);
          setSelectedPetForReport(null);
        }}
        onCreated={async () => {
          if (!selectedPetForReport) {
            return;
          }

          try {
            const response = await fetch(
              `${API}/mascotas/${selectedPetForReport.id}`,
              {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({
                  ...selectedPetForReport,
                  estado: 'Reportado'
                })
              }
            );

            if (!response.ok) {
              throw new Error(
                'No se pudo actualizar la mascota'
              );
            }

            toast.success(
              'Mascota reportada como perdida'
            );

            if (onMascotasUpdated) {
              await onMascotasUpdated();
            }

            if (onPublicacionesUpdated) {
              await onPublicacionesUpdated();
            }
          } catch (error) {
            console.error(
              'Error al marcar mascota como reportada:',
              error
            );

            toast.error(
              'Error al marcar la mascota como reportada'
            );
          } finally {
            setIsPostModalOpen(false);
            setSelectedPetForReport(null);
          }
        }}
      />
    </>
  );
};