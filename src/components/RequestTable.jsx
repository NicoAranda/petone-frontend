import React, {
	useCallback,
	useEffect,
	useState
} from 'react';
import { RequestModal } from './RequestModal';
import { API } from '../lib/api';
import '../style/TablesStyle.css';

export const RequestTable = () => {
	const [requests, setRequests] = useState([]);
	const [selectedRequest, setSelectedRequest] =
		useState(null);
	const [showModal, setShowModal] =
		useState(false);
	const [loading, setLoading] =
		useState(false);
	const [error, setError] = useState('');

	const getErrorMessage = async (
		response,
		defaultMessage = 'No se pudo completar la operación.'
	) => {
		try {
			const data = await response.json();

			return (
				data?.message ||
				data?.error ||
				data?.detail ||
				defaultMessage
			);
		} catch {
			try {
				const text = await response.text();

				return text || defaultMessage;
			} catch {
				return defaultMessage;
			}
		}
	};

	const loadRequests = useCallback(async () => {
		setLoading(true);
		setError('');

		try {
			const token =
				localStorage.getItem('token');

			if (!token) {
				throw new Error(
					'No hay una sesión iniciada.'
				);
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
				const message =
					await getErrorMessage(
						response,
						'No fue posible cargar las solicitudes.'
					);

				throw new Error(message);
			}

			const data = await response.json();

			const solicitudes = Array.isArray(data)
				? data
				: [];

			const solicitudesConUsuario =
				await Promise.all(
					solicitudes.map(
						async (request) => {
							const usuarioId =
								request?.usuarioId;

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
								const userResponse =
									await fetch(
										`${API}/usuarios/${encodeURIComponent(
											usuarioId
										)}`,
										{
											method: 'GET',
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

								const usuario =
									await userResponse.json();

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
						}
					)
				);

			solicitudesConUsuario.sort(
				(a, b) =>
					(b.id ?? 0) - (a.id ?? 0)
			);

			setRequests(
				solicitudesConUsuario
			);
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
		const normalizedStatus =
			status?.toUpperCase();

		const map = {
			PENDIENTE:
				'bg-warning text-dark',
			APROBADA: 'bg-success',
			RECHAZADA: 'bg-danger'
		};

		return (
			map[normalizedStatus] ||
			'bg-secondary'
		);
	};

	const getStatusLabel = (status) => {
		const normalizedStatus =
			status?.toUpperCase();

		const map = {
			PENDIENTE: 'Pendiente',
			APROBADA: 'Aprobada',
			RECHAZADA: 'Rechazada'
		};

		return (
			map[normalizedStatus] ||
			status ||
			'Sin estado'
		);
	};

	const getTypeLabel = (type) => {
		const normalizedType =
			type?.toUpperCase();

		const map = {
			VETERINARIA:
				'Clínica Veterinaria',
			REFUGIO: 'Refugio',
			MUNICIPALIDAD:
				'Municipalidad',
			FUNDACION: 'Fundación',
			OTRO: 'Otro'
		};

		return (
			map[normalizedType] ||
			type ||
			'No registrado'
		);
	};

	const formatDate = (date) => {
		if (!date) {
			return 'No registrada';
		}

		const parsedDate = new Date(date);

		if (
			Number.isNaN(
				parsedDate.getTime()
			)
		) {
			return date;
		}

		return parsedDate.toLocaleDateString(
			'es-CL',
			{
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			}
		);
	};

	const getUserFullName = (request) => {
		const usuario = request.usuario;

		if (!usuario) {
			return `Usuario #${
				request.usuarioId ??
				'desconocido'
			}`;
		}

		const fullName = `${
			usuario.nombre || ''
		} ${usuario.apellido || ''}`.trim();

		return (
			fullName ||
			`Usuario #${request.usuarioId}`
		);
	};

	const getUserEmail = (request) => {
		return (
			request.usuario?.email ||
			'Correo no disponible'
		);
	};

	const getUserPhone = (request) => {
		return (
			request.usuario?.telefono ||
			request.telefono ||
			'No registrado'
		);
	};

	return (
		<>
			<div className="card shadow-sm border-0">
				<div className="card-header bg-white border-bottom-0 py-3 px-3 px-md-4">
					<div className="d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3">
						<div>
							<h2 className="h6 mb-1">
								Solicitudes de
								Organización
							</h2>

							<small className="text-muted">
								Revisa las solicitudes
								enviadas por los usuarios.
							</small>
						</div>

						<button
							type="button"
							className="btn btn-outline-success w-100"
							style={{
								maxWidth: '230px'
							}}
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
								'Actualizar solicitudes'
							)}
						</button>
					</div>
				</div>

				{error && (
					<div
						className="alert alert-danger mx-3"
						role="alert"
					>
						{error}
					</div>
				)}

				{/* Tabla para escritorio */}
				<div className="table-responsive d-none d-lg-block">
					<table className="table align-middle mb-0 custom-green-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Usuario</th>
								<th>Organización</th>
								<th>Tipo</th>
								<th>Correo institucional</th>
								<th>Estado</th>
								<th>Fecha</th>
								<th className="text-end">
									Acciones
								</th>
							</tr>
						</thead>

						<tbody>
							{loading &&
							requests.length === 0 ? (
								<tr>
									<td
										colSpan="8"
										className="text-center py-5 text-muted"
									>
										<span
											className="spinner-border spinner-border-sm me-2"
											aria-hidden="true"
										/>

										Cargando
										solicitudes...
									</td>
								</tr>
							) : requests.length >
							  0 ? (
								requests.map(
									(request) => (
										<tr
											key={
												request.id
											}
										>
											<td>
												{
													request.id
												}
											</td>

											<td>
												<div className="d-flex flex-column">
													<span className="fw-semibold">
														{getUserFullName(
															request
														)}
													</span>

													<small className="text-muted">
														{getUserEmail(
															request
														)}
													</small>
												</div>
											</td>

											<td
												className="text-break"
												style={{
													minWidth:
														'180px'
												}}
											>
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

											<td className="text-break">
												{request.correoInstitucional ||
													'No registrado'}
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
												<div className="d-flex justify-content-end">
													<button
														type="button"
														className="btn btn-sm btn-outline-primary text-nowrap"
														onClick={() =>
															openModal(
																request
															)
														}
													>
														<i className="bi bi-eye me-1" />
														Ver solicitud
													</button>
												</div>
											</td>
										</tr>
									)
								)
							) : (
								<tr>
									<td
										colSpan="8"
										className="text-center py-5 text-muted"
									>
										No hay solicitudes
										de organización.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Tarjetas para móvil y tablet */}
				<div className="d-lg-none p-2 p-sm-3 w-100 overflow-hidden">
					{loading &&
					requests.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<span
								className="spinner-border spinner-border-sm me-2"
								aria-hidden="true"
							/>

							Cargando solicitudes...
						</div>
					) : requests.length > 0 ? (
						<div className="d-flex flex-column gap-3 w-100">
							{requests.map(
								(request) => (
									<article
										key={request.id}
										className="card border shadow-sm w-100"
										style={{
											maxWidth:
												'100%',
											minWidth: 0,
											overflow:
												'hidden'
										}}
									>
										<div
											className="card-body p-3 w-100"
											style={{
												minWidth: 0
											}}
										>
											<div className="d-flex justify-content-between align-items-start gap-2 mb-3">
												<div
													style={{
														minWidth: 0
													}}
												>
													<div className="d-flex flex-wrap align-items-center gap-2 mb-2">
														<span className="badge bg-light text-dark border">
															#
															{
																request.id
															}
														</span>

														<span
															className={`badge ${getStatusBadge(
																request.estado
															)}`}
														>
															{getStatusLabel(
																request.estado
															)}
														</span>
													</div>

													<h3 className="h6 fw-bold mb-1 text-break">
														{request.nombreOrganizacion ||
															'Organización sin nombre'}
													</h3>

													<small className="text-muted">
														{getTypeLabel(
															request.tipoOrganizacion
														)}
													</small>
												</div>
											</div>

											<dl className="row g-2 mb-0 small w-100">
												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Usuario
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{getUserFullName(
														request
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Correo del
													usuario
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{getUserEmail(
														request
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Teléfono
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{getUserPhone(
														request
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Organización
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{request.nombreOrganizacion ||
														'No registrada'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Correo
													institucional
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{request.correoInstitucional ||
														'No registrado'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Dirección
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{request.direccion ||
														'No registrada'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Sitio web
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{request.sitioWeb ||
														'No registrado'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Fecha
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{formatDate(
														request.fechaSolicitud
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Descripción
												</dt>

												<dd className="col-12 col-sm-8 text-break mb-2">
													{request.descripcion ||
														'Sin descripción'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Motivo
												</dt>

												<dd className="col-12 col-sm-8 text-break mb-0">
													{request.motivoSolicitud ||
														request.motivo ||
														'Sin motivo registrado'}
												</dd>
											</dl>

											<div className="mt-3">
												<button
													type="button"
													className="btn btn-outline-primary btn-sm w-100"
													onClick={() =>
														openModal(
															request
														)
													}
												>
													<i className="bi bi-eye me-1" />
													Ver solicitud
												</button>
											</div>
										</div>
									</article>
								)
							)}
						</div>
					) : (
						<div className="text-center py-5 text-muted">
							No hay solicitudes de
							organización.
						</div>
					)}
				</div>
			</div>

			{showModal && selectedRequest && (
				<RequestModal
					request={selectedRequest}
					onClose={closeModal}
					onRequestUpdated={
						handleRequestUpdated
					}
				/>
			)}
		</>
	);
};