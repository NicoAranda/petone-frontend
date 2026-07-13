import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const UsersTable = ({
	usuarios = [],
	fetchUsuarios,
	API_USERS,
	loading
}) => {
	const initialUserForm = {
		id: null,
		nombre: '',
		apellido: '',
		email: '',
		rut: '',
		telefono: '',
		rol: ''
	};

	const [userForm, setUserForm] = useState(initialUserForm);
	const [showEditModal, setShowEditModal] = useState(false);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (showEditModal || showDeleteModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [showEditModal, showDeleteModal]);

	const getErrorMessage = async (response, defaultMessage) => {
		try {
			const data = await response.json();

			return (
				data?.message ||
				data?.error ||
				data?.detail ||
				defaultMessage
			);
		} catch {
			return defaultMessage;
		}
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setUserForm((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleUserSubmit = async (event) => {
		event.preventDefault();

		if (!userForm.id) {
			toast.error('No se pudo identificar al usuario.');
			return;
		}

		const token = localStorage.getItem('token');

		if (!token) {
			toast.error(
				'Necesitas iniciar sesión para editar usuarios.'
			);

			return;
		}

		setSaving(true);

		try {
			const response = await fetch(
				`${API_USERS}/${userForm.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						nombre: userForm.nombre.trim(),
						apellido: userForm.apellido.trim(),
						email: userForm.email.trim(),
						rut: userForm.rut.trim(),
						telefono: userForm.telefono.trim(),
						rol: userForm.rol
					})
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al actualizar el usuario.'
				);

				throw new Error(message);
			}

			await fetchUsuarios();

			toast.success(
				'Usuario actualizado con éxito.'
			);

			handleCloseModal();
		} catch (error) {
			console.error(
				'Error updating usuario:',
				error
			);

			toast.error(
				error.message ||
				'Error al actualizar usuario.',
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

	const handleEditUser = (user) => {
		setUserForm({
			id: user.id ?? null,
			nombre: user.nombre ?? '',
			apellido: user.apellido ?? '',
			email: user.email ?? '',
			rut: user.rut ?? '',
			telefono: user.telefono ?? '',
			rol: user.rol ?? ''
		});

		setShowEditModal(true);
	};

	const handleDeleteClick = (user) => {
		setUserToDelete(user);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!userToDelete?.id) {
			return;
		}

		const token = localStorage.getItem('token');

		if (!token) {
			toast.error(
				'Necesitas iniciar sesión para eliminar usuarios.'
			);

			return;
		}

		setDeleting(true);

		try {
			const response = await fetch(
				`${API_USERS}/${userToDelete.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				const message = await getErrorMessage(
					response,
					'Error al eliminar el usuario.'
				);

				throw new Error(message);
			}

			await fetchUsuarios();

			toast.success(
				'Usuario eliminado correctamente.'
			);

			handleCloseDeleteModal();
		} catch (error) {
			console.error(
				'Error deleting usuario:',
				error
			);

			toast.error(
				error.message ||
				'Error al eliminar usuario.',
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

	const handleCloseModal = () => {
		if (saving) {
			return;
		}

		setShowEditModal(false);
		setUserForm(initialUserForm);
	};

	const handleCloseDeleteModal = () => {
		if (deleting) {
			return;
		}

		setShowDeleteModal(false);
		setUserToDelete(null);
	};

	const getRoleBadgeClass = (rol) => {
		const roleClasses = {
			ADMIN: 'bg-danger',
			ORGANIZACION: 'bg-primary',
			CLIENTE: 'bg-success'
		};

		return roleClasses[rol] || 'bg-secondary';
	};

	const getFullName = (user) => {
		const fullName = [
			user.nombre,
			user.apellido
		]
			.filter(Boolean)
			.join(' ')
			.trim();

		return fullName || 'Nombre no registrado';
	};

	return (
		<>
			<div className="card shadow-sm border-0">
				<div className="card-header bg-white border-bottom-0 py-3 px-3 px-md-4">
					<div className="d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3">
						<div>
							<h2 className="h6 mb-1">
								Usuarios
							</h2>

							<small className="text-muted">
								Administra los datos y roles de los
								usuarios registrados.
							</small>
						</div>

						<button
							type="button"
							className="btn btn-outline-success w-100 w-md-auto"
							onClick={fetchUsuarios}
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
								'Actualizar usuarios'
							)}
						</button>
					</div>
				</div>

				{/* Vista de escritorio */}
				<div className="table-responsive d-none d-lg-block">
					<table className="table align-middle mb-0 custom-green-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Nombre</th>
								<th>Correo</th>
								<th>RUT</th>
								<th>Teléfono</th>
								<th>Rol</th>
								<th className="text-end">
									Acciones
								</th>
							</tr>
						</thead>

						<tbody>
							{usuarios.length > 0 ? (
								usuarios.map((user) => (
									<tr key={user.id}>
										<td>{user.id}</td>

										<td>
											<div className="d-flex flex-column">
												<span className="fw-semibold">
													{getFullName(user)}
												</span>

												<small className="text-muted">
													ID de usuario: {user.id}
												</small>
											</div>
										</td>

										<td>
											{user.email ||
												'No registrado'}
										</td>

										<td className="text-nowrap">
											{user.rut ||
												'No registrado'}
										</td>

										<td className="text-nowrap">
											{user.telefono ||
												'No registrado'}
										</td>

										<td>
											<span
												className={`badge ${getRoleBadgeClass(
													user.rol
												)}`}
											>
												{user.rol ||
													'SIN ROL'}
											</span>
										</td>

										<td>
											<div className="d-flex justify-content-end gap-2">
												<button
													type="button"
													className="btn btn-sm btn-outline-secondary"
													onClick={() =>
														handleEditUser(
															user
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
															user
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
										style={{
											backgroundColor:
												'#f9fdf9'
										}}
									>
										{loading
											? 'Cargando usuarios...'
											: 'No se encontraron usuarios.'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Vista móvil y tablet */}
				<div className="d-lg-none p-2 p-sm-3 w-100 overflow-hidden">
					{loading && usuarios.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<div
								className="spinner-border spinner-border-sm me-2"
								role="status"
							>
								<span className="visually-hidden">
									Cargando usuarios...
								</span>
							</div>

							Cargando usuarios...
						</div>
					) : usuarios.length > 0 ? (
						<div className="d-flex flex-column gap-3">
							{usuarios.map((user) => (
								<article
									key={user.id}
									className="card border shadow-sm w-100"
									style={{
										maxWidth: '100%',
										minWidth: 0
									}}
								>
									<div className="card-body p-3 w-100"
										style={{
											minWidth: 0,
											overflow: 'hidden'
										}}
									>
										<div className="d-flex justify-content-between align-items-start gap-3 mb-3">
											<div>
												<div className="d-flex align-items-center gap-2 mb-1">
													<span className="badge bg-light text-dark border">
														#{user.id}
													</span>

													<span
														className={`badge ${getRoleBadgeClass(
															user.rol
														)}`}
													>
														{user.rol ||
															'SIN ROL'}
													</span>
												</div>

												<h3 className="h6 fw-bold mb-0">
													{getFullName(
														user
													)}
												</h3>
											</div>

											<div className="dropdown">
												<button
													type="button"
													className="btn btn-sm btn-light border"
													data-bs-toggle="dropdown"
													aria-expanded="false"
													aria-label="Acciones del usuario"
												>
													<i className="bi bi-three-dots-vertical" />
												</button>

												<ul className="dropdown-menu dropdown-menu-end">
													<li>
														<button
															type="button"
															className="dropdown-item"
															onClick={() =>
																handleEditUser(
																	user
																)
															}
														>
															<i className="bi bi-pencil-square me-2" />
															Editar
														</button>
													</li>

													<li>
														<button
															type="button"
															className="dropdown-item text-danger"
															onClick={() =>
																handleDeleteClick(
																	user
																)
															}
														>
															<i className="bi bi-trash me-2" />
															Eliminar
														</button>
													</li>
												</ul>
											</div>
										</div>

										<dl className="row mb-0 small w-100">
											<dt className="col-4 col-sm-4 text-muted fw-normal">
												Nombre
											</dt>

											<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
												{user.nombre ||
													'No registrado'}
											</dd>

											<dt className="col-4 col-sm-4 text-muted fw-normal">
												Apellido
											</dt>

											<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
												{user.apellido ||
													'No registrado'}
											</dd>

											<dt className="col-4 col-sm-4 text-muted fw-normal">
												Correo
											</dt>

											<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
												{user.email ||
													'No registrado'}
											</dd>

											<dt className="col-4 col-sm-4 text-muted fw-normal">
												RUT
											</dt>

											<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
												{user.rut ||
													'No registrado'}
											</dd>

											<dt className="col-4 col-sm-4 text-muted fw-normal">
												Teléfono
											</dt>

											<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
												{user.telefono ||
													'No registrado'}
											</dd>
										</dl>

										<div className="d-flex gap-2 mt-3">
											<button
												type="button"
												className="btn btn-outline-secondary btn-sm flex-fill"
												onClick={() =>
													handleEditUser(
														user
													)
												}
											>
												<i className="bi bi-pencil-square me-1" />
												Editar
											</button>

											<button
												type="button"
												className="btn btn-outline-danger btn-sm flex-fill"
												onClick={() =>
													handleDeleteClick(
														user
													)
												}
											>
												<i className="bi bi-trash me-1" />
												Eliminar
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className="text-center py-5 text-muted">
							No se encontraron usuarios.
						</div>
					)}
				</div>
			</div>

			{/* Modal de edición */}
			{showEditModal && (
				<div
					className="admin-dashboard-modal-backdrop"
					onClick={handleCloseModal}
				>
					<div
						className="admin-dashboard-modal"
						role="dialog"
						aria-modal="true"
						aria-labelledby="editUserModalTitle"
						onClick={(event) =>
							event.stopPropagation()
						}
					>
						<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-start gap-3">
							<div>
								<h5
									className="mb-1"
									id="editUserModalTitle"
								>
									Editar usuario
								</h5>

								<small className="text-muted">
									Actualiza la información del
									usuario seleccionado.
								</small>
							</div>

							<button
								type="button"
								className="btn-close"
								onClick={handleCloseModal}
								aria-label="Cerrar"
								disabled={saving}
							/>
						</div>

						<div className="admin-dashboard-modal-body">
							<form onSubmit={handleUserSubmit}>
								<div className="row">
									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="editUserName"
											className="form-label"
										>
											Nombre
										</label>

										<input
											id="editUserName"
											type="text"
											className="form-control"
											name="nombre"
											value={
												userForm.nombre
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											autoFocus
											required
										/>
									</div>

									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="editUserLastName"
											className="form-label"
										>
											Apellido
										</label>

										<input
											id="editUserLastName"
											type="text"
											className="form-control"
											name="apellido"
											value={
												userForm.apellido
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										/>
									</div>
								</div>

								<div className="mb-3">
									<label
										htmlFor="editUserEmail"
										className="form-label"
									>
										Correo electrónico
									</label>

									<input
										id="editUserEmail"
										type="email"
										className="form-control"
										name="email"
										value={userForm.email}
										onChange={
											handleInputChange
										}
										disabled={saving}
										required
									/>
								</div>

								<div className="row">
									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="editUserRut"
											className="form-label"
										>
											RUT
										</label>

										<input
											id="editUserRut"
											type="text"
											className="form-control"
											name="rut"
											value={userForm.rut}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										/>
									</div>

									<div className="col-12 col-md-6 mb-3">
										<label
											htmlFor="editUserPhone"
											className="form-label"
										>
											Teléfono
										</label>

										<input
											id="editUserPhone"
											type="tel"
											className="form-control"
											name="telefono"
											value={
												userForm.telefono
											}
											onChange={
												handleInputChange
											}
											disabled={saving}
											required
										/>
									</div>
								</div>

								<div className="mb-3">
									<label
										htmlFor="editUserRole"
										className="form-label"
									>
										Rol
									</label>

									<select
										id="editUserRole"
										className="form-select"
										name="rol"
										value={userForm.rol}
										onChange={
											handleInputChange
										}
										disabled={saving}
										required
									>
										<option value="" disabled>
											Selecciona una opción
										</option>

										<option value="CLIENTE">
											CLIENTE
										</option>

										<option value="ORGANIZACION">
											ORGANIZACION
										</option>

										<option value="ADMIN">
											ADMIN
										</option>
									</select>
								</div>

								<div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={
											handleCloseModal
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

			{/* Modal de eliminación */}
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
						aria-labelledby="deleteUserModalTitle"
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
								id="deleteUserModalTitle"
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

							<p
								className="mb-2"
								style={{
									color: '#2c3e2e'
								}}
							>
								¿Estás seguro de que deseas
								eliminar a:
							</p>

							<p className="fw-bold mb-3">
								{userToDelete
									? getFullName(
										userToDelete
									)
									: 'este usuario'}
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

export default UsersTable;