import React, { useState } from "react";
import { API } from "../lib/api";

export const RequestModal = ({
	request,
	onClose,
	onRequestUpdated
}) => {

	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const usuario = request.usuario || {};

	const getErrorMessage = async (resp) => {
		try {
			const data = await resp.json();
			return (
				data.message ||
				data.error ||
				data.detail ||
				"Ocurrió un error."
			);
		}
		catch {
			return "Ocurrió un error.";
		}
	};

	const sendDecision = async (accion) => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");

			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No existe una sesión iniciada.");
			}

			const tokenParts = token.split(".");

			if (tokenParts.length !== 3) {
				throw new Error("El token de sesión no es válido.");
			}

			const payloadBase64 = tokenParts[1]
				.replace(/-/g, "+")
				.replace(/_/g, "/");

			const payload = JSON.parse(atob(payloadBase64));
			const administradorId = payload.id;

			if (
				administradorId === undefined ||
				administradorId === null
			) {
				throw new Error(
					"No se pudo obtener el ID del administrador desde el token."
				);
			}

			if (
				request?.id === undefined ||
				request?.id === null
			) {
				throw new Error(
					"No se pudo obtener el ID de la solicitud."
				);
			}

			if (accion === "rechazar" && !response.trim()) {
				throw new Error(
					"Debes escribir el motivo del rechazo."
				);
			}

			const url =
				`${API}/solicitudes-organizacion/` +
				`${encodeURIComponent(request.id)}/` +
				`${encodeURIComponent(accion)}` +
				`?administradorId=${encodeURIComponent(administradorId)}` +
				`&respuesta=${encodeURIComponent(response.trim())}`;

			const resp = await fetch(url, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!resp.ok) {
				throw new Error(await getErrorMessage(resp));
			}

			setSuccess(
				accion === "aprobar"
					? "Solicitud aprobada correctamente."
					: "Solicitud rechazada correctamente."
			);

			setTimeout(async () => {
				if (onRequestUpdated) {
					await onRequestUpdated();
				} else {
					onClose();
				}
			}, 800);
		} catch (err) {
			console.error("Error procesando solicitud:", err);

			setError(
				err.message ||
				"Ocurrió un error al procesar la solicitud."
			);
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status) => {
		const map = {
			PENDIENTE: "bg-warning text-dark",
			APROBADA: "bg-success",
			RECHAZADA: "bg-danger"
		};
		return map[status] || "bg-secondary";
	};

	return (
		<div className="admin-dashboard-modal-backdrop">
			<div
				className="admin-dashboard-modal"
				style={{ maxWidth: "900px" }}
			>
				<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
					<div>
						<h5>
							Solicitud #{request.id}
						</h5>
						<small className="text-muted">
							{usuario.nombre} {usuario.apellido}
						</small>
					</div>

					<button
						className="btn btn-outline-secondary btn-sm"
						onClick={onClose}
						disabled={loading}
					>
						Cerrar
					</button>
				</div>

				<div className="admin-dashboard-modal-body">
					<div className="row">
						<div className="col-md-6">
							<h6 className="fw-bold mb-3">
								Información del Usuario
							</h6>
							<p>
								<b>Nombre:</b>{" "}
								{usuario.nombre} {usuario.apellido}
							</p>

							<p>
								<b>Email:</b>{" "}
								{usuario.email}
							</p>

							<p>
								<b>Teléfono:</b>{" "}
								{usuario.telefono}
							</p>

							<p>
								<b>Rol:</b>{" "}
								{usuario.rol}
							</p>
						</div>

						<div className="col-md-6">
							<h6 className="fw-bold mb-3">
								Información de la Organización
							</h6>

							<p>
								<b>Nombre:</b>{" "}
								{request.nombreOrganizacion}
							</p>

							<p>
								<b>Tipo:</b>{" "}
								{request.tipoOrganizacion}
							</p>

							<p>
								<b>Correo:</b>{" "}
								{request.correoInstitucional}
							</p>

							<p>
								<b>Dirección:</b>{" "}
								{request.direccion}
							</p>

							<p>
								<b>Sitio Web:</b>{" "}
								{request.sitioWeb || "No posee"}
							</p>

							<p>
								<b>Estado:</b>{" "}
								<span className={`badge ${getStatusBadge(request.estado)}`}>
									{request.estado}
								</span>
							</p>
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
							value={request.descripcion || ""}
							disabled
						/>
					</div>

					<div className="mb-3">
						<label className="fw-bold">
							Motivo de la Solicitud
						</label>

						<textarea
							className="form-control"
							rows={4}
							value={request.motivoSolicitud || request.motivo || ""}
							disabled
						/>
					</div>
					{error && (
						<div className="alert alert-danger" role="alert">
							{error}
						</div>
					)}

					{success && (
						<div className="alert alert-success" role="alert">
							{success}
						</div>
					)}

					{request.estado === "PENDIENTE" ? (
						<>
							<div className="mb-3">
								<label className="fw-bold mb-2">
									Respuesta del Administrador
								</label>

								<textarea
									className="form-control"
									rows={4}
									value={response}
									onChange={(e) => setResponse(e.target.value)}
									placeholder="Escriba una respuesta para el usuario..."
									disabled={loading}
								/>
							</div>

							<div className="d-flex justify-content-end gap-2">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={onClose}
									disabled={loading}
								>
									Cancelar
								</button>

								<button
									type="button"
									className="btn btn-danger"
									onClick={() => sendDecision("rechazar")}
									disabled={loading || !response.trim()}
								>
									{loading ? "Procesando..." : "Rechazar"}
								</button>

								<button
									type="button"
									className="btn btn-success"
									onClick={() => sendDecision("aprobar")}
									disabled={loading}
								>
									{loading ? "Procesando..." : "Aprobar"}
								</button>
							</div>
						</>
					) : (
						<div className="mb-3">
							<label className="fw-bold mb-2">
								Respuesta del Administrador
							</label>

							<textarea
								className="form-control"
								rows={4}
								value={
									request.respuestaAdministrador ||
									"No se registró una respuesta."
								}
								disabled
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};