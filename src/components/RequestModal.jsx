import React, { useState } from "react";

export const RequestModal = ({ request, onClose }) => {

	const [response, setResponse] = useState("");

	return (

		<div className="admin-dashboard-modal-backdrop">
			<div
				className="admin-dashboard-modal"
				style={{ maxWidth: "900px" }}
			>
				<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
					<div>
						<h5> Solicitud #{request.id}</h5>

						<small className="text-muted">
							{request.usuario}
						</small>
					</div>
					<button
						className="btn btn-outline-secondary btn-sm"
						onClick={onClose}
					>
						Cerrar
					</button>
				</div>

				<div className="admin-dashboard-modal-body">
					<div className="row">
						<div className="col-md-6">
							<h6 className="fw-bold mb-3">Información del Usuario</h6>
							<p><b>Nombre:</b> {request.usuario}</p>
							<p><b>Email:</b> {request.email}</p>
							<p><b>Teléfono:</b> {request.telefono}</p>
							<p><b>Rol:</b> {request.rolActual}</p>
						</div>

						<div className="col-md-6">
							<h6 className="fw-bold mb-3">Organización</h6>
							<p><b>Nombre:</b> {request.nombreOrganizacion}</p>
							<p><b>Tipo:</b> {request.tipoOrganizacion}</p>
							<p><b>Correo:</b> {request.correoInstitucional}</p>
							<p><b>Dirección:</b> {request.direccion}</p>
							<p><b>Sitio Web:</b> {request.sitioWeb || "No posee"}</p>
						</div>
					</div>
					<hr />

					<div className="mb-3">
						<label className="fw-bold">
							Descripción
						</label>

						<textarea
							className="form-control"
							rows={4}
							value={request.descripcion}
							disabled
						/>
					</div>

					<div className="mb-3">
						<label className="fw-bold">
							Motivo de la solicitud
						</label>

						<textarea
							className="form-control"
							rows={4}
							value={request.motivo}
							disabled
						/>
					</div>

					{
						request.estado === "PENDIENTE"
							?
							<>
								<div className="mb-3">
									<label className="fw-bold">
										Respuesta del Administrador
									</label>

									<textarea
										className="form-control"
										rows={4}
										value={response}
										onChange={(e) => setResponse(e.target.value)}
										placeholder="Escriba una respuesta para el usuario..."
									/>
								</div>

								<div className="d-flex justify-content-end gap-2">
									<button
										className="btn btn-danger"
									>
										Rechazar
									</button>

									<button
										className="btn btn-success"
									>
										Aprobar
									</button>
								</div>
							</>
							:
							<>
								<label className="fw-bold">
									Respuesta del Administrador
								</label>

								<textarea
									className="form-control"
									rows={4}
									value={request.respuestaAdministrador}
									disabled
								/>
							</>
					}
				</div>
			</div>
		</div>
	);
};