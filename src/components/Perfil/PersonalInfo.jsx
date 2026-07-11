import React, { useState } from 'react';
import { API } from '../../lib/api';

export const PersonalInfo = ({
  userData,
  organizationRequest,
  onRequestCreated
}) => {
  const initialFormData = {
    nombreOrganizacion: '',
    tipoOrganizacion: '',
    correoInstitucional: '',
    telefono: '',
    direccion: '',
    sitioWeb: '',
    descripcion: '',
    motivo: '',
    acepta: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');

  const requestStatus = organizationRequest?.estado?.toUpperCase();
  const userRole = userData?.rol?.toUpperCase();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openModal = () => {
    setMensaje('');
    setMensajeTipo('');
  };

  const getErrorMessage = async (response) => {
    try {
      const data = await response.json();

      return (
        data?.message ||
        data?.error ||
        data?.detail ||
        'No se pudo enviar la solicitud.'
      );
    } catch {
      try {
        const text = await response.text();
        return text || 'No se pudo enviar la solicitud.';
      } catch {
        return 'No se pudo enviar la solicitud.';
      }
    }
  };

  const closeBootstrapModal = () => {
    const modalElement = document.getElementById('modalOrganizacion');

    if (!modalElement) {
      return;
    }

    /*
     * Intenta cerrar el modal mediante Bootstrap.
     * Requiere bootstrap.bundle.min.js importado en main.jsx.
     */
    if (window.bootstrap?.Modal) {
      const modalInstance =
        window.bootstrap.Modal.getInstance(modalElement) ||
        window.bootstrap.Modal.getOrCreateInstance(modalElement);

      modalInstance.hide();
      return;
    }

    /*
     * Respaldo en caso de que Bootstrap no esté disponible
     * como propiedad global de window.
     */
    const closeButton = modalElement.querySelector(
      '[data-bs-dismiss="modal"]'
    );

    closeButton?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje('');
    setMensajeTipo('');

    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay una sesión iniciada.');
      }

      const tokenParts = token.split('.');

      if (tokenParts.length !== 3) {
        throw new Error('El token de sesión no es válido.');
      }

      const payloadBase64 = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const payload = JSON.parse(atob(payloadBase64));
      const usuarioId = payload.id;

      if (!usuarioId) {
        throw new Error(
          'No se pudo obtener el usuario desde la sesión.'
        );
      }

      if (!formData.acepta) {
        throw new Error(
          'Debes aceptar la declaración antes de enviar la solicitud.'
        );
      }

      const body = {
        nombreOrganizacion: formData.nombreOrganizacion.trim(),
        tipoOrganizacion: formData.tipoOrganizacion,
        correoInstitucional: formData.correoInstitucional.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        sitioWeb: formData.sitioWeb.trim(),
        descripcion: formData.descripcion.trim(),
        motivoSolicitud: formData.motivo.trim()
      };

      const response = await fetch(
        `${API}/solicitudes-organizacion?usuarioId=${usuarioId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      setMensaje('Solicitud enviada correctamente.');
      setMensajeTipo('success');
      setFormData(initialFormData);

      if (onRequestCreated) {
        await onRequestCreated();
      }

      setTimeout(() => {
        closeBootstrapModal();
      }, 500);
    } catch (err) {
      console.error('Error al enviar solicitud:', err);

      setMensaje(
        err.message || 'Ocurrió un error al enviar la solicitud.'
      );

      setMensajeTipo('danger');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = () => {
    const statusClasses = {
      PENDIENTE: 'bg-warning text-dark',
      APROBADA: 'bg-success',
      RECHAZADA: 'bg-danger'
    };

    return statusClasses[requestStatus] || 'bg-secondary';
  };

  const getStatusLabel = () => {
    const statusLabels = {
      PENDIENTE: 'Pendiente',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada'
    };

    return statusLabels[requestStatus] || requestStatus;
  };

  const formatDate = (date) => {
    if (!date) {
      return 'No registrada';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const canCreateRequest =
    userRole !== 'ORGANIZACION' &&
    (!organizationRequest || requestStatus === 'RECHAZADA');

  const renderOrganizationSection = () => {
    if (userRole === 'ORGANIZACION') {
      return (
        <div className="alert alert-success mb-0">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-patch-check-fill fs-4" />

            <div>
              <div className="fw-bold">
                Cuenta de organización
              </div>

              <small>
                Tu cuenta ya posee el rol ORGANIZACION.
              </small>
            </div>
          </div>
        </div>
      );
    }

    if (requestStatus === 'PENDIENTE') {
      return (
        <div className="alert alert-warning mb-0">
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-hourglass-split fs-4" />

            <div>
              <div className="fw-bold">
                Solicitud pendiente
              </div>

              <small>
                Tu solicitud está siendo revisada por un
                administrador.
              </small>

              <div className="mt-2 small">
                Enviada el{' '}
                {formatDate(organizationRequest.fechaSolicitud)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (requestStatus === 'APROBADA') {
      return (
        <div className="alert alert-success mb-0">
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-check-circle-fill fs-4" />

            <div>
              <div className="fw-bold">
                Solicitud aprobada
              </div>

              <small>
                Tu solicitud fue aprobada. Cierra sesión y vuelve
                a iniciar para actualizar el rol almacenado en el
                token.
              </small>

              {organizationRequest.respuestaAdministrador && (
                <div className="mt-2">
                  <strong>Respuesta:</strong>{' '}
                  {organizationRequest.respuestaAdministrador}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (requestStatus === 'RECHAZADA') {
      return (
        <div>
          <div className="alert alert-danger">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-x-circle-fill fs-4" />

              <div>
                <div className="fw-bold">
                  Solicitud rechazada
                </div>

                {organizationRequest.respuestaAdministrador ? (
                  <div className="mt-1">
                    <strong>Motivo:</strong>{' '}
                    {organizationRequest.respuestaAdministrador}
                  </div>
                ) : (
                  <small>
                    La solicitud fue rechazada sin una respuesta
                    adicional.
                  </small>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="text-center fw-semibold fs-5 profile-nav-link active p-2 border-0 w-100"
            data-bs-toggle="modal"
            data-bs-target="#modalOrganizacion"
            onClick={openModal}
          >
            Volver a solicitar
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="text-center fw-semibold fs-5 profile-nav-link active p-2 border-0 w-100"
        data-bs-toggle="modal"
        data-bs-target="#modalOrganizacion"
        onClick={openModal}
      >
        Solicitar ser Organización
      </button>
    );
  };

  return (
    <>
      {/* Encabezado del perfil */}
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
              background:
                'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            }}
          >
            {userData?.nombre?.charAt(0)?.toUpperCase() || ''}
            {userData?.apellido?.charAt(0)?.toUpperCase() || ''}
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
              <span className="text-muted small">
                Nombre
              </span>

              <span className="fw-semibold fs-5">
                {userData?.nombre || 'No registrado'}
              </span>
            </div>

            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">
                Apellido
              </span>

              <span className="fw-semibold fs-5">
                {userData?.apellido || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">
                Email
              </span>

              <span className="fw-semibold fs-5">
                {userData?.email || 'No registrado'}
              </span>
            </div>

            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">
                Número de celular
              </span>

              <span className="fw-semibold fs-5">
                {userData?.telefono || 'No registrado'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column border-bottom py-2">
              <span className="text-muted small">
                Rol
              </span>

              <span className="fw-semibold fs-5">
                {userData?.rol || 'No registrado'}
              </span>
            </div>
          </div>

          {organizationRequest && (
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">
                  Estado de solicitud
                </span>

                <div className="mt-1">
                  <span
                    className={`badge ${getStatusBadgeClass()}`}
                  >
                    {getStatusLabel()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="col-12 mt-3">
            {renderOrganizationSection()}
          </div>
        </div>
      </div>

      {/* Modal para crear la solicitud */}
      {canCreateRequest && (
        <div
          className="modal fade"
          id="modalOrganizacion"
          tabIndex="-1"
          aria-labelledby="modalOrganizacionLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="modalOrganizacionLabel"
                >
                  Solicitud de Organización
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                  disabled={loading}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="nombreOrganizacion"
                      className="form-label"
                    >
                      Nombre de la organización
                    </label>

                    <input
                      id="nombreOrganizacion"
                      className="form-control"
                      name="nombreOrganizacion"
                      value={formData.nombreOrganizacion}
                      onChange={handleChange}
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="tipoOrganizacion"
                      className="form-label"
                    >
                      Tipo de organización
                    </label>

                    <select
                      id="tipoOrganizacion"
                      className="form-select"
                      name="tipoOrganizacion"
                      value={formData.tipoOrganizacion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Seleccione...
                      </option>

                      <option value="VETERINARIA">
                        Clínica Veterinaria
                      </option>

                      <option value="REFUGIO">
                        Refugio
                      </option>

                      <option value="MUNICIPALIDAD">
                        Municipalidad
                      </option>

                      <option value="FUNDACION">
                        Fundación
                      </option>

                      <option value="OTRO">
                        Otro
                      </option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="correoInstitucional"
                        className="form-label"
                      >
                        Correo institucional
                      </label>

                      <input
                        id="correoInstitucional"
                        type="email"
                        className="form-control"
                        name="correoInstitucional"
                        value={formData.correoInstitucional}
                        onChange={handleChange}
                        maxLength={150}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="telefonoOrganizacion"
                        className="form-label"
                      >
                        Teléfono
                      </label>

                      <input
                        id="telefonoOrganizacion"
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        maxLength={30}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="direccionOrganizacion"
                      className="form-label"
                    >
                      Dirección
                    </label>

                    <input
                      id="direccionOrganizacion"
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      maxLength={250}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="sitioWeb"
                      className="form-label"
                    >
                      Sitio web (opcional)
                    </label>

                    <input
                      id="sitioWeb"
                      type="url"
                      className="form-control"
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleChange}
                      placeholder="https://ejemplo.cl"
                      maxLength={250}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="descripcionOrganizacion"
                      className="form-label"
                    >
                      Descripción
                    </label>

                    <textarea
                      id="descripcionOrganizacion"
                      className="form-control"
                      rows={3}
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="motivoSolicitud"
                      className="form-label"
                    >
                      Motivo de la solicitud
                    </label>

                    <textarea
                      id="motivoSolicitud"
                      className="form-control"
                      rows={3}
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="form-check">
                    <input
                      id="aceptaDeclaracion"
                      className="form-check-input"
                      type="checkbox"
                      name="acepta"
                      checked={formData.acepta}
                      onChange={handleChange}
                      required
                    />

                    <label
                      className="form-check-label"
                      htmlFor="aceptaDeclaracion"
                    >
                      Declaro que la información proporcionada es
                      verdadera y autorizo su revisión por un
                      administrador.
                    </label>
                  </div>

                  {mensaje && (
                    <div
                      className={`alert alert-${mensajeTipo} mt-3 mb-0`}
                      role="alert"
                    >
                      {mensaje}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Enviando...
                      </>
                    ) : (
                      'Enviar solicitud'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};