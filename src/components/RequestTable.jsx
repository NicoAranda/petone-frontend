import React, { useCallback, useEffect, useState } from 'react';
import { RequestModal } from './RequestModal';
import { API } from '../lib/api';

export const RequestTable = () => {
	const [requests, setRequests] = useState([]);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const getErrorMessage = async (response) => {
		try {
			const data = await response.json();

			return (
				data?.message ||
				data?.error ||
				data?.detail ||
				'No se pudo completar la operación.'
			);
		} catch {
			return 'No se pudo completar la operación.';
		}
	};

	const loadRequests = useCallback(async () => {
		setLoading(true);
		setError('');

		try {
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('No hay una sesión iniciada.');
			}

			const response = await fetch(
				`${API}/solicitudes-organizacion`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(response);
				throw new Error(message);
			}

			const data = await response.json();

			const solicitudes = Array.isArray(data) ? data : [];

			/*
			 * La solicitud solo contiene usuarioId.
			 * Por eso consultamos los datos de cada usuario para mostrarlos
			 * en la tabla y en el modal.
			 */
			const solicitudesConUsuario = await Promise.all(
				solicitudes.map(async (request) => {
					const usuarioId = request?.usuarioId;

					if (
						usuarioId === undefined ||
						usuarioId === null
					) {
						console.warn(
							`La solicitud ${request?.id} no tiene usuarioId`,
							request
						);

						return {
							...request,
							usuario: null
						};
					}

					try {
						const userResponse = await fetch(
							`${API}/usuarios/${encodeURIComponent(usuarioId)}`,
							{
								method: "GET",
								headers: {
									Authorization: `Bearer ${token}`
								}
							}
						);

						if (!userResponse.ok) {
							console.error(
								`No se pudo obtener el usuario ${usuarioId}:`,
								userResponse.status
							);

							return {
								...request,
								usuario: null
							};
						}

						const usuario = await userResponse.json();

						return {
							...request,
							usuario
						};
					} catch (userError) {
						console.error(
							`Error al obtener el usuario ${usuarioId}:`,
							userError
						);

						return {
							...request,
							usuario: null
						};
					}
				})
			);

			solicitudesConUsuario.sort(
				(a, b) => (b.id ?? 0) - (a.id ?? 0)
			);

			setRequests(solicitudesConUsuario);
		} catch (err) {
			console.error(
				'Error al cargar solicitudes de organización:',
				err
			);

			setRequests([]);
			setError(
				err.message ||
				'No fue posible cargar las solicitudes.'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadRequests();
	}, [loadRequests]);

	const openModal = (request) => {
		setSelectedRequest(request);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedRequest(null);
	};

	const handleRequestUpdated = async () => {
		closeModal();
		await loadRequests();
	};

	const getStatusBadge = (status) => {
		const map = {
			PENDIENTE: 'bg-warning text-dark',
			APROBADA: 'bg-success',
			RECHAZADA: 'bg-danger'
		};

		return map[status] || 'bg-secondary';
	};

	const getStatusLabel = (status) => {
		const map = {
			PENDIENTE: 'Pendiente',
			APROBADA: 'Aprobada',
			RECHAZADA: 'Rechazada'
		};

		return map[status] || status || 'Sin estado';
	};

	const getTypeLabel = (type) => {
		const map = {
			VETERINARIA: 'Clínica Veterinaria',
			REFUGIO: 'Refugio',
			MUNICIPALIDAD: 'Municipalidad',
			FUNDACION: 'Fundación',
			OTRO: 'Otro'
		};

		return map[type] || type || 'No registrado';
	};

	const formatDate = (date) => {
		if (!date) {
			return 'No registrada';
		}

		const parsedDate = new Date(date);

		if (Number.isNaN(parsedDate.getTime())) {
			return date;
		}

		return parsedDate.toLocaleDateString('es-CL', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	const getUserFullName = (request) => {
		const usuario = request.usuario;

		if (!usuario) {
			return `Usuario #${request.usuarioId ?? 'desconocido'}`;
		}

		const fullName = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();

		return fullName || `Usuario #${request.usuarioId}`;
	};

	return (
		<>
			<div className="card shadow-sm border-0 mb-4">
				<div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
					<div>
						<h2 className="h6 mb-1">
							Solicitudes de Organización
						</h2>

						<small className="text-muted">
							Revisa las solicitudes enviadas por los usuarios.
						</small>
					</div>

					<button
						type="button"
						className="btn btn-outline-success"
						onClick={loadRequests}
						disabled={loading}
					>
						{loading ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-2"
									aria-hidden="true"
								/>
								Cargando...
							</>
						) : (
							'Actualizar'
						)}
					</button>
				</div>

				{error && (
					<div className="alert alert-danger mx-3" role="alert">
						{error}
					</div>
				)}

				<div className="table-responsive">
					<table className="table align-middle mb-0 custom-green-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Usuario</th>
								<th>Organización</th>
								<th>Tipo</th>
								<th>Estado</th>
								<th>Fecha</th>
								<th>Acciones</th>
							</tr>
						</thead>

						<tbody>
							{loading && requests.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="text-center py-5 text-muted"
									>
										<div
											className="spinner-border spinner-border-sm me-2"
											role="status"
										>
											<span className="visually-hidden">
												Cargando solicitudes...
											</span>
										</div>

										Cargando solicitudes...
									</td>
								</tr>
							) : requests.length > 0 ? (
								requests.map((request) => (
									<tr key={request.id}>
										<td>{request.id}</td>

										<td>
											<div className="d-flex flex-column">
												<span className="fw-semibold">
													{getUserFullName(request)}
												</span>

												<small className="text-muted">
													{request.usuario?.email ||
														'Correo no disponible'}
												</small>
											</div>
										</td>

										<td>
											{request.nombreOrganizacion ||
												'No registrada'}
										</td>

										<td>
											<span className="badge bg-light text-dark border">
												{getTypeLabel(
													request.tipoOrganizacion
												)}
											</span>
										</td>

										<td>
											<span
												className={`badge ${getStatusBadge(
													request.estado
												)}`}
											>
												{getStatusLabel(
													request.estado
												)}
											</span>
										</td>

										<td className="text-nowrap">
											{formatDate(
												request.fechaSolicitud
											)}
										</td>

										<td>
											<button
												type="button"
												className="btn btn-sm btn-outline-primary text-nowrap"
												onClick={() =>
													openModal(request)
												}
											>
												Ver solicitud
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="7"
										className="text-center py-5 text-muted"
									>
										No hay solicitudes de organización.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{showModal && selectedRequest && (
				<RequestModal
					request={selectedRequest}
					onClose={closeModal}
					onRequestUpdated={handleRequestUpdated}
				/>
			)}
		</>
	);
};