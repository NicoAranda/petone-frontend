import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

export const PublicationPerfilView = ({
  publicaciones = []
}) => {
  const navigate = useNavigate();

  if (!publicaciones.length) {
    return (
      <div className="profile-empty-state text-center py-5 px-3">
        <div className="profile-empty-icon mx-auto mb-3">
          <i className="bi bi-images" />
        </div>

        <h3 className="h6 fw-bold mb-2">
          No tienes publicaciones
        </h3>

        <p className="text-muted mb-0">
          Las publicaciones que realices aparecerán en esta
          sección.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-publications-grid mt-3">
      {publicaciones.map((post) => {
        const primeraImagen =
          Array.isArray(post.fotos) && post.fotos.length > 0
            ? post.fotos[0]
            : 'https://placehold.co/600x600?text=Sin+Imagen';

        return (
          <button
            key={post.id}
            type="button"
            className="profile-publication-card"
            onClick={() =>
              navigate(`/post/${post.id}`, {
                state: { post }
              })
            }
            aria-label={`Abrir publicación ${
              post.nombre || post.id
            }`}
          >
            <img
              src={primeraImagen}
              alt={post.nombre || 'Publicación de mascota'}
              className="profile-publication-image"
              loading="lazy"
            />

            <div className="profile-publication-overlay">
              <div className="d-flex align-items-center gap-3">
                <span>
                  <i className="bi bi-heart-fill me-1" />
                  {post.likes?.length || post.likes || 0}
                </span>

                <span>
                  <i className="bi bi-chat-fill me-1" />
                  {post.comentarios?.length ||
                    post.comentarios ||
                    0}
                </span>
              </div>
            </div>

            {post.estado && (
              <span
                className={`profile-publication-status badge ${
                  post.estado?.toUpperCase() === 'PERDIDO'
                    ? 'bg-danger'
                    : 'bg-success'
                }`}
              >
                {post.estado}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};