import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const LoginForm = ({ onSwitchForm }) => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const navigate = useNavigate()
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Evitar correos vacíos o con solo espacios
		if (!email.trim()) {
			setError('El correo electrónico es obligatorio.');
			return;
		}

		// Validar formato de email
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		if (!emailRegex.test(email)) {
			setError('Por favor, ingresa un formato de correo válido (ej: usuario@correo.com).');
			return;
		}

		// Evitar contraseñas vacías
		if (!password.trim()) {
			setError('La contraseña es obligatoria.');
			return;
		}
		setIsLoading(true);

		try {
			const api_url = 'http://localhost:8081/api/usuarios/login'
			const response = await fetch(api_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.')
			}

			const data = await response.json();

			login(data.token);

			toast.success("¡Inicio de sesión exitoso!");
			navigate('/HomePage')

		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

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

							{error && (
								<div className='alert alert-danger py-2 small' role='alert'>
									<i className='bi bi-exclamation-triangle-fill me-2'></i>
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit}>
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
											placeholder="juanperez@ejemplo.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
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
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
								</div>

								<div className="d-flex justify-content-center mt-4">
									<span
										className="text-blue text-center text-decoration-none"
										style={{ cursor: 'pointer', maxWidth: '300px', color: 'blue' }}
										onClick={onSwitchForm}
									>
										¿No tienes cuenta? Regístrate
									</span>
								</div>
								{/* Botón de Registro */}
								<div className="text-center mt-4">
									<button
										type="submit"
										className="btn btn-primary w-100 rounded-3 py-2 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2"
										style={{ maxWidth: '300px', margin: '0 auto' }}
										disabled={isLoading}
									>
										{isLoading ? (
											<>
												<span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
												<span role="status">Cargando...</span>
											</>
										) : (
											'Iniciar Sesión'
										)}
									</button>
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