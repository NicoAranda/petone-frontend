import React, { useState } from 'react'

export const RegisterForm = ({ onSwitchForm }) => {

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rut: '',
    telefono: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // CORRECCIÓN 1: formData bien escrito
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validar que ningún campo obligatorio esté compuesto solo por espacios
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim() ||
      !formData.rut.trim() ||
      !formData.telefono.trim()
    ) {
      setError('Por favor, completa todos los campos correctamente.');
      return;
    }

    // Validar formato de email con Regex
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un formato de correo válido (ej: usuario@correo.com).');
      return;
    }

    // Validar longitud de la contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar RUT (Acepta formato con o sin puntos, pero exige guion y dígito verificador)
    const rutRegex = /^[\d.]{7,10}-[\dkK]{1}$/i;
    if (!rutRegex.test(formData.rut)) {
      setError('Ingresa un RUT válido con guion (ej: 12.345.678-9 o 12345678-9).');
      return;
    }

    // Validar Teléfono (Acepta un '+' opcional al inicio, seguido de 8 a 15 números o espacios)
    const telefonoRegex = /^\+?[0-9\s]{8,15}$/;
    if (!telefonoRegex.test(formData.telefono)) {
      setError('Ingresa un número de teléfono válido (ej: +56912345678).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const api_url = 'http://localhost:8080/api/usuarios/registro-cliente';
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          rut: formData.rut,
          telefono: formData.telefono
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData) {
          // 1. Si Spring Boot manda errores de validación de campos (@Valid), suele venir en un arreglo 'errors'
          if (errorData.errors && Array.isArray(errorData.errors)) {
            throw new Error(errorData.errors[0].defaultMessage || "Verifica los datos ingresados.");
          }
          
          // 2. Si configuraste un mensaje personalizado en tu backend y no es el genérico de Spring
          if (errorData.message && !errorData.message.includes("Validation failed")) {
            throw new Error(errorData.message);
          }

          // 3. Si mandas un mapa (Map<String, String>) con errores, filtramos la basura de Spring Boot
          const clavesIgnoradas = ['timestamp', 'status', 'error', 'path', 'message'];
          const erroresReales = Object.entries(errorData).filter(([key]) => !clavesIgnoradas.includes(key));
          
          if (erroresReales.length > 0) {
             throw new Error(erroresReales[0][1]); // Mostramos el valor del primer error real
          }
        }

        // Fallback genérico si no se pudo extraer un mensaje claro
        throw new Error('El correo o el RUT ya están registrados.');
      }

      setSuccess(true);

      setTimeout(() => {
        onSwitchForm();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="vh-100 d-flex align-items-center justify-content-center p-3">
        <div
          className="card rounded-4 shadow-lg w-100 overflow-hidden border-0 fade-in-bckg"
          style={{ maxWidth: '1000px' }}
        >
          <div className="row g-0">
            <div className="col-md-6 d-none d-md-flex p-0 fondoRegister align-items-center justify-content-center">
              <p className="display-1 text-white text-center px-4">¡Sé parte de nuestra comunidad!</p>
            </div>

            <div className="col-md-6 p-4 p-md-5">
              <div className="text-center mb-5">
                <h1 className="fw-bold fs-2 text-dark">Regístrate</h1>
                <p className="text-muted">Ingresa tu información para registrarte</p>
              </div>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {success && (
                <div className="alert alert-success py-2 small">
                  ¡Registro exitoso! Redirigiendo al inicio de sesión...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="nombre" className="form-label small fw-semibold">Nombre</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted border-end-0">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                        placeholder="Ej: Juan"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="apellido" className="form-label small fw-semibold">Apellido</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted border-end-0">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        id="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                        placeholder="Ej: Pérez"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-semibold">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                      placeholder="juanperez@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="password" className="form-label small fw-semibold">Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted border-end-0">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                        placeholder="************"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="confirmPassword" className="form-label small fw-semibold">Confirmar Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted border-end-0">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                        placeholder="************"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="rut" className="form-label small fw-semibold">Rut</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-person-vcard"></i>
                    </span>
                    <input
                      type="text" // Cambiado de 'rut' a 'text', 'rut' no es un tipo de input HTML válido
                      id="rut"
                      value={formData.rut}
                      onChange={handleChange}
                      className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                      placeholder="12.345.678-9"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label small fw-semibold">Teléfono</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="text" // Cambiado de 'telefono' a 'text' o 'tel'
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
                      placeholder="+56 9"
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <span
                    className="text-center text-decoration-none"
                    style={{ cursor: 'pointer', maxWidth: '300px', color: 'blue' }}
                    onClick={onSwitchForm}
                  >
                    ¿Ya tienes cuenta? Inicia Sesión
                  </span>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2"
                    style={{ maxWidth: '300px', margin: '0 auto' }}
                    disabled={isLoading || success}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status">Registrando...</span>
                      </>
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}