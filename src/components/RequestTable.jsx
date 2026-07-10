import React, { useState } from 'react';
import {RequestModal} from './RequestModal';

export const RequestTable = () => {

	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showModal, setShowModal] = useState(false);

	// Datos de prueba
	const [requests] = useState([
		{
			id: 1,
			usuario: "Juan Pérez",
			email: "juan@gmail.com",
			telefono: "+56912345678",
			rolActual: "CLIENTE",

			nombreOrganizacion: "Veterinaria San Martín",
			tipoOrganizacion: "VETERINARIA",
			correoInstitucional: "contacto@vetsanmartin.cl",
			direccion: "Av. Principal 123",
			sitioWeb: "https://vetsanmartin.cl",

			descripcion:
				"Somos una clínica veterinaria dedicada al rescate y tratamiento de animales.",

			motivo:
				"Queremos publicar mascotas encontradas y colaborar con la comunidad.",

			estado: "PENDIENTE",

			fechaSolicitud: "2026-07-05"
		},

		{
			id: 2,
			usuario: "María González",
			email: "maria@gmail.com",
			telefono: "+56987654321",
			rolActual: "CLIENTE",

			nombreOrganizacion: "Refugio Huellitas",
			tipoOrganizacion: "REFUGIO",
			correoInstitucional: "info@huellitas.cl",
			direccion: "Los Pinos 340",
			sitioWeb: "",

			descripcion:
				"Refugio dedicado al rescate de perros y gatos.",

			motivo:
				"Deseamos colaborar en la búsqueda de mascotas perdidas.",

			estado: "APROBADA",

			fechaSolicitud: "2026-07-03",

			respuestaAdministrador:
				"Solicitud aprobada correctamente."
		}
	]);

	const openModal = (request) => {
		setSelectedRequest(request);
		setShowModal(true);
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

		<div className="card shadow-sm border-0">

			<div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">

				<h2 className="h6 mb-0">

					Solicitudes de Organización

				</h2>

				<button className="btn btn-outline-success">

					Actualizar

				</button>

			</div>

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
							<th></th>

						</tr>

					</thead>

					<tbody>

						{requests.map((request) => (

							<tr key={request.id}>

								<td>{request.id}</td>

								<td>{request.usuario}</td>

								<td>{request.nombreOrganizacion}</td>

								<td>

									<span className="badge bg-light text-dark">

										{request.tipoOrganizacion}

									</span>

								</td>

								<td>

									<span className={`badge ${getStatusBadge(request.estado)}`}>

										{request.estado}

									</span>

								</td>

								<td>

									{request.fechaSolicitud}

								</td>

								<td>

									<button

										className="btn btn-outline-primary btn-sm"

										onClick={() => openModal(request)}

									>

										Ver Solicitud

									</button>

								</td>

							</tr>

						))}

					</tbody>

				</table>

			</div>

			{

				showModal && selectedRequest &&

				<RequestModal

					request={selectedRequest}

					onClose={() => setShowModal(false)}

				/>

			}

		</div>

	);

};