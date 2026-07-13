import React, { useEffect, useState } from "react";
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

	const usuario = request?.usuario || {};

	useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	const getErrorMessage = async (resp) => {
		try {
			const data = await resp.json();

			return (
				data?.message ||
				data?.error ||
				data?.detail ||
				"Ocurrió un error."
			);
		} catch {
			try {
				const text = await resp.text();

				return text || "Ocurrió un error.";
			} catch {
				return "Ocurrió un error.";
			}
		}
	};

	const sendDecision = async (accion) => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");

			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error(
					"No existe una sesión iniciada."
				);
			}

			const tokenParts = token.split(".");

			if (tokenParts.length !== 3) {
				throw new Error(
					"El token de sesión no es válido."
				);
			}

			const payloadBase64 = tokenParts[1]
				.replace(/-/g, "+")
				.replace(/_/g, "/");

			const payload = JSON.parse(
				atob(payloadBase64)
			);

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

			if (
				accion === "rechazar" &&
				!response.trim()
			) {
				throw new Error(
					"Debes escribir el motivo del rechazo."
				);
			}

			const url =
				`${API}/solicitudes-organizacion/` +
				`${encodeURIComponent(request.id)}/` +
				`${encodeURIComponent(accion)}` +
				`?administradorId=${encodeURIComponent(
					administradorId
				)}` +
				`&respuesta=${encodeURIComponent(
					response.trim()
				)}`;

			const resp = await fetch(url, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!resp.ok) {
				throw new Error(
					await getErrorMessage(resp)
				);
			}

			setSuccess(
				accion === "aprobar"
					? "Solicitud aprobada correctamente."
					: "Solicitud rechazada correctamente."
			);

			window.setTimeout(async () => {
				if (onRequestUpdated) {
					await onRequestUpdated();
				} else {
					onClose();
				}
			}, 800);
		} catch (err) {
			console.error(
				"Error procesando solicitud:",
				err
			);

			setError(
				err.message ||
				"Ocurrió un error al procesar la solicitud."
			);
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status) => {
		const normalizedStatus =
			status?.toUpperCase();

		const map = {
			PENDIENTE:
				"bg-warning text-dark",
			APROBADA: "bg-success",
			RECHAZADA: "bg-danger"
		};

		return (
			map[normalizedStatus] ||
			"bg-secondary"
		);
	};

	const getStatusLabel = (status) => {
		const normalizedStatus =
			status?.toUpperCase();

		const map = {
			PENDIENTE: "Pendiente",
			APROBADA: "Aprobada",
			RECHAZADA: "Rechazada"
		};

		return (
			map[normalizedStatus] ||
			status ||
			"Sin estado"
		);
	};

	const getTypeLabel = (type) => {
		const normalizedType =
			type?.toUpperCase();

		const map = {
			VETERINARIA:
				"Clínica Veterinaria",
			REFUGIO: "Refugio",
			MUNICIPALIDAD:
				"Municipalidad",
			FUNDACION: "Fundación",
			OTRO: "Otro"
		};

		return (
			map[normalizedType] ||
			type ||
			"No registrado"
		);
	};

	const getUserFullName = () => {
		const fullName = `${usuario.nombre || ""
			} ${usuario.apellido || ""}`.trim();

		return (
			fullName ||
			`Usuario #${request?.usuarioId ??
			"desconocido"
			}`
		);
	};

	return (
		<div
			className="admin-dashboard-modal-backdrop"
			onClick={onClose}
		>
			<div
				className="admin-dashboard-modal request-modal-responsive"
				role="dialog"
				aria-modal="true"
				aria-labelledby="requestModalTitle"
				onClick={(event) =>
					event.stopPropagation()
				}
				style={{
					maxWidth: "900px",
					width: "calc(100% - 24px)",
					maxHeight: "calc(100dvh - 24px)",
					overflow: "hidden"
				}}
			>
				<div className="admin-dashboard-modal-header d-flex justify-content-between align-items-start gap-3">
					<div style={{ minWidth: 0 }}>
						<h5
							className="mb-1 text-break"
							id="requestModalTitle"
						>
							Solicitud #{request.id}
						</h5>

						<small className="text-muted text-break d-block">
							{getUserFullName()}
						</small>
					</div>

					<button
						type="button"
						className="btn-close flex-shrink-0"
						onClick={onClose}
						disabled={loading}
						aria-label="Cerrar"
					/>
				</div>

				<div
					className="admin-dashboard-modal-body"
					style={{
						overflowY: "auto",
						maxHeight:
							"calc(100dvh - 110px)"
					}}
				>
					<div className="row g-4">
						<div className="col-12 col-md-6">
							<div className="border rounded-3 p-3 h-100 bg-light">
								<h6 className="fw-bold mb-3">
									Información del usuario
								</h6>

								<dl className="row g-2 mb-0 small">
									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Nombre
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{getUserFullName()}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Email
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{usuario.email ||
											"No registrado"}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Teléfono
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{usuario.telefono ||
											request.telefono ||
											"No registrado"}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Rol
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-0">
										{usuario.rol ||
											"No registrado"}
									</dd>
								</dl>
							</div>
						</div>

						<div className="col-12 col-md-6">
							<div className="border rounded-3 p-3 h-100 bg-light">
								<h6 className="fw-bold mb-3">
									Información de la organización
								</h6>

								<dl className="row g-2 mb-0 small">
									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Nombre
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{request.nombreOrganizacion ||
											"No registrado"}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Tipo
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{getTypeLabel(
											request.tipoOrganizacion
										)}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Correo
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{request.correoInstitucional ||
											"No registrado"}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Dirección
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{request.direccion ||
											"No registrada"}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Sitio web
									</dt>

									<dd className="col-12 col-sm-8 fw-semibold text-break mb-2">
										{request.sitioWeb ? (
											<a
												href={
													request.sitioWeb
												}
												target="_blank"
												rel="noreferrer"
												className="text-break"
											>
												{request.sitioWeb}
											</a>
										) : (
											"No posee"
										)}
									</dd>

									<dt className="col-12 col-sm-4 text-muted fw-normal">
										Estado
									</dt>

									<dd className="col-12 col-sm-8 mb-0">
										<span
											className={`badge ${getStatusBadge(
												request.estado
											)}`}
										>
											{getStatusLabel(
												request.estado
											)}
										</span>
									</dd>
								</dl>
							</div>
						</div>
					</div>

					<hr className="my-4" />

					<div className="mb-3">
						<label className="form-label fw-bold">
							Descripción
						</label>

						<div className="p-3 bg-light border rounded text-break">
							{request.descripcion ||
								"Sin descripción"}
						</div>
					</div>

					<div className="mb-3">
						<label className="form-label fw-bold">
							Motivo de la solicitud
						</label>

						<div className="p-3 bg-light border rounded text-break">
							{request.motivoSolicitud ||
								request.motivo ||
								"Sin motivo registrado"}
						</div>
					</div>

					{error && (
						<div
							className="alert alert-danger"
							role="alert"
						>
							{error}
						</div>
					)}

					{success && (
						<div
							className="alert alert-success"
							role="alert"
						>
							{success}
						</div>
					)}

					{request.estado ===
						"PENDIENTE" ? (
						<>
							<div className="mb-3">
								<label
									htmlFor="administratorResponse"
									className="form-label fw-bold"
								>
									Respuesta del administrador
								</label>

								<textarea
									id="administratorResponse"
									className="form-control"
									rows={5}
									value={response}
									onChange={(event) =>
										setResponse(
											event.target.value
										)
									}
									placeholder="Escribe una respuesta para el usuario..."
									disabled={loading}
								/>
							</div>

							<div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
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
									onClick={() =>
										sendDecision(
											"rechazar"
										)
									}
									disabled={
										loading ||
										!response.trim()
									}
								>
									{loading ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												aria-hidden="true"
											/>
											Procesando...
										</>
									) : (
										"Rechazar"
									)}
								</button>

								<button
									type="button"
									className="btn btn-success"
									onClick={() =>
										sendDecision(
											"aprobar"
										)
									}
									disabled={loading}
								>
									{loading ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												aria-hidden="true"
											/>
											Procesando...
										</>
									) : (
										"Aprobar"
									)}
								</button>
							</div>
						</>
					) : (
						<div className="mb-3">
							<label className="form-label fw-bold">
								Respuesta del administrador
							</label>

							<div className="p-3 bg-light border rounded text-break">
								{request.respuestaAdministrador ||
									"No se registró una respuesta."}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};