import React from 'react'
import imagen from '../assets/images/aboutus-image.jpg'

export const AboutUs = () => {
	return (
		<>
			<section className="d-flex align-items-center vh-100" id='about-us'>
				<div className="container">
					<div className="row align-items-center gx-4">
						<div className="col-md-5">
							<div className="ms-md-2 ms-lg-5"><img className="img-fluid rounded-3" src={imagen} /></div>
						</div>
						<div className="col-md-6 offset-md-1">
							<div className="ms-md-2 ms-lg-5">
								<h2 className="display-5 fw-bold">Sobre <span className='text-primary'>Nosotros</span></h2>
								<p className="lead">Somos una comunidad que está preocupada por todas las mascotas perdidas actualmente.</p>
								<p className="lead">En este sitio puedes reportar a tu mascota perdida y toda la comunidad estará pendiente al rescate de esta.</p>
								<p className="lead">Ademas puedes contactarte con otros dueños por si encontraste o tienes información de alguna mascota que tenga similitudes con su mascota perdida.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
