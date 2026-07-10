import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from '../components/Post';
import { API } from '../lib/api';

export const PostDetailPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!location.state?.post);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!post && id) {
      setLoading(true);
      fetch(`${API}/publicaciones/${id}`)
        .then(res => res.ok ? res.json() : Promise.reject('Not found'))
        .then(data => {
          setPost(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching post:', err);
          setError('Publicación no encontrada');
          setLoading(false);
        });
    }
  }, [id, post]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Cargando publicación...</p>
      </div>
    );
  }

  if (error || !post) {
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