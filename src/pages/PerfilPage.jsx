import React, { useEffect, useState } from 'react';
import { API } from '../lib/api';
import { PersonalInfo } from '../components/Perfil/PersonalInfo';
import { PublicationPerfilView } from '../components/Perfil/PublicationPerfilView';
import { PetPerfilView } from '../components/Perfil/PetPerfilView';
import '../components/Perfil/Perfil.css';

export const PerfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');

  const handleMascotasUpdated = async () => {
    const token = localStorage.getItem('token');
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const userId = decodedPayload.id;

    try {
      const mascotasResponse = await fetch(
        `${API}/mascotas/usuario/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (mascotasResponse.ok) {
        const mascotasData = await mascotasResponse.json();
        setMascotas(mascotasData);
      } else {
        console.error('Error fetching mascotas:', mascotasResponse.status);
      }
    } catch (err) {
      console.error('Error refetching mascotas:', err);
    }
  };

  const handlePublicacionesUpdated = async () => {
    const token = localStorage.getItem('token');
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const userId = decodedPayload.id;

    try {
      const publicacionesResponse = await fetch(
        `${API}/publicaciones/usuario/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (publicacionesResponse.ok) {
        const publicacionesData = await publicacionesResponse.json();
        setPublicaciones(publicacionesData);
      } else {
        console.error('Error fetching publicaciones:', publicacionesResponse.status);
      }
    } catch (err) {
      console.error('Error refetching publicaciones:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay sesión iniciada');
        }

        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userId = decodedPayload.id;

        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario desde el token.');
        }

        // Usuario
        const userResponse = await fetch(`${API}/usuarios/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Error al obtener los datos del perfil');
        }

        const userDataResponse = await userResponse.json();
        setUserData(userDataResponse);

        // Publicaciones
        const publicacionesResponse = await fetch(`${API}/publicaciones/usuario/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!publicacionesResponse.ok) {
          throw new Error('Error al obtener las publicaciones');
        }

        const publicacionesData = await publicacionesResponse.json();
        setPublicaciones(publicacionesData);

        // Mascotas
        const mascotasResponse = await fetch(`${API}/mascotas/usuario/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!mascotasResponse.ok) {
          throw new Error('Error al obtener las mascotas');
        }

        const mascotasData = await mascotasResponse.json();
        setMascotas(mascotasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="alert alert-danger shadow rounded-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <section className="container-fluid p-0 overflow-hidden bg-white w-50 mx-auto shadow rounded-4">
          <PersonalInfo userData={userData} />
        </section>
      </div>

      <div className="container mt-4">
        <nav className="bg-white shadow-sm rounded-4 border">
          <ul className="nav nav-pills nav-fill p-2">
            <li className="nav-item">
              <button
                className={`nav-link profile-nav-link ${activeTab === 'publicaciones' ? 'active' : ''}`}
                onClick={() => setActiveTab('publicaciones')}
              >
                Publicaciones
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link profile-nav-link ${activeTab === 'mascotas' ? 'active' : ''}`}
                onClick={() => setActiveTab('mascotas')}
              >
                Mascotas
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link profile-nav-link ${activeTab === 'guardados' ? 'active' : ''}`}
                onClick={() => setActiveTab('guardados')}
              >
                Guardados
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-3">
          {activeTab === 'publicaciones' && (
            <PublicationPerfilView publicaciones={publicaciones} />
          )}
          {activeTab === 'mascotas' && (
            <PetPerfilView mascotas={mascotas} onMascotasUpdated={handleMascotasUpdated} onPublicacionesUpdated={handlePublicacionesUpdated} />
          )}
          {activeTab === 'guardados' && (
            <div className="text-center py-5 text-muted">
              Guardados próximamente
            </div>
          )}
        </div>
      </div>
    </>
  );
};
