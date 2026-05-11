import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const ReportsTable = ({ fetchReports, API_REPORTS = 'http://localhost:8080/api/reportes' }) => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [responseStatus, setResponseStatus] = useState('RESUELTO');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_REPORTS);
            if (!response.ok) throw new Error('Error al cargar reportes');
            const data = await response.json();
            setReportes(Array.isArray(data) ? data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)) : []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar reportes');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResponse = (report) => {
        setSelectedReport(report);
        setResponseText('');
        setResponseStatus('RESUELTO');
        setShowResponseModal(true);
    };

    const handleSubmitResponse = async () => {
        if (!responseText.trim()) {
            toast.error('La respuesta no puede estar vacía');
            return;
        }

        try {
            const response = await fetch(`${API_REPORTS}/${selectedReport.id}/responder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    respuesta: responseText,
                    estado: responseStatus
                })
            });

            if (!response.ok) throw new Error('Error al enviar respuesta');

            toast.success('Respuesta enviada correctamente');
            setShowResponseModal(false);
            loadReports();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar respuesta');
        }
    };

    const handleChangeStatus = async (reportId, newStatus) => {
        try {
            const response = await fetch(`${API_REPORTS}/${reportId}/estado?nuevoEstado=${newStatus}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            toast.success('Estado actualizado');
            loadReports();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const handleDeleteReport = async (reportId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) return;

        try {
            const response = await fetch(`${API_REPORTS}/${reportId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar reporte');

            toast.success('Reporte eliminado');
            loadReports();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar reporte');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDIENTE': 'bg-warning',
            'EN_REVISION': 'bg-info',
            'RESUELTO': 'bg-success',
            'RECHAZADO': 'bg-danger'
        };
        return statusMap[status] || 'bg-secondary';
    };

    const getTypeLabel = (type) => {
        const typeMap = {
            'ABUSO': 'Abuso o acoso',
            'IMAGENES_SENSIBLES': 'Imágenes sensibles',
            'CONTENIDO_INAPROPIADO': 'Contenido inapropiado',
            'INFORMACION_FALSA': 'Información falsa',
            'OTRO': 'Otro'
        };
        return typeMap[type] || type;
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                <h2 className="h6 mb-0">Reportes de Publicaciones</h2>
                <button className="btn btn-outline-success" onClick={loadReports} disabled={loading}>
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            <div className="table-responsive">
                <table className="table align-middle mb-0 custom-green-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Publicación</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportes.length > 0 ? (
                            reportes.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.id}</td>
                                    <td>{report.publicacionId}</td>
                                    <td>
                                        <span className="badge bg-light text-dark">
                                            {getTypeLabel(report.tipo)}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={`form-select form-select-sm ${getStatusBadge(report.estado)} text-white`}
                                            value={report.estado}
                                            onChange={(e) => handleChangeStatus(report.id, e.target.value)}
                                            style={{ width: '130px' }}
                                        >
                                            <option value="PENDIENTE">Pendiente</option>
                                            <option value="EN_REVISION">En revisión</option>
                                            <option value="RESUELTO">Resuelto</option>
                                            <option value="RECHAZADO">Rechazado</option>
                                        </select>
                                    </td>
                                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {report.descripcion}
                                    </td>
                                    <td style={{ fontSize: '12px' }}>
                                        {new Date(report.fechaReporte).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleOpenResponse(report)}
                                            >
                                                Responder
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteReport(report.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    {loading ? 'Cargando reportes...' : 'No hay reportes.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL RESPONDER REPORTE */}
            {showResponseModal && selectedReport && (
                <div className="admin-dashboard-modal-backdrop">
                    <div className="admin-dashboard-modal">
                        <div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Responder Reporte #{selectedReport.id}</h5>
                                <small className="text-muted">Reporte: {getTypeLabel(selectedReport.tipo)}</small>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setShowResponseModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="admin-dashboard-modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Descripción del Reporte</label>
                                <p className="text-muted">{selectedReport.descripcion}</p>
                            </div>

                            {selectedReport.respuestaAdmin && (
                                <div className="mb-3 p-3 bg-light rounded">
                                    <label className="form-label fw-bold">Respuesta Anterior</label>
                                    <p>{selectedReport.respuestaAdmin}</p>
                                </div>
                            )}

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Tu Respuesta</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Escribe la respuesta al reporte..."
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={responseStatus}
                                        onChange={(e) => setResponseStatus(e.target.value)}
                                    >
                                        <option value="EN_REVISION">En revisión</option>
                                        <option value="RESUELTO">Resuelto</option>
                                        <option value="RECHAZADO">Rechazado</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowResponseModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSubmitResponse}
                                    >
                                        Enviar Respuesta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTable;
