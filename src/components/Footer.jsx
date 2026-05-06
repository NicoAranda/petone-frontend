import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white text-dark mt-4 border-top" style={{ padding: '24px 12px', fontSize: '0.9rem' }}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 mb-3">
            <h5 className="fw-bold">Sobre Pet-One</h5>
            <p className="mb-1">Pet-One es una comunidad dedicada a ayudar a mascotas y a sus dueños: adopciones responsables, mascotas perdidas y encontradas, y servicios locales para su cuidado. Conectamos personas, refugios y servicios para promover el bienestar animal.</p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <p className="mb-0"><strong>Dirección:</strong> Av. Mascotas 456, Ciudad Verde</p>
              <p className="mb-0"><strong>Email:</strong> contacto@petone.example</p>
              <p className="mb-0"><strong>Tel:</strong> +56 9 8273 8372</p>
            </div>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <h5 className="fw-bold">Enlaces</h5>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-decoration-none">Inicio</Link></li>
              <li><Link to="/terms" className="text-decoration-none">Términos y Condiciones</Link></li>
              <li><Link to="/privacy" className="text-decoration-none">Política de Privacidad</Link></li>
              <li><a href="#" className="text-decoration-none">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row justify-content-between pt-3 mt-3 border-top">
          <small className="mb-2 mb-sm-0">© {new Date().getFullYear()} Pet-One. Todos los derechos reservados.</small>
          <small>
            <Link to="/terms" className="text-decoration-none me-2">Términos</Link>
            · <Link to="/privacy" className="text-decoration-none ms-2">Privacidad</Link>
          </small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
