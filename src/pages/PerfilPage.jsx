import React, { useCallback, useEffect, useState } from 'react';
import { API } from '../lib/api';
import { PersonalInfo } from '../components/Perfil/PersonalInfo';
import { PublicationPerfilView } from '../components/Perfil/PublicationPerfilView';
import { PetPerfilView } from '../components/Perfil/PetPerfilView';
import '../components/Perfil/Perfil.css';

export const PerfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [organizationRequest, setOrganizationRequest] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');

  const getSessionData = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No hay una sesión iniciada.');
    }

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      throw new Error('El token de sesión no es válido.');
    }

    try {
      const payloadBase64 = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId = decodedPayload.id;

      if (!userId) {
        throw new Error(
          'No se pudo obtener el ID del usuario desde el token.'
        );
      }

      return {
        token,
        userId
      };
    } catch (err) {
      console.error('Error al decodificar el token:', err);

      throw new Error('No se pudo leer la información de la sesión.');
    }
  };

  const getErrorMessage = async (response, defaultMessage) => {
    try {
      const data = await response.json();

      return (
        data?.message ||
        data?.error ||
        data?.detail ||
        defaultMessage
      );
    } catch {
      return defaultMessage;
    }
  };

  const loadUserData = useCallback(async () => {
    const { token, userId } = getSessionData();

    const userResponse = await fetch(`${API}/usuarios/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      const message = await getErrorMessage(
        userResponse,
        'Error al obtener los datos del perfil.'
      );

      throw new Error(message);
    }

    const data = await userResponse.json();
    setUserData(data);
  }, []);

  const loadPublicaciones = useCallback(async () => {
    const { token, userId } = getSessionData();

    try {
      const response = await fetch(
        `${API}/publicaciones/usuario/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          'Error al obtener las publicaciones.'
        );

        throw new Error(message);
      }

      const data = await response.json();
      setPublicaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setPublicaciones([]);

      throw err;
    }
  }, []);

  const loadMascotas = useCallback(async () => {
    const { token, userId } = getSessionData();

    try {
      const response = await fetch(
        `${API}/mascotas/usuario/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          'Error al obtener las mascotas.'
        );

        throw new Error(message);
      }

      const data = await response.json();
      setMascotas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar mascotas:', err);
      setMascotas([]);

      throw err;
    }
  }, []);

  const loadOrganizationRequests = useCallback(async () => {
    const { token, userId } = getSessionData();

    try {
      const response = await fetch(
        `${API}/solicitudes-organizacion/usuario/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          'Error al obtener las solicitudes de organización.'
        );

        throw new Error(message);
      }

      const data = await response.json();
      const requests = Array.isArray(data) ? data : [];

      /*
       * Se ordenan de la más reciente a la más antigua.
       * Si fechaSolicitud no está disponible, se usa el ID.
       */
      const sortedRequests = [...requests].sort((a, b) => {
        const dateA = a.fechaSolicitud
          ? new Date(a.fechaSolicitud).getTime()
          : 0;

        const dateB = b.fechaSolicitud
          ? new Date(b.fechaSolicitud).getTime()
          : 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return (b.id ?? 0) - (a.id ?? 0);
      });

      setOrganizationRequest(sortedRequests[0] || null);
    } catch (err) {
      console.error(
        'Error al cargar solicitudes de organización:',
        err
      );

      setOrganizationRequest(null);

      /*
       * No se lanza el error para evitar que todo el perfil deje
       * de mostrarse si solamente falla esta funcionalidad.
       */
    }
  }, []);

  const handleMascotasUpdated = async () => {
    try {
      await loadMascotas();
    } catch (err) {
      console.error('Error al actualizar mascotas:', err);
    }
  };

  const handlePublicacionesUpdated = async () => {
    try {
      await loadPublicaciones();
    } catch (err) {
      console.error('Error al actualizar publicaciones:', err);
    }
  };

  const handleOrganizationRequestCreated = async () => {
    await loadOrganizationRequests();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        /*
         * Primero cargamos al usuario porque es el dato esencial
         * para mostrar el perfil.
         */
        await loadUserData();

        /*
         * Estos datos se cargan en paralelo para reducir el tiempo
         * total de espera.
         */
        const results = await Promise.allSettled([
          loadPublicaciones(),
          loadMascotas(),
          loadOrganizationRequests()
        ]);

        results.forEach((result) => {
          if (result.status === 'rejected') {
            console.error(
              'Error cargando una sección del perfil:',
              result.reason
            );
          }
        });
      } catch (err) {
        console.error('Error al cargar el perfil:', err);

        setError(
          err.message ||
          'Ocurrió un error al cargar los datos del perfil.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    loadUserData,
    loadPublicaciones,
    loadMascotas,
    loadOrganizationRequests
  ]);

  if (isLoading) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{
            width: '3rem',
            height: '3rem'
          }}
        >
          <span className="visually-hidden">
            Cargando perfil...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div
          className="alert alert-danger shadow rounded-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <section className="container-fluid p-0 overflow-hidden bg-white w-50 mx-auto shadow rounded-4">
          <PersonalInfo
            userData={userData}
            organizationRequest={organizationRequest}
            onRequestCreated={handleOrganizationRequestCreated}
          />
        </section>
      </div>

      <div className="container mt-4">
        <nav className="bg-white shadow-sm rounded-4 border">
          <ul className="nav nav-pills nav-fill p-2">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link profile-nav-link ${activeTab === 'publicaciones' ? 'active' : ''
                  }`}
                onClick={() => setActiveTab('publicaciones')}
              >
                Publicaciones
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link profile-nav-link ${activeTab === 'mascotas' ? 'active' : ''
                  }`}
                onClick={() => setActiveTab('mascotas')}
              >
                Mascotas
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link profile-nav-link ${activeTab === 'guardados' ? 'active' : ''
                  }`}
                onClick={() => setActiveTab('guardados')}
              >
                Guardados
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-3">
          {activeTab === 'publicaciones' && (
            <PublicationPerfilView
              publicaciones={publicaciones}
            />
          )}

          {activeTab === 'mascotas' && (
            <PetPerfilView
              mascotas={mascotas}
              onMascotasUpdated={handleMascotasUpdated}
              onPublicacionesUpdated={handlePublicacionesUpdated}
            />
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