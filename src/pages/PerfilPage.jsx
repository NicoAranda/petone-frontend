import React, { useEffect, useState } from 'react'
import { API } from '../lib/api'

export const PerfilPage = () => {

  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("No hay sesión iniciada")
        }

        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userId = decodedPayload.id

        if (!userId) {
          throw new Error("No se pudo obtener el ID del usuario desde el token.")
        }

        const response = await fetch(`${API}/usuarios/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del perifl');
        }

        const data = await response.json();
        setUserData(data);


      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false)
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
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
      <div className='d-flex min-vh-100 justify-content-center align-items-center'>
        <section className="container-fluid p-0 overflow-hidden bg-white w-50 mx-auto shadow rounded-4">
          {/* Encabezado del Perfil (Foto + Nombre) */}
          <div className="container position-relative px-4 mt-5">
            <div className="d-flex flex-column flex-sm-row align-items-sm-end">

              {/* Avatar con Iniciales (Circular + Gradiente Verde) */}
              <div
                className="d-flex justify-content-center align-items-center rounded-circle border border-4 border-white text-white shadow"
                style={{
                  width: '150px',
                  height: '150px',
                  zIndex: 1,
                  fontSize: '4.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                }}
              >
                {userData?.nombre?.charAt(0).toUpperCase() || ''}
                {userData?.apellido?.charAt(0).toUpperCase() || ''}
              </div>

              <h1 className="ms-sm-4 mt-3 mt-sm-0 mb-sm-4 text-dark fw-bold fs-2 text-start text-capitalize">
                {userData?.nombre} {userData?.apellido}
              </h1>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="container px-4 mt-4 mb-5 pb-5">

            {/* Biografía */}
            <p className="text-secondary lead fs-6">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam debitis labore consectetur voluptatibus mollitia dolorem veniam omnis ut quibusdam minima sapiente repellendus asperiores explicabo, eligendi odit, dolore similique fugiat dolor, doloremque eveniet. Odit, consequatur. Ratione voluptate exercitationem hic eligendi vitae animi nam in, est earum culpa illum aliquam.
            </p>

            {/* Cuadrícula de Información (2 columnas en escritorio) */}
            <div className="row g-4 mt-2">
              {/* Columna Izquierda */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column border-bottom py-2">
                  <span className="text-muted small">Nombre</span>
                  <span className="fw-semibold fs-5">{userData?.nombre || 'No registrado'}</span>
                </div>
                <div className="d-flex flex-column border-bottom py-2">
                  <span className="text-muted small">Apellido</span>
                  <span className="fw-semibold fs-5">{userData?.apellido || 'No registrado'}</span>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column border-bottom py-2">
                  <span className="text-muted small">Email</span>
                  <span className="fw-semibold fs-5">{userData?.email || 'No registrado'}</span>
                </div>
                <div className="d-flex flex-column border-bottom py-2">
                  <span className="text-muted small">Número de Celular</span>
                  <span className="fw-semibold fs-5">{userData?.telefono || 'No registrado'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}