import React from 'react'

export const RegisterForm = ({ onSwitchForm }) => {
	return (
		<>
			<div className="vh-100 d-flex align-items-center justify-content-center p-3">
				{/* Contenedor principal estilo tarjeta */}
				<div
					className="card rounded-4 shadow-lg w-100 overflow-hidden border-0 fade-in-bckg"
					style={{ maxWidth: '1000px' }}
				>
					<div className="row g-0">
						<div className="col-md-6 d-none d-md-flex p-0 fondoRegister align-items-center justify-content-center">
							<p className="display-1 text-white text-center px-4">¡Se parte de nuestra comunidad!</p>
						</div>

						{/* Lado Derecho (Formulario) */}
						<div className="col-md-6 p-4 p-md-5">
							<div className="text-center mb-5">
								<h1 className="fw-bold fs-2 text-dark">Registrate</h1>
								<p className="text-muted">Ingresa tu información para registrarte</p>
							</div>

							<form>
								<div className="row mb-3">
									{/* First Name */}
									<div className="col-sm-6 mb-3 mb-sm-0">
										<label htmlFor="firstName" className="form-label small fw-semibold">Nombre</label>
										<div className="input-group">
											<span className="input-group-text bg-white text-muted border-end-0">
												<i className="bi bi-person"></i>
											</span>
											<input
												type="text"
												id="firstName"
												className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
												placeholder="Ej: Juan"
											/>
										</div>
									</div>

									{/* Last Name */}
									<div className="col-sm-6">
										<label htmlFor="lastName" className="form-label small fw-semibold">Apellido</label>
										<div className="input-group">
											<span className="input-group-text bg-white text-muted border-end-0">
												<i className="bi bi-person"></i>
											</span>
											<input
												type="text"
												id="lastName"
												className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
												placeholder="Ej: Pérez"
											/>
										</div>
									</div>
								</div>

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
											placeholder="juanperezs@example.com"
										/>
									</div>
								</div>

								{/* Password */}
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
												className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
												placeholder="************"
											/>
										</div>
									</div>
									<div className="mb-3 col-sm-6 mb-3 mb-sm-0">
										<label htmlFor="password" className="form-label small fw-semibold">Confirmar Contraseña</label>
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
								</div>

								{/* rut */}
								<div className="mb-3">
									<label htmlFor="email" className="form-label small fw-semibold">Rut</label>
									<div className="input-group">
										<span className="input-group-text bg-white text-muted border-end-0">
											<i className="bi bi-person-vcard"></i>
										</span>
										<input
											type="rut"
											id="rut"
											className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
											placeholder="12.345.678-9"
										/>
									</div>
								</div>

								{/* telefono */}
								<div className="mb-3">
									<label htmlFor="telefono" className="form-label small fw-semibold">Telefono</label>
									<div className="input-group">
										<span className="input-group-text bg-white text-muted border-end-0">
											<i className="bi bi-telephone"></i>
										</span>
										<input
											type="telefono"
											id="telefono"
											className="form-control border-start-0 ps-0 focus-ring focus-ring-light"
											placeholder="+56 9"
										/>
									</div>
								</div>

								{/* Enlace para cambiar a Login */}
                <div className="d-flex justify-content-center mt-4">
                  <span
                    className="text-center text-decoration-none"
                    style={{ cursor: 'pointer', maxWidth: '300px', color: 'blue'  }}
                    onClick={onSwitchForm}
                  >
                    ¿Ya tienes cuenta? Inicia Sesión
                  </span>
                </div>


								{/* Botón de Registro */}
								<div className="text-center mt-4">
									<button
										type="submit"
										className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-uppercase"
										style={{ maxWidth: '300px' }}
									>
										Register Now
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
