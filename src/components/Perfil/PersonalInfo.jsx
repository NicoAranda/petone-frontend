import React, { useState } from 'react';

export const PersonalInfo = ({ userData }) => {

  const [formData, setFormData] = useState({
    nombreOrganizacion: '',
    tipoOrganizacion: '',
    correoInstitucional: '',
    telefono: '',
    direccion: '',
    sitioWeb: '',
    descripcion: '',
    motivo: '',
    acepta: false
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Aquí irá el axios hacia el BFF
  };


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
              <button
                className="text-center fw-semibold fs-5 profile-nav-link active p-2 border-0"
                data-bs-toggle="modal"
                data-bs-target="#modalOrganizacion"
              >
                Solicitar ser Organización
              </button>
            </div>
          </div>

          <div
            className="modal fade"
            id="modalOrganizacion"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Solicitud de Organización
                  </h5>

                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>

                </div>

                <form onSubmit={handleSubmit}>

                  <div className="modal-body">

                    <div className="mb-3">
                      <label className="form-label">
                        Nombre de la Organización
                      </label>

                      <input
                        className="form-control"
                        name="nombreOrganizacion"
                        value={formData.nombreOrganizacion}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Tipo de Organización
                      </label>

                      <select
                        className="form-select"
                        name="tipoOrganizacion"
                        value={formData.tipoOrganizacion}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione...</option>
                        <option>Clínica Veterinaria</option>
                        <option>Refugio</option>
                        <option>Municipalidad</option>
                        <option>Fundación</option>
                        <option>Otro</option>
                      </select>
                    </div>

                    <div className="row">

                      <div className="col-md-6 mb-3">

                        <label className="form-label">
                          Correo Institucional
                        </label>

                        <input
                          type="email"
                          className="form-control"
                          name="correoInstitucional"
                          value={formData.correoInstitucional}
                          onChange={handleChange}
                        />

                      </div>

                      <div className="col-md-6 mb-3">

                        <label className="form-label">
                          Teléfono
                        </label>

                        <input
                          className="form-control"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                        />

                      </div>

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        Dirección
                      </label>

                      <input
                        className="form-control"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        Sitio Web (opcional)
                      </label>

                      <input
                        className="form-control"
                        name="sitioWeb"
                        value={formData.sitioWeb}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        Descripción
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        Motivo de la solicitud
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="form-check">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="acepta"
                        checked={formData.acepta}
                        onChange={handleChange}
                        required
                      />

                      <label className="form-check-label">

                        Declaro que la información proporcionada es verdadera y autorizo su revisión por un administrador.

                      </label>

                    </div>

                  </div>

                  <div className="modal-footer">

                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn btn-success"
                      type="submit"
                    >
                      Enviar Solicitud
                    </button>

                  </div>

                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};