import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const ReportsTable = ({
	fetchReports,
	API_REPORTS = 'http://localhost:8080/api/reportes'
}) => {
	const [reportes, setReportes] = useState([]);
	const [loading, setLoading] = useState(false);

	const [showResponseModal, setShowResponseModal] =
		useState(false);
	const [selectedReport, setSelectedReport] =
		useState(null);

	const [responseText, setResponseText] =
		useState('');
	const [responseStatus, setResponseStatus] =
		useState('RESUELTO');

	const [showDeleteModal, setShowDeleteModal] =
		useState(false);
	const [reportToDelete, setReportToDelete] =
		useState(null);

	const [sendingResponse, setSendingResponse] =
		useState(false);
	const [deleting, setDeleting] = useState(false);
	const [updatingStatusId, setUpdatingStatusId] =
		useState(null);

	useEffect(() => {
		loadReports();
	}, []);

	useEffect(() => {
		if (showResponseModal || showDeleteModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [showResponseModal, showDeleteModal]);

	const getToken = () => {
		return localStorage.getItem('token');
	};

	const getErrorMessage = async (
		response,
		defaultMessage
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

	const loadReports = async () => {
		setLoading(true);

		try {
			const token = getToken();

			const response = await fetch(
				API_REPORTS,
				{
					method: 'GET',
					headers: token
						? {
							Authorization: `Bearer ${token}`
						}
						: {}
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al cargar reportes.'
				);

				throw new Error(message);
			}

			const data = await response.json();

			const sortedReports = Array.isArray(data)
				? [...data].sort(
					(a, b) =>
						(b.id ?? 0) -
						(a.id ?? 0)
				)
				: [];

			setReportes(sortedReports);

			if (typeof fetchReports === 'function') {
				fetchReports(sortedReports);
			}
		} catch (error) {
			console.error(
				'Error al cargar reportes:',
				error
			);

			setReportes([]);

			toast.error(
				error.message ||
				'Error al cargar reportes.'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenResponse = (report) => {
		setSelectedReport(report);
		setResponseText(
			report.respuestaAdmin || ''
		);
		setResponseStatus(
			report.estado === 'PENDIENTE'
				? 'EN_REVISION'
				: report.estado || 'RESUELTO'
		);
		setShowResponseModal(true);
	};

	const handleCloseResponseModal = () => {
		if (sendingResponse) {
			return;
		}

		setShowResponseModal(false);
		setSelectedReport(null);
		setResponseText('');
		setResponseStatus('RESUELTO');
	};

	const handleSubmitResponse = async (
		event
	) => {
		event?.preventDefault();

		if (!selectedReport?.id) {
			toast.error(
				'No se pudo identificar el reporte.'
			);

			return;
		}

		if (!responseText.trim()) {
			toast.error(
				'La respuesta no puede estar vacía.'
			);

			return;
		}

		const token = getToken();

		setSendingResponse(true);

		try {
			const response = await fetch(
				`${API_REPORTS}/${selectedReport.id}/responder`,
				{
					method: 'PUT',
					headers: {
						'Content-Type':
							'application/json',
						...(token
							? {
								Authorization: `Bearer ${token}`
							}
							: {})
					},
					body: JSON.stringify({
						respuesta:
							responseText.trim(),
						estado: responseStatus
					})
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al enviar la respuesta.'
				);

				throw new Error(message);
			}

			toast.success(
				'Respuesta enviada correctamente.'
			);

			handleCloseResponseModal();
			await loadReports();
		} catch (error) {
			console.error(
				'Error al responder reporte:',
				error
			);

			toast.error(
				error.message ||
				'Error al enviar la respuesta.'
			);
		} finally {
			setSendingResponse(false);
		}
	};

	const handleChangeStatus = async (
		reportId,
		newStatus
	) => {
		const token = getToken();

		setUpdatingStatusId(reportId);

		try {
			const response = await fetch(
				`${API_REPORTS}/${reportId}/estado?nuevoEstado=${encodeURIComponent(
					newStatus
				)}`,
				{
					method: 'PUT',
					headers: token
						? {
							Authorization: `Bearer ${token}`
						}
						: {}
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al actualizar el estado.'
				);

				throw new Error(message);
			}

			setReportes((previous) =>
				previous.map((report) =>
					report.id === reportId
						? {
							...report,
							estado: newStatus
						}
						: report
				)
			);

			toast.success(
				'Estado actualizado.'
			);
		} catch (error) {
			console.error(
				'Error al actualizar estado:',
				error
			);

			toast.error(
				error.message ||
				'Error al actualizar estado.'
			);

			await loadReports();
		} finally {
			setUpdatingStatusId(null);
		}
	};

	const handleDeleteClick = (report) => {
		setReportToDelete(report);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		if (deleting) {
			return;
		}

		setShowDeleteModal(false);
		setReportToDelete(null);
	};

	const confirmDelete = async () => {
		if (!reportToDelete?.id) {
			return;
		}

		const token = getToken();

		setDeleting(true);

		try {
			const response = await fetch(
				`${API_REPORTS}/${reportToDelete.id}`,
				{
					method: 'DELETE',
					headers: token
						? {
							Authorization: `Bearer ${token}`
						}
						: {}
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al eliminar el reporte.'
				);

				throw new Error(message);
			}

			toast.success(
				'Reporte eliminado correctamente.'
			);

			handleCloseDeleteModal();
			await loadReports();
		} catch (error) {
			console.error(
				'Error al eliminar reporte:',
				error
			);

			toast.error(
				error.message ||
				'Error al eliminar reporte.'
			);
		} finally {
			setDeleting(false);
		}
	};

	const getStatusBadge = (status) => {
		const statusMap = {
			PENDIENTE:
				'bg-warning text-dark',
			EN_REVISION: 'bg-info text-dark',
			RESUELTO: 'bg-success',
			RECHAZADO: 'bg-danger'
		};

		return (
			statusMap[status] ||
			'bg-secondary'
		);
	};

	const getStatusLabel = (status) => {
		const statusMap = {
			PENDIENTE: 'Pendiente',
			EN_REVISION: 'En revisión',
			RESUELTO: 'Resuelto',
			RECHAZADO: 'Rechazado'
		};

		return (
			statusMap[status] ||
			status ||
			'Sin estado'
		);
	};

	const getTypeLabel = (type) => {
		const typeMap = {
			ABUSO: 'Abuso o acoso',
			IMAGENES_SENSIBLES:
				'Imágenes sensibles',
			CONTENIDO_INAPROPIADO:
				'Contenido inapropiado',
			INFORMACION_FALSA:
				'Información falsa',
			OTRO: 'Otro'
		};

		return (
			typeMap[type] ||
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
			Number.isNaN(parsedDate.getTime())
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

	return (
		<>
			<div className="card shadow-sm border-0">
				<div className="card-header bg-white border-bottom-0 py-3 px-3 px-md-4">
					<div className="d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3">
						<div>
							<h2 className="h6 mb-1">
								Reportes de publicaciones
							</h2>

							<small className="text-muted">
								Revisa, responde y gestiona
								reportes realizados por los
								usuarios.
							</small>
						</div>

						<button
							type="button"
							className="btn btn-outline-success w-100"
							style={{
								maxWidth: '220px'
							}}
							onClick={loadReports}
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
								'Actualizar reportes'
							)}
						</button>
					</div>
				</div>

				{/* Tabla para escritorio */}
				<div className="table-responsive d-none d-lg-block">
					<table className="table align-middle mb-0 custom-green-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Publicación</th>
								<th>Tipo</th>
								<th>Estado</th>
								<th>Descripción</th>
								<th>Fecha</th>
								<th className="text-end">
									Acciones
								</th>
							</tr>
						</thead>

						<tbody>
							{reportes.length > 0 ? (
								reportes.map((report) => (
									<tr key={report.id}>
										<td>
											{report.id}
										</td>

										<td>
											<span className="fw-semibold">
												#
												{report.publicacionId ??
													'No asociada'}
											</span>
										</td>

										<td>
											<span className="badge bg-light text-dark border">
												{getTypeLabel(
													report.tipo
												)}
											</span>
										</td>

										<td>
											<select
												className={`form-select form-select-sm ${getStatusBadge(
													report.estado
												)}`}
												value={
													report.estado ||
													'PENDIENTE'
												}
												onChange={(
													event
												) =>
													handleChangeStatus(
														report.id,
														event
															.target
															.value
													)
												}
												disabled={
													updatingStatusId ===
													report.id
												}
												style={{
													width:
														'145px'
												}}
											>
												<option value="PENDIENTE">
													Pendiente
												</option>

												<option value="EN_REVISION">
													En revisión
												</option>

												<option value="RESUELTO">
													Resuelto
												</option>

												<option value="RECHAZADO">
													Rechazado
												</option>
											</select>
										</td>

										<td
											className="text-break"
											style={{
												minWidth:
													'220px',
												maxWidth:
													'320px'
											}}
										>
											{report.descripcion ||
												'Sin descripción'}
										</td>

										<td className="text-nowrap small">
											{formatDate(
												report.fechaReporte
											)}
										</td>

										<td>
											<div className="d-flex justify-content-end gap-2">
												<button
													type="button"
													className="btn btn-sm btn-outline-primary"
													onClick={() =>
														handleOpenResponse(
															report
														)
													}
												>
													<i className="bi bi-reply me-1" />
													Responder
												</button>

												<button
													type="button"
													className="btn btn-sm btn-outline-danger"
													onClick={() =>
														handleDeleteClick(
															report
														)
													}
												>
													<i className="bi bi-trash me-1" />
													Eliminar
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="7"
										className="text-center py-5 text-muted"
									>
										{loading
											? 'Cargando reportes...'
											: 'No hay reportes.'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Tarjetas para móvil y tablet */}
				<div className="d-lg-none p-2 p-sm-3 w-100 overflow-hidden">
					{loading &&
						reportes.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<span
								className="spinner-border spinner-border-sm me-2"
								aria-hidden="true"
							/>

							Cargando reportes...
						</div>
					) : reportes.length > 0 ? (
						<div className="d-flex flex-column gap-3 w-100">
							{reportes.map(
								(report) => (
									<article
										key={report.id}
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
																report.id
															}
														</span>

														<span
															className={`badge ${getStatusBadge(
																report.estado
															)}`}
														>
															{getStatusLabel(
																report.estado
															)}
														</span>
													</div>

													<h3 className="h6 fw-bold mb-1 text-break">
														Reporte de
														publicación #
														{report.publicacionId ??
															'No asociada'}
													</h3>

													<small className="text-muted">
														{getTypeLabel(
															report.tipo
														)}
													</small>
												</div>
											</div>

											<dl className="row g-2 mb-0 small w-100">
												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Tipo
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{getTypeLabel(
														report.tipo
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Publicación
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													#
													{report.publicacionId ??
														'No asociada'}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Fecha
												</dt>

												<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
													{formatDate(
														report.fechaReporte
													)}
												</dd>

												<dt className="col-12 col-sm-4 text-muted fw-normal">
													Descripción
												</dt>

												<dd className="col-12 col-sm-8 text-break mb-2">
													{report.descripcion ||
														'Sin descripción'}
												</dd>

												{report.respuestaAdmin && (
													<>
														<dt className="col-12 col-sm-4 text-muted fw-normal">
															Respuesta
														</dt>

														<dd className="col-12 col-sm-8 text-break mb-2">
															{
																report.respuestaAdmin
															}
														</dd>
													</>
												)}
											</dl>

											<div className="mt-3">
												<label
													htmlFor={`report-status-${report.id}`}
													className="form-label small fw-semibold"
												>
													Cambiar estado
												</label>

												<select
													id={`report-status-${report.id}`}
													className={`form-select form-select-sm ${getStatusBadge(
														report.estado
													)}`}
													value={
														report.estado ||
														'PENDIENTE'
													}
													onChange={(
														event
													) =>
														handleChangeStatus(
															report.id,
															event
																.target
																.value
														)
													}
													disabled={
														updatingStatusId ===
														report.id
													}
												>
													<option value="PENDIENTE">
														Pendiente
													</option>

													<option value="EN_REVISION">
														En revisión
													</option>

													<option value="RESUELTO">
														Resuelto
													</option>

													<option value="RECHAZADO">
														Rechazado
													</option>
												</select>
											</div>

											<div className="d-flex flex-column flex-sm-row gap-2 mt-3 w-100">
												<button
													type="button"
													className="btn btn-outline-primary btn-sm flex-fill w-100"
													onClick={() =>
														handleOpenResponse(
															report
														)
													}
												>
													<i className="bi bi-reply me-1" />
													Responder
												</button>

												<button
													type="button"
													className="btn btn-outline-danger btn-sm flex-fill w-100"
													onClick={() =>
														handleDeleteClick(
															report
														)
													}
												>
													<i className="bi bi-trash me-1" />
													Eliminar
												</button>
											</div>
										</div>
									</article>
								)
							)}
						</div>
					) : (
						<div className="text-center py-5 text-muted">
							No hay reportes.
						</div>
					)}
				</div>
			</div>

			{/* Modal para responder */}
			{showResponseModal &&
				selectedReport && (
					<div
						className="admin-dashboard-modal-backdrop"
						onClick={
							handleCloseResponseModal
						}
					>
						<div
							className="admin-dashboard-modal"
							role="dialog"
							aria-modal="true"
							aria-labelledby="responseReportModalTitle"
							onClick={(event) =>
								event.stopPropagation()
							}
						>
							<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-start gap-3">
								<div>
									<h5
										className="mb-1"
										id="responseReportModalTitle"
									>
										Responder reporte #
										{
											selectedReport.id
										}
									</h5>

									<small className="text-muted">
										{getTypeLabel(
											selectedReport.tipo
										)}
									</small>
								</div>

								<button
									type="button"
									className="btn-close"
									onClick={
										handleCloseResponseModal
									}
									aria-label="Cerrar"
									disabled={
										sendingResponse
									}
								/>
							</div>

							<div className="admin-dashboard-modal-body">
								<div className="mb-3">
									<label className="form-label fw-bold">
										Descripción del
										reporte
									</label>

									<div className="p-3 bg-light border rounded text-break">
										{selectedReport.descripcion ||
											'Sin descripción'}
									</div>
								</div>

								{selectedReport.respuestaAdmin && (
									<div className="mb-3">
										<label className="form-label fw-bold">
											Respuesta anterior
										</label>

										<div className="p-3 bg-light border rounded text-break">
											{
												selectedReport.respuestaAdmin
											}
										</div>
									</div>
								)}

								<form
									onSubmit={
										handleSubmitResponse
									}
								>
									<div className="mb-3">
										<label
											htmlFor="reportResponse"
											className="form-label"
										>
											Respuesta
										</label>

										<textarea
											id="reportResponse"
											className="form-control"
											rows={5}
											placeholder="Escribe la respuesta al reporte..."
											value={
												responseText
											}
											onChange={(
												event
											) =>
												setResponseText(
													event
														.target
														.value
												)
											}
											disabled={
												sendingResponse
											}
											required
										/>
									</div>

									<div className="mb-3">
										<label
											htmlFor="reportResponseStatus"
											className="form-label"
										>
											Estado
										</label>

										<select
											id="reportResponseStatus"
											className="form-select"
											value={
												responseStatus
											}
											onChange={(
												event
											) =>
												setResponseStatus(
													event
														.target
														.value
												)
											}
											disabled={
												sendingResponse
											}
										>
											<option value="EN_REVISION">
												En revisión
											</option>

											<option value="RESUELTO">
												Resuelto
											</option>

											<option value="RECHAZADO">
												Rechazado
											</option>
										</select>
									</div>

									<div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
										<button
											type="button"
											className="btn btn-secondary"
											onClick={
												handleCloseResponseModal
											}
											disabled={
												sendingResponse
											}
										>
											Cancelar
										</button>

										<button
											type="submit"
											className="btn btn-primary"
											disabled={
												sendingResponse
											}
										>
											{sendingResponse ? (
												<>
													<span
														className="spinner-border spinner-border-sm me-2"
														aria-hidden="true"
													/>

													Enviando...
												</>
											) : (
												'Enviar respuesta'
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

			{/* Modal para eliminar */}
			{showDeleteModal &&
				reportToDelete && (
					<div
						className="admin-dashboard-modal-backdrop"
						onClick={
							handleCloseDeleteModal
						}
					>
						<div
							className="admin-dashboard-modal"
							style={{
								maxWidth: '420px'
							}}
							role="dialog"
							aria-modal="true"
							aria-labelledby="deleteReportModalTitle"
							onClick={(event) =>
								event.stopPropagation()
							}
						>
							<div
								className="admin-dashboard-modal-header d-flex justify-content-between align-items-center"
								style={{
									backgroundColor:
										'#eef7ee',
									borderBottom:
										'1px solid #d1e7dd'
								}}
							>
								<h5
									className="mb-0 text-success"
									id="deleteReportModalTitle"
								>
									Confirmar eliminación
								</h5>

								<button
									type="button"
									className="btn-close"
									onClick={
										handleCloseDeleteModal
									}
									aria-label="Cerrar"
									disabled={deleting}
								/>
							</div>

							<div
								className="admin-dashboard-modal-body text-center py-4"
								style={{
									backgroundColor:
										'#f9fdf9'
								}}
							>
								<div className="mb-3">
									<i className="bi bi-exclamation-triangle-fill text-danger display-5" />
								</div>

								<p className="mb-2">
									¿Estás seguro de que
									deseas eliminar el
									reporte:
								</p>

								<p className="fw-bold mb-3">
									#
									{
										reportToDelete.id
									}{' '}
									–{' '}
									{getTypeLabel(
										reportToDelete.tipo
									)}
								</p>

								<p className="mb-0 text-danger">
									Esta acción no se puede
									deshacer.
								</p>
							</div>

							<div
								className="d-flex flex-column-reverse flex-sm-row justify-content-center gap-2 p-3"
								style={{
									backgroundColor:
										'#f9fdf9',
									borderTop:
										'1px solid #e0ebe0'
								}}
							>
								<button
									type="button"
									className="btn btn-outline-secondary px-4"
									onClick={
										handleCloseDeleteModal
									}
									disabled={deleting}
								>
									Cancelar
								</button>

								<button
									type="button"
									className="btn btn-danger px-4"
									onClick={
										confirmDelete
									}
									disabled={deleting}
								>
									{deleting ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												aria-hidden="true"
											/>

											Eliminando...
										</>
									) : (
										'Sí, eliminar'
									)}
								</button>
							</div>
						</div>
					</div>
				)}
		</>
	);
};

export default ReportsTable;