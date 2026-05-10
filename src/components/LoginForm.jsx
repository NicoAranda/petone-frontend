import React from 'react'
import { NavLink } from 'react-router-dom'

export const LoginForm = ({ onSwitchForm }) => {
	return (
		<>
			<div className="vh-100 d-flex align-items-center justify-content-center p-3">
				{/* Contenedor principal estilo tarjeta */}
				<div
					className="card rounded-4 shadow-lg w-100 overflow-hidden border-0 fade-in-bckg"
					style={{ maxWidth: '1000px' }}
				>
					<div className="row g-0">

						{/* Lado Derecho (Formulario) */}
						<div className="col-md-6 p-4 p-md-5">
							<div className="text-center mb-5">
								<h1 className="fw-bold fs-2 text-dark">Iniciar Sesión</h1>
								<p className="text-muted"></p>
							</div>
							<form>
								{/* Email */}
								<div className="mb-3">
									<label htmlFor="email" className="form-label small fw-semibold">Email</label>
									<div className="input-group">
										<span className="input-group-text bg-white text-muted border-end-0">
											<i className="bi bi-envelope"></i>
										</span>
										<input
											type="email"
											id="email"
											className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
											placeholder="johnsmith@example.com"
										/>
									</div>
								</div>

								{/* Password */}
								<div className="">
									<label htmlFor="password" className="form-label small fw-semibold">Contraseña</label>
									<div className="input-group">
										<span className="input-group-text bg-white text-muted border-end-0">
											<i className="bi bi-lock"></i>
										</span>
										<input
											type="password"
											id="password"
											className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
											placeholder="************"
										/>
									</div>
								</div>

								<div className="d-flex justify-content-center mt-4">
									<span
										className="text-blue text-center text-decoration-none"
										style={{ cursor: 'pointer', maxWidth: '300px', color: 'blue' }}
										onClick={onSwitchForm}
									>
										¿No tienes cuenta? Registrate
									</span>
								</div>
								{/* Botón de Registro */}
								<div className="text-center mt-4">
									<span
										type="submit"
										className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-uppercase"
										style={{ cursor: 'pointer', maxWidth: '300px' }}
										onClick={onSwitchForm}
									>
										Iniciar Sesión
									</span>
								</div>
							</form>
						</div>
						<div className="col-md-6 d-none d-md-flex p-0 fondoLogin align-items-center justify-content-center">
							<div className='d-flex flex-column align-items-center'>
								<p className="display-1 text-white text-center px-4">¡Bienvenido!</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
