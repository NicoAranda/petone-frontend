import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

export const PublicationPerfilView = ({ publicaciones = [] }) => {

  const navigate = useNavigate();

  if (!publicaciones.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-images fs-1 text-muted"></i>

        <p className="mt-3 text-muted">
          No tienes publicaciones todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-2 mt-3">

      {publicaciones.map((post) => {

        const primeraImagen =
          post.fotos?.[0] ||
          'https://placehold.co/600x600?text=Sin+Imagen';

        return (
          <div
            key={post.id}
            className="col-6 col-md-4"
          >
            <div
              className="publication-grid-item"
              onClick={() =>
                navigate(`/post/${post.id}`, {
                  state: { post }
                })
              }
            >
              <img
                src={primeraImagen}
                alt={post.nombre}
                className="publication-grid-image"
              />
            </div>
          </div>
        );
      })}

    </div>
  );
};