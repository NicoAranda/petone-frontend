import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white text-dark mt-4 border-top" style={{ padding: '32px 12px' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Sobre Pet-One</h5>
            <p className="mb-1">Pet-One es una comunidad dedicada a ayudar a mascotas y a sus dueños: adopciones responsables, mascotas perdidas y encontradas, y servicios locales para su cuidado.</p>
            <p className="mb-1"><strong>Dirección:</strong> Av. Mascotas 456, Ciudad Verde</p>
            <p className="mb-1"><strong>Email:</strong> contacto@petone.example</p>
            <p className="mb-0"><strong>Tel:</strong> +54 9 11 1234 5678</p>
          </div>

          <div className="col-md-3 mb-3">
            <h5 className="fw-bold">Enlaces</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none">Inicio</Link></li>
              <li><Link to="/terms" className="text-decoration-none">Términos y Condiciones</Link></li>
              <li><a href="#" className="text-decoration-none">Política de Privacidad</a></li>
              <li><a href="#" className="text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          <div className="col-md-5 mb-3">
            <h5 className="fw-bold">Suscríbete</h5>
            <p className="mb-2">Recibe novedades sobre adopciones, eventos y consejos de cuidado para tus mascotas.</p>
            <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
              <input type="email" className="form-control" placeholder="tu@correo.com" style={{ maxWidth: '320px' }} />
              <button className="btn btn-success">Suscribir</button>
            </form>

            <div className="mt-3">
              <a href="#" className="me-3 text-dark"><i className="bi bi-facebook fs-4"></i></a>
              <a href="#" className="me-3 text-dark"><i className="bi bi-instagram fs-4"></i></a>
              <a href="#" className="me-3 text-dark"><i className="bi bi-twitter fs-4"></i></a>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between pt-3 mt-3 border-top">
          <small>© {new Date().getFullYear()} Pet-One. Todos los derechos reservados.</small>
          <small>
            <Link to="/terms" className="text-decoration-none me-2">Términos</Link>
            · <a href="#" className="text-decoration-none ms-2">Privacidad</a>
          </small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
