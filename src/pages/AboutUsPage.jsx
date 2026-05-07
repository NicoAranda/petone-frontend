import React from 'react'
import { NavLink } from 'react-router-dom'
import { AboutUs } from '../components/AboutUs'

export const AboutUsPage = () => {
	return (
		<>
			<div className='fondo'>
				<div className="overlay d-flex align-items-center justify-content-center text-center vh-100">
					<div className="container">
						<h1 className="hero-title display-1 title">
							Pet-<span className='text-primary'>One</span>
						</h1>

						<h2 className="hero-subtitle">
							Somos los <span className='text-primary'>amantes</span> de las mascotas
						</h2>

						<div className="mt-4 d-flex flex-column flex-sm-row justify-content-center gap-3">

							<NavLink to={'/HomePage'} className="btn btn-primary btn-lg px-4 fw-bold">
								Navegar
							</NavLink>

							<a href="#about-us">
								<div className="btn btn-light btn-lg px-4 fw-bold text-primary">
									Leer más
								</div>
							</a>

						</div>
					</div>
				</div>
			</div>
			<AboutUs />
		</>
	)
}
