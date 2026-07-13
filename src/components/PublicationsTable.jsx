import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const PublicationsTable = ({
	publicaciones = [],
	fetchPublicaciones,
	API_PUBLICATIONS,
	loading
}) => {
	const initialPubForm = {
		id: null,
		nombre: '',
		ubicacion: '',
		especie: '',
		sexo: '',
		estado: '',
		descripcion: ''
	};

	const [pubForm, setPubForm] = useState(initialPubForm);
	const [showEditPubModal, setShowEditPubModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [pubToDelete, setPubToDelete] = useState(null);

	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (showEditPubModal || showDeleteModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [showEditPubModal, showDeleteModal]);

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

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setPubForm((previous) => ({
			...previous,
			[name]: value
		}));
	};

	const handleEditPub = (publication) => {
		setPubForm({
			id: publication.id ?? null,
			nombre: publication.nombre ?? '',
			ubicacion: publication.ubicacion ?? '',
			especie: publication.especie ?? '',
			sexo: publication.sexo ?? '',
			estado: publication.estado ?? '',
			descripcion: publication.descripcion ?? ''
		});

		setShowEditPubModal(true);
	};

	const handleClosePubModal = () => {
		if (saving) {
			return;
		}

		setShowEditPubModal(false);
		setPubForm(initialPubForm);
	};

	const handlePubSubmit = async (event) => {
		event.preventDefault();

		if (!pubForm.id) {
			toast.error(
				'No se pudo identificar la publicación.'
			);

			return;
		}

		const token = getToken();

		setSaving(true);

		try {
			const response = await fetch(
				`${API_PUBLICATIONS}/${pubForm.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						...(token
							? {
								Authorization: `Bearer ${token}`
							}
							: {})
					},
					body: JSON.stringify({
						nombre: pubForm.nombre.trim(),
						ubicacion: pubForm.ubicacion.trim(),
						especie: pubForm.especie,
						sexo: pubForm.sexo,
						estado: pubForm.estado,
						descripcion: pubForm.descripcion.trim()
					})
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al actualizar la publicación.'
				);

				throw new Error(message);
			}

			await fetchPublicaciones();

			toast.success(
				'Publicación actualizada con éxito.'
			);

			handleClosePubModal();
		} catch (error) {
			console.error(
				'Error updating publicación:',
				error
			);

			toast.error(
				error.message ||
				'Error al actualizar la publicación.',
				{
					style: {
						background: '#d32f2f',
						color: '#fff'
					},
					iconTheme: {
						primary: '#fff',
						secondary: '#d32f2f'
					}
				}
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteClick = (publication) => {
		setPubToDelete(publication);
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		if (deleting) {
			return;
		}

		setShowDeleteModal(false);
		setPubToDelete(null);
	};

	const confirmDelete = async () => {
		if (!pubToDelete?.id) {
			return;
		}

		const token = getToken();

		setDeleting(true);

		try {
			const response = await fetch(
				`${API_PUBLICATIONS}/${pubToDelete.id}`,
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
					'Error al eliminar la publicación.'
				);

				throw new Error(message);
			}

			await fetchPublicaciones();

			toast.success(
				'Publicación eliminada correctamente.'
			);

			handleCloseDeleteModal();
		} catch (error) {
			console.error(
				'Error deleting publicación:',
				error
			);

			toast.error(
				error.message ||
				'Error al eliminar la publicación.',
				{
					style: {
						background: '#d32f2f',
						color: '#fff'
					},
					iconTheme: {
						primary: '#fff',
						secondary: '#d32f2f'
					}
				}
			);
		} finally {
			setDeleting(false);
		}
	};

	const getStatusBadgeClass = (status) => {
		const normalizedStatus =
			status?.toUpperCase() || '';

		const statusClasses = {
			PERDIDO: 'bg-danger',
			ENCONTRADO: 'bg-success',
			ACTIVA: 'bg-success',
			RESUELTA: 'bg-primary',
			CANCELADA: 'bg-secondary'
		};

		return (
			statusClasses[normalizedStatus] ||
			'bg-secondary'
		);
	};

	const getPublicationName = (publication) => {
		return (
			publication?.nombre?.trim() ||
			'Mascota sin nombre'
		);
	};

	const getPhotoList = (publication) => {
		if (!Array.isArray(publication?.fotos)) {
			return [];
		}

		return publication.fotos.filter(Boolean);
	};

	const getMainPhoto = (publication) => {
		const photos = getPhotoList(publication);

		return photos[0] || null;
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

	return (
		<>
			<div className="card shadow-sm border-0">
				<div className="card-header bg-white border-bottom-0 py-3 px-3 px-md-4">
					<div className="d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3">
						<div>
							<h2 className="h6 mb-1">
								Publicaciones
							</h2>

							<small className="text-muted">
								Administra las publicaciones
								registradas en el sistema.
							</small>
						</div>

						<button
							type="button"
							className="btn btn-outline-success w-100"
							style={{
								maxWidth: '260px'
							}}
							onClick={fetchPublicaciones}
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
								'Actualizar publicaciones'
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
								<th>Mascota</th>
								<th>Especie</th>
								<th>Sexo</th>
								<th>Ubicación</th>
								<th>Estado</th>
								<th>Usuario</th>
								<th>Fecha</th>
								<th className="text-end">
									Acciones
								</th>
							</tr>
						</thead>

						<tbody>
							{publicaciones.length > 0 ? (
								publicaciones.map(
									(publication) => {
										const mainPhoto =
											getMainPhoto(
												publication
											);

										return (
											<tr
												key={
													publication.id
												}
											>
												<td>
													{
														publication.id
													}
												</td>

												<td>
													<div className="d-flex align-items-center gap-2">
														{mainPhoto ? (
															<img
																src={
																	mainPhoto
																}
																alt={getPublicationName(
																	publication
																)}
																className="rounded border"
																style={{
																	width: '48px',
																	height: '48px',
																	objectFit:
																		'cover'
																}}
															/>
														) : (
															<div
																className="rounded border bg-light d-flex justify-content-center align-items-center"
																style={{
																	width: '48px',
																	height: '48px',
																	flexShrink: 0
																}}
															>
																<i className="bi bi-image text-muted" />
															</div>
														)}

														<div className="d-flex flex-column">
															<span className="fw-semibold">
																{getPublicationName(
																	publication
																)}
															</span>

															<small className="text-muted">
																{
																	getPhotoList(
																		publication
																	)
																		.length
																}{' '}
																foto(s)
															</small>
														</div>
													</div>
												</td>

												<td>
													{publication.especie ||
														'No registrada'}
												</td>

												<td>
													{publication.sexo ||
														'No registrado'}
												</td>

												<td
													style={{
														minWidth:
															'220px'
													}}
												>
													{publication.ubicacion ||
														'No registrada'}
												</td>

												<td>
													<span
														className={`badge ${getStatusBadgeClass(
															publication.estado
														)}`}
													>
														{publication.estado ||
															'SIN ESTADO'}
													</span>
												</td>

												<td>
													{publication.usuario ? (
														<div className="d-flex flex-column">
															<span className="fw-semibold">
																{[
																	publication
																		.usuario
																		.nombre,
																	publication
																		.usuario
																		.apellido
																]
																	.filter(
																		Boolean
																	)
																	.join(
																		' '
																	) ||
																	'Usuario'}
															</span>

															<small className="text-muted">
																{publication
																	.usuario
																	.email ||
																	`ID: ${publication.userId ??
																	'No disponible'
																	}`}
															</small>
														</div>
													) : (
														<span className="text-muted">
															Usuario #
															{publication.userId ??
																'No asociado'}
														</span>
													)}
												</td>

												<td className="text-nowrap">
													{formatDate(
														publication.fechaPublicacion
													)}
												</td>

												<td>
													<div className="d-flex justify-content-end gap-2">
														<button
															type="button"
															className="btn btn-sm btn-outline-secondary"
															onClick={() =>
																handleEditPub(
																	publication
																)
															}
														>
															<i className="bi bi-pencil-square me-1" />
															Editar
														</button>

														<button
															type="button"
															className="btn btn-sm btn-outline-danger"
															onClick={() =>
																handleDeleteClick(
																	publication
																)
															}
														>
															<i className="bi bi-trash me-1" />
															Eliminar
														</button>
													</div>
												</td>
											</tr>
										);
									}
								)
							) : (
								<tr>
									<td
										colSpan="9"
										className="text-center py-5 text-muted"
										style={{
											backgroundColor:
												'#f9fdf9'
										}}
									>
										{loading
											? 'Cargando publicaciones...'
											: 'No se encontraron publicaciones.'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Tarjetas para celular y tablet */}
				<div className="d-lg-none p-2 p-sm-3 w-100 overflow-hidden">
					{loading &&
						publicaciones.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<span
								className="spinner-border spinner-border-sm me-2"
								aria-hidden="true"
							/>

							Cargando publicaciones...
						</div>
					) : publicaciones.length > 0 ? (
						<div className="d-flex flex-column gap-3 w-100">
							{publicaciones.map(
								(publication) => {
									const mainPhoto =
										getMainPhoto(
											publication
										);

									return (
										<article
											key={
												publication.id
											}
											className="card border shadow-sm w-100"
											style={{
												maxWidth:
													'100%',
												minWidth: 0,
												overflow:
													'hidden'
											}}
										>
											{mainPhoto && (
												<img
													src={
														mainPhoto
													}
													alt={getPublicationName(
														publication
													)}
													className="card-img-top"
													style={{
														width: '100%',
														height: '190px',
														objectFit:
															'cover'
													}}
												/>
											)}

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
																	publication.id
																}
															</span>

															<span
																className={`badge ${getStatusBadgeClass(
																	publication.estado
																)}`}
															>
																{publication.estado ||
																	'SIN ESTADO'}
															</span>
														</div>

														<h3 className="h6 fw-bold mb-1 text-break">
															{getPublicationName(
																publication
															)}
														</h3>

														<small className="text-muted">
															{publication.especie ||
																'Especie no registrada'}
															{' • '}
															{publication.sexo ||
																'Sexo no registrado'}
														</small>
													</div>
												</div>

												<dl className="row g-2 mb-0 small w-100">
													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Ubicación
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
														{publication.ubicacion ||
															'No registrada'}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Especie
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
														{publication.especie ||
															'No registrada'}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Sexo
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
														{publication.sexo ||
															'No registrado'}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Fecha
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
														{formatDate(
															publication.fechaPublicacion
														)}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Usuario
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
														{publication.usuario
															? [
																publication
																	.usuario
																	.nombre,
																publication
																	.usuario
																	.apellido
															]
																.filter(
																	Boolean
																)
																.join(
																	' '
																) ||
															'Usuario'
															: publication.userId
																? `Usuario #${publication.userId}`
																: 'No asociado'}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Descripción
													</dt>

													<dd className="col-12 col-sm-8 text-break mb-2">
														{publication.descripcion ||
															'Sin descripción'}
													</dd>

													<dt className="col-12 col-sm-4 text-muted fw-normal">
														Fotografías
													</dt>

													<dd className="col-12 col-sm-8 fw-semibold mb-0">
														{
															getPhotoList(
																publication
															)
																.length
														}{' '}
														fotografía(s)
													</dd>
												</dl>

												<div className="d-flex flex-column flex-sm-row gap-2 mt-3 w-100">
													<button
														type="button"
														className="btn btn-outline-secondary btn-sm flex-fill w-100"
														onClick={() =>
															handleEditPub(
																publication
															)
														}
													>
														<i className="bi bi-pencil-square me-1" />
														Editar
													</button>

													<button
														type="button"
														className="btn btn-outline-danger btn-sm flex-fill w-100"
														onClick={() =>
															handleDeleteClick(
																publication
															)
														}
													>
														<i className="bi bi-trash me-1" />
														Eliminar
													</button>
												</div>
											</div>
										</article>
									);
								}
							)}
						</div>
					) : (
						<div className="text-center py-5 text-muted">
							No se encontraron publicaciones.
						</div>
					)}
				</div>
			</div>

			{/* Modal para editar */}
			{showEditPubModal && (
				<div
					className="admin-dashboard-modal-backdrop"
					onClick={handleClosePubModal}
				>
					<div
						className="admin-dashboard-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="editPublicationModalTitle"
						onClick={(event) =>
							event.stopPropagation()
						}
					>
						<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-start gap-3">
							<div>
								<h5
									className="mb-1"
									id="editPublicationModalTitle"
								>
									Editar publicación
								</h5>

								<small className="text-muted">
									Actualiza la información de
									esta publicación.
								</small>
							</div>

							<button
								type="button"
								className="btn-close"
								onClick={
									handleClosePubModal
								}
								aria-label="Cerrar"
								disabled={saving}
							/>
						</div>

						<div className="admin-dashboard-modal-body">
							<form
								onSubmit={
									handlePubSubmit
								}
							>
								<div className="row">
									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="publicationName"
											className="form-label"
										>
											Nombre
										</label>

										<input
											id="publicationName"
											type="text"
											className="form-control"
											name="nombre"
											value={
												pubForm.nombre
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										/>
									</div>

									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="publicationLocation"
											className="form-label"
										>
											Ubicación
										</label>

										<input
											id="publicationLocation"
											type="text"
											className="form-control"
											name="ubicacion"
											value={
												pubForm.ubicacion
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										/>
									</div>
								</div>

								<div className="row">
									<div className="col-12 col-md-4 mb-3">
										<label
											htmlFor="publicationSpecies"
											className="form-label"
										>
											Especie
										</label>

										<select
											id="publicationSpecies"
											className="form-select"
											name="especie"
											value={
												pubForm.especie
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										>
											<option value="">
												Seleccionar
											</option>

											<option value="Perro">
												Perro
											</option>

											<option value="Gato">
												Gato
											</option>

											<option value="Otro">
												Otro
											</option>
										</select>
									</div>

									<div className="col-12 col-md-4 mb-3">
										<label
											htmlFor="publicationSex"
											className="form-label"
										>
											Sexo
										</label>

										<select
											id="publicationSex"
											className="form-select"
											name="sexo"
											value={
												pubForm.sexo
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										>
											<option value="">
												Seleccionar
											</option>

											<option value="Macho">
												Macho
											</option>

											<option value="Hembra">
												Hembra
											</option>

											<option value="No sé">
												No sé
											</option>
										</select>
									</div>

									<div className="col-12 col-md-4 mb-3">
										<label
											htmlFor="publicationStatus"
											className="form-label"
										>
											Estado
										</label>

										<select
											id="publicationStatus"
											className="form-select"
											name="estado"
											value={
												pubForm.estado
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										>
											<option value="">
												Seleccionar
											</option>

											<option value="Perdido">
												Perdido
											</option>

											<option value="Encontrado">
												Encontrado
											</option>

											<option value="ACTIVA">
												ACTIVA
											</option>

											<option value="RESUELTA">
												RESUELTA
											</option>

											<option value="CANCELADA">
												CANCELADA
											</option>
										</select>
									</div>
								</div>

								<div className="mb-3">
									<label
										htmlFor="publicationDescription"
										className="form-label"
									>
										Descripción
									</label>

									<textarea
										id="publicationDescription"
										className="form-control"
										rows={4}
										name="descripcion"
										value={
											pubForm.descripcion
										}
										onChange={
											handleInputChange
										}
										disabled={saving}
										required
									/>
								</div>

								<div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={
											handleClosePubModal
										}
										disabled={saving}
									>
										Cancelar
									</button>

									<button
										type="submit"
										className="btn btn-success"
										disabled={saving}
									>
										{saving ? (
											<>
												<span
													className="spinner-border spinner-border-sm me-2"
													aria-hidden="true"
												/>

												Guardando...
											</>
										) : (
											'Guardar cambios'
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Modal para confirmar eliminación */}
			{showDeleteModal && (
				<div
					className="admin-dashboard-modal-backdrop"
					onClick={handleCloseDeleteModal}
				>
					<div
						className="admin-dashboard-modal"
						style={{
							maxWidth: '420px'
						}}
						role="dialog"
						aria-modal="true"
						aria-labelledby="deletePublicationModalTitle"
						onClick={(event) =>
							event.stopPropagation()
						}
					>
						<div
							className="admin-dashboard-modal-header d-flex justify-content-between align-items-center"
							style={{
								backgroundColor: '#eef7ee',
								borderBottom:
									'1px solid #d1e7dd'
							}}
						>
							<h5
								className="mb-0 text-success"
								id="deletePublicationModalTitle"
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
								backgroundColor: '#f9fdf9'
							}}
						>
							<div className="mb-3">
								<i className="bi bi-exclamation-triangle-fill text-danger display-5" />
							</div>

							<p className="mb-2">
								¿Estás seguro de que deseas
								eliminar la publicación:
							</p>

							<p className="fw-bold mb-3 text-break">
								{pubToDelete
									? getPublicationName(
										pubToDelete
									)
									: 'seleccionada'}
							</p>

							<p className="mb-0 text-danger">
								Esta acción no se puede deshacer.
							</p>
						</div>

						<div
							className="d-flex flex-column-reverse flex-sm-row justify-content-center gap-2 p-3"
							style={{
								backgroundColor: '#f9fdf9',
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
								onClick={confirmDelete}
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

export default PublicationsTable;