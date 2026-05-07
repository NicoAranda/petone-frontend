import React from 'react'
import imagen from '../assets/images/aboutus-image.jpg'

export const AboutUs = () => {
	return (
		<>
			<section class="d-flex align-items-center vh-100" id='about-us'>
				<div class="container">
					<div class="row align-items-center gx-4">
						<div class="col-md-5">
							<div class="ms-md-2 ms-lg-5"><img class="img-fluid rounded-3" src={imagen} /></div>
						</div>
						<div class="col-md-6 offset-md-1">
							<div class="ms-md-2 ms-lg-5">
								<h2 class="display-5 fw-bold">Sobre <span className='text-primary'>Nosotros</span></h2>
								<p class="lead">Somos una comunidad que está preocupada por todas las mascotas perdidas actualmente.</p>
								<p class="lead">En este sitio puedes reportar a tu mascota perdida y toda la comunidad estará pendiente al rescate de esta.</p>
								<p class="lead">Ademas puedes contactarte con otros dueños por si encontraste o tienes información de alguna mascota que tenga similitudes con su mascota perdida.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
