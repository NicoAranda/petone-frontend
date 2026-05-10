import React from 'react'

export const PerfilPage = () => {
  return (
    <>
    <div className='d-flex min-vh-100 justify-content-center align-items-center'>
      <section className="container-fluid p-0 overflow-hidden bg-white w-50 mx-auto shadow rounded-4">
        {/* Encabezado del Perfil (Foto + Nombre) */}
        <div className="container position-relative px-4 mt-5">
          <div className="d-flex flex-column flex-sm-row align-items-sm-end">
            <img 
              src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080" 
              alt="User Profile"
              className="rounded-3 border border-4 border-primary bg-white shadow-sm"
              style={{ width: '150px', height: '150px', objectFit: 'cover', zIndex: 1 }} 
            />
            <h1 className="ms-sm-4 mt-3 mt-sm-0 mb-sm-4 text-dark fw-bold fs-2 text-start">
              Samuel Abera
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
                <span className="text-muted small">First Name</span>
                <span className="fw-semibold fs-5">Samuel</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Last Name</span>
                <span className="fw-semibold fs-5">Abera</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Date Of Birth</span>
                <span className="fw-semibold fs-5">14/05/1977</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Gender</span>
                <span className="fw-semibold fs-5">Male</span>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Location</span>
                <span className="fw-semibold fs-5">Ethiopia, Addis Ababa</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Phone Number</span>
                <span className="fw-semibold fs-5">+251913****30</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Email</span>
                <span className="fw-semibold fs-5">samuel@example.com</span>
              </div>
              <div className="d-flex flex-column border-bottom py-2">
                <span className="text-muted small">Website</span>
                <span className="fw-semibold fs-5">
                  <a href="https://techakim.com" className="text-decoration-none text-primary">https://www.teclick.com</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}