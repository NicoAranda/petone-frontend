import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import { API } from '../lib/api';
import { PersonalInfo } from '../components/Perfil/PersonalInfo';
import { PublicationPerfilView } from '../components/Perfil/PublicationPerfilView';
import { PetPerfilView } from '../components/Perfil/PetPerfilView';
import '../components/Perfil/Perfil.css';

export const PerfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [organizationRequest, setOrganizationRequest] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState({
    publicaciones: false,
    mascotas: false,
    organizationRequest: false
  });

  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] =
    useState('publicaciones');

  const getSessionData = useCallback(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error(
        'No hay una sesión iniciada.'
      );
    }

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      throw new Error(
        'El token de sesión no es válido.'
      );
    }

    try {
      const payloadBase64 = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decodedPayload = JSON.parse(
        atob(payloadBase64)
      );

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
    } catch (sessionError) {
      console.error(
        'Error al decodificar el token:',
        sessionError
      );

      throw new Error(
        'No se pudo leer la información de la sesión.'
      );
    }
  }, []);

  const getErrorMessage = async (
    response,
    defaultMessage
  ) => {
    try {
      const data = await response.json();

      return (
        data?.message ||
        data?.error ||
        data?.detail ||
        defaultMessage
      );
    } catch {
      try {
        const text = await response.text();

        return text || defaultMessage;
      } catch {
        return defaultMessage;
      }
    }
  };

  const loadUserData = useCallback(async () => {
    const { token, userId } =
      getSessionData();

    const response = await fetch(
      `${API}/usuarios/${userId}`,
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
        'Error al obtener los datos del perfil.'
      );

      throw new Error(message);
    }

    const data = await response.json();
    setUserData(data);
  }, [getSessionData]);

  const loadPublicaciones = useCallback(async () => {
    const { token, userId } =
      getSessionData();

    setSectionLoading((previous) => ({
      ...previous,
      publicaciones: true
    }));

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

      setPublicaciones(
        Array.isArray(data) ? data : []
      );
    } catch (loadError) {
      console.error(
        'Error al cargar publicaciones:',
        loadError
      );

      setPublicaciones([]);
      throw loadError;
    } finally {
      setSectionLoading((previous) => ({
        ...previous,
        publicaciones: false
      }));
    }
  }, [getSessionData]);

  const loadMascotas = useCallback(async () => {
    const { token, userId } =
      getSessionData();

    setSectionLoading((previous) => ({
      ...previous,
      mascotas: true
    }));

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

      setMascotas(
        Array.isArray(data) ? data : []
      );
    } catch (loadError) {
      console.error(
        'Error al cargar mascotas:',
        loadError
      );

      setMascotas([]);
      throw loadError;
    } finally {
      setSectionLoading((previous) => ({
        ...previous,
        mascotas: false
      }));
    }
  }, [getSessionData]);

  const loadOrganizationRequests =
    useCallback(async () => {
      const { token, userId } =
        getSessionData();

      setSectionLoading((previous) => ({
        ...previous,
        organizationRequest: true
      }));

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

        const requests = Array.isArray(data)
          ? data
          : [];

        const sortedRequests = [...requests].sort(
          (a, b) => {
            const dateA = a.fechaSolicitud
              ? new Date(
                a.fechaSolicitud
              ).getTime()
              : 0;

            const dateB = b.fechaSolicitud
              ? new Date(
                b.fechaSolicitud
              ).getTime()
              : 0;

            if (dateA !== dateB) {
              return dateB - dateA;
            }

            return (
              (b.id ?? 0) - (a.id ?? 0)
            );
          }
        );

        setOrganizationRequest(
          sortedRequests[0] || null
        );
      } catch (loadError) {
        console.error(
          'Error al cargar solicitudes de organización:',
          loadError
        );

        setOrganizationRequest(null);
      } finally {
        setSectionLoading((previous) => ({
          ...previous,
          organizationRequest: false
        }));
      }
    }, [getSessionData]);

  const handleMascotasUpdated = async () => {
    try {
      await loadMascotas();
    } catch (updateError) {
      console.error(
        'Error al actualizar mascotas:',
        updateError
      );
    }
  };

  const handlePublicacionesUpdated =
    async () => {
      try {
        await loadPublicaciones();
      } catch (updateError) {
        console.error(
          'Error al actualizar publicaciones:',
          updateError
        );
      }
    };

  const handleOrganizationRequestCreated =
    async () => {
      await loadOrganizationRequests();
    };

  const retryLoadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loadUserData();

      await Promise.allSettled([
        loadPublicaciones(),
        loadMascotas(),
        loadOrganizationRequests()
      ]);
    } catch (retryError) {
      setError(
        retryError.message ||
        'No se pudo cargar el perfil.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retryLoadProfile();
  }, [
    loadUserData,
    loadPublicaciones,
    loadMascotas,
    loadOrganizationRequests
  ]);

  const renderTabContent = () => {
    if (
      activeTab === 'publicaciones'
    ) {
      if (
        sectionLoading.publicaciones &&
        publicaciones.length === 0
      ) {
        return (
          <div className="profile-section-loading">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            />

            <span>
              Cargando publicaciones...
            </span>
          </div>
        );
      }

      return (
        <PublicationPerfilView
          publicaciones={publicaciones}
        />
      );
    }

    if (activeTab === 'mascotas') {
      if (
        sectionLoading.mascotas &&
        mascotas.length === 0
      ) {
        return (
          <div className="profile-section-loading">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            />

            <span>
              Cargando mascotas...
            </span>
          </div>
        );
      }

      return (
        <PetPerfilView
          mascotas={mascotas}
          onMascotasUpdated={
            handleMascotasUpdated
          }
          onPublicacionesUpdated={
            handlePublicacionesUpdated
          }
        />
      );
    }

    return (
      <div className="profile-empty-state text-center py-5 px-3">
        <div className="profile-empty-icon mx-auto mb-3">
          <i className="bi bi-bookmark" />
        </div>

        <h3 className="h6 fw-bold mb-2">
          Guardados
        </h3>

        <p className="text-muted mb-0">
          Esta sección estará disponible
          próximamente.
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <main className="profile-page profile-page-state">
        <div className="profile-loading-card">
          <div
            className="spinner-border text-success"
            role="status"
          >
            <span className="visually-hidden">
              Cargando perfil...
            </span>
          </div>

          <h1 className="h5 fw-bold mt-3 mb-1">
            Cargando perfil
          </h1>

          <p className="text-muted mb-0">
            Estamos preparando tu información.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page profile-page-state">
        <div className="profile-error-card">
          <div className="profile-empty-icon mx-auto mb-3">
            <i className="bi bi-exclamation-triangle" />
          </div>

          <h1 className="h5 fw-bold mb-2">
            No se pudo cargar el perfil
          </h1>

          <p className="text-muted mb-4">
            {error}
          </p>

          <button
            type="button"
            className="btn btn-success rounded-pill px-4"
            onClick={retryLoadProfile}
          >
            <i className="bi bi-arrow-clockwise me-2" />
            Intentar nuevamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container-fluid px-2 px-sm-3 px-lg-4">
        <div className="profile-page-container mx-auto">
          <section className="profile-header-section">
            <PersonalInfo
              userData={userData}
              organizationRequest={
                organizationRequest
              }
              onRequestCreated={
                handleOrganizationRequestCreated
              }
            />
          </section>

          <section className="profile-content-section mt-4">
            <nav
              className="profile-tabs-container"
              aria-label="Secciones del perfil"
            >
              <div
                className="nav nav-pills nav-fill profile-tabs"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={
                    activeTab ===
                    'publicaciones'
                  }
                  className={`nav-link profile-nav-link ${activeTab ===
                      'publicaciones'
                      ? 'active'
                      : ''
                    }`}
                  onClick={() =>
                    setActiveTab(
                      'publicaciones'
                    )
                  }
                >
                  <i className="bi bi-grid-3x3-gap me-1 me-sm-2" />

                  <span className="d-none d-sm-inline">
                    Publicaciones
                  </span>

                  <span className="d-sm-none">
                    Posts
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={
                    activeTab === 'mascotas'
                  }
                  className={`nav-link profile-nav-link ${activeTab === 'mascotas'
                      ? 'active'
                      : ''
                    }`}
                  onClick={() =>
                    setActiveTab('mascotas')
                  }
                >
                  <i className="bi bi-heart me-1 me-sm-2" />

                  <span>Mascotas</span>

                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={
                    activeTab === 'guardados'
                  }
                  className={`nav-link profile-nav-link ${activeTab === 'guardados'
                      ? 'active'
                      : ''
                    }`}
                  onClick={() =>
                    setActiveTab('guardados')
                  }
                >
                  <i className="bi bi-bookmark me-1 me-sm-2" />

                  <span>Guardados</span>
                </button>
              </div>
            </nav>

            <div className="profile-tab-content mt-3">
              {renderTabContent()}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};