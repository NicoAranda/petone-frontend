import React from 'react';

export const PersonalInfo = ({ userData }) => {
  return (
    <>
      {/* Encabezado del Perfil */}
      <div className="container position-relative px-4 mt-5">
        <div className="d-flex flex-column flex-sm-row align-items-sm-end">

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

        <p className="text-secondary lead fs-6">
          Este usuario no tiene descripción...
        </p>

        <div className="row g-4 mt-2">

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">Nombre</span>
              <span className="fw-semibold fs-5">
                {userData?.nombre || 'No registrado'}
              </span>
            </div>

            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">Apellido</span>
              <span className="fw-semibold fs-5">
                {userData?.apellido || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">Email</span>
              <span className="fw-semibold fs-5">
                {userData?.email || 'No registrado'}
              </span>
            </div>

            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">Número de Celular</span>
              <span className="fw-semibold fs-5">
                {userData?.telefono || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">Rol</span>
              <span className="fw-semibold fs-5">
                {userData?.rol || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-5">
            <div className="d-flex flex-column py-2">
              <button className="text-center fw-semibold fs-5 profile-nav-link active p-2 border-0">
                Solicitud de Organización
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};