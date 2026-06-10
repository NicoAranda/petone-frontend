import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Post from '../components/Post';

export const PostDetailPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const post = location.state?.post;

  if (!post) {
    return (
      <div className="container py-5 text-center">

        <h3>Publicación no encontrada</h3>

        <button
          className="btn btn-success mt-3"
          onClick={() => navigate('/HomePage')}
        >
          Volver al inicio
        </button>

      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center py-4"
      style={{ minHeight: '100vh' }}
    >

      <div style={{ width: '100%', maxWidth: '470px' }}>

        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <Post post={post} />

      </div>

    </div>
  );
};