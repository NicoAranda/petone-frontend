import React, { useState } from 'react';
import { API } from '../../lib/api';
import './Perfil.css';

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

  const [formData, setFormData] =
    useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] =
    useState('');

  const requestStatus =
    organizationRequest?.estado?.toUpperCase();

  const userRole =
    userData?.rol?.toUpperCase();

  const initials = `${userData?.nombre?.charAt(0) || ''}${userData?.apellido?.charAt(0) || ''
    }`.toUpperCase();

  const handleChange = (event) => {
    const {
      name,
      value,
      checked,
      type
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox' ? checked : value
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
      return 'No se pudo enviar la solicitud.';
    }
  };

  const closeBootstrapModal = () => {
    const modalElement =
      document.getElementById(
        'modalOrganizacion'
      );

    if (!modalElement) {
      return;
    }

    if (window.bootstrap?.Modal) {
      const modalInstance =
        window.bootstrap.Modal.getInstance(
          modalElement
        ) ||
        window.bootstrap.Modal.getOrCreateInstance(
          modalElement
        );

      modalInstance.hide();
      return;
    }

    modalElement
      .querySelector(
        '[data-bs-dismiss="modal"]'
      )
      ?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje('');
    setMensajeTipo('');
    setLoading(true);

    try {
      const token =
        localStorage.getItem('token');

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

      const payloadBase64 = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const payload = JSON.parse(
        atob(payloadBase64)
      );

      const usuarioId = payload.id;

      if (!usuarioId) {
        throw new Error(
          'No se pudo obtener el usuario desde la sesión.'
        );
      }

      const body = {
        nombreOrganizacion:
          formData.nombreOrganizacion.trim(),
        tipoOrganizacion:
          formData.tipoOrganizacion,
        correoInstitucional:
          formData.correoInstitucional.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        sitioWeb: formData.sitioWeb.trim(),
        descripcion:
          formData.descripcion.trim(),
        motivoSolicitud:
          formData.motivo.trim()
      };

      const response = await fetch(
        `${API}/solicitudes-organizacion?usuarioId=${usuarioId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response)
        );
      }

      setMensaje(
        'Solicitud enviada correctamente.'
      );
      setMensajeTipo('success');
      setFormData(initialFormData);

      if (onRequestCreated) {
        await onRequestCreated();
      }

      window.setTimeout(
        closeBootstrapModal,
        600
      );
    } catch (error) {
      console.error(
        'Error al enviar solicitud:',
        error
      );

      setMensaje(
        error.message ||
        'Ocurrió un error al enviar la solicitud.'
      );

      setMensajeTipo('danger');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = () => {
    const classes = {
      PENDIENTE: 'bg-warning text-dark',
      APROBADA: 'bg-success',
      RECHAZADA: 'bg-danger'
    };

    return (
      classes[requestStatus] ||
      'bg-secondary'
    );
  };

  const getStatusLabel = () => {
    const labels = {
      PENDIENTE: 'Pendiente',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada'
    };

    return (
      labels[requestStatus] ||
      requestStatus ||
      'Sin estado'
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return 'No registrada';
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'es-CL'
    );
  };

  /*
   * Solo CLIENTE puede solicitar el rol.
   * ADMIN y ORGANIZACION no deben ver el botón.
   */
  const canCreateRequest =
    userRole === 'CLIENTE' &&
    (!organizationRequest ||
      requestStatus === 'RECHAZADA');

  const renderOrganizationSection = () => {
    if (userRole === 'ADMIN') {
      return null;
    }

    if (userRole === 'ORGANIZACION') {
      return (
        <div className="profile-status-card profile-status-success">
          <i className="bi bi-patch-check-fill" />

          <div>
            <strong>
              Cuenta de organización
            </strong>

            <small>
              Tu cuenta está verificada como
              organización.
            </small>
          </div>
        </div>
      );
    }

    if (requestStatus === 'PENDIENTE') {
      return (
        <div className="profile-status-card profile-status-warning">
          <i className="bi bi-hourglass-split" />

          <div>
            <strong>
              Solicitud pendiente
            </strong>

            <small>
              Enviada el{' '}
              {formatDate(
                organizationRequest.fechaSolicitud
              )}
              . Un administrador debe revisarla.
            </small>
          </div>
        </div>
      );
    }

    if (requestStatus === 'APROBADA') {
      return (
        <div className="profile-status-card profile-status-success">
          <i className="bi bi-check-circle-fill" />

          <div>
            <strong>
              Solicitud aprobada
            </strong>

            <small>
              Tu solicitud fue aprobada.
            </small>

            {organizationRequest.respuestaAdministrador && (
              <p className="small mb-0 mt-2">
                {
                  organizationRequest.respuestaAdministrador
                }
              </p>
            )}
          </div>
        </div>
      );
    }

    if (requestStatus === 'RECHAZADA') {
      return (
        <div className="d-flex flex-column gap-3">
          <div className="profile-status-card profile-status-danger">
            <i className="bi bi-x-circle-fill" />

            <div>
              <strong>
                Solicitud rechazada
              </strong>

              <small>
                {organizationRequest.respuestaAdministrador ||
                  'No se indicó un motivo.'}
              </small>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success rounded-pill fw-semibold"
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
        className="btn btn-success rounded-pill fw-semibold profile-organization-button"
        data-bs-toggle="modal"
        data-bs-target="#modalOrganizacion"
        onClick={openModal}
      >
        <i className="bi bi-buildings me-2" />
        Solicitar ser organización
      </button>
    );
  };

  return (
    <>
      <div className="profile-info-card">
        <div className="profile-cover" />

        <div className="profile-main-content">
          <div className="profile-identity">
            <div className="profile-avatar">
              {initials || 'U'}
            </div>

            <div className="profile-name-container">
              <h1 className="profile-name">
                {userData?.nombre ||
                  'Usuario'}{' '}
                {userData?.apellido || ''}
              </h1>

              <span
                className={`badge rounded-pill ${userRole === 'ADMIN'
                    ? 'bg-danger'
                    : userRole ===
                      'ORGANIZACION'
                      ? 'bg-primary'
                      : 'bg-success'
                  }`}
              >
                {userRole || 'SIN ROL'}
              </span>
            </div>
          </div>

          <p className="profile-description">
            Este usuario no tiene descripción...
          </p>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <i className="bi bi-person" />
              </div>

              <div>
                <span>Nombre</span>
                <strong>
                  {userData?.nombre ||
                    'No registrado'}
                </strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <i className="bi bi-person" />
              </div>

              <div>
                <span>Apellido</span>
                <strong>
                  {userData?.apellido ||
                    'No registrado'}
                </strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <i className="bi bi-envelope" />
              </div>

              <div>
                <span>Correo</span>
                <strong>
                  {userData?.email ||
                    'No registrado'}
                </strong>
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-icon">
                <i className="bi bi-phone" />
              </div>

              <div>
                <span>Teléfono</span>
                <strong>
                  {userData?.telefono ||
                    'No registrado'}
                </strong>
              </div>
            </div>
          </div>

          {organizationRequest && (
            <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-4">
              <span className="small text-muted">
                Estado de solicitud
              </span>

              <span
                className={`badge ${getStatusBadgeClass()}`}
              >
                {getStatusLabel()}
              </span>
            </div>
          )}

          {(userRole === 'CLIENTE' ||
            userRole === 'ORGANIZACION') && (
              <div className="mt-4">
                {renderOrganizationSection()}
              </div>
            )}
        </div>
      </div>

      {canCreateRequest && (
        <div
          className="modal fade"
          id="modalOrganizacion"
          tabIndex="-1"
          aria-labelledby="modalOrganizacionLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header">
                <div>
                  <h5
                    className="modal-title fw-bold"
                    id="modalOrganizacionLabel"
                  >
                    Solicitud de organización
                  </h5>

                  <small className="text-muted">
                    Completa los datos para solicitar la
                    verificación.
                  </small>
                </div>

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
                  <div className="row">
                    <div className="col-12 col-md-7 mb-3">
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
                        value={
                          formData.nombreOrganizacion
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-5 mb-3">
                      <label
                        htmlFor="tipoOrganizacion"
                        className="form-label"
                      >
                        Tipo
                      </label>

                      <select
                        id="tipoOrganizacion"
                        className="form-select"
                        name="tipoOrganizacion"
                        value={
                          formData.tipoOrganizacion
                        }
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Seleccione...
                        </option>
                        <option value="VETERINARIA">
                          Clínica veterinaria
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
                  </div>

                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
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
                        value={
                          formData.correoInstitucional
                        }
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-3">
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
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="sitioWeb"
                      className="form-label"
                    >
                      Sitio web
                    </label>

                    <input
                      id="sitioWeb"
                      type="url"
                      className="form-control"
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleChange}
                      placeholder="https://ejemplo.cl"
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
                      Declaro que la información proporcionada
                      es verdadera.
                    </label>
                  </div>

                  {mensaje && (
                    <div
                      className={`alert alert-${mensajeTipo} mt-3 mb-0`}
                    >
                      {mensaje}
                    </div>
                  )}
                </div>

                <div className="modal-footer flex-column-reverse flex-sm-row">
                  <button
                    type="button"
                    className="btn btn-secondary w-100 w-sm-auto"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success w-100 w-sm-auto"
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