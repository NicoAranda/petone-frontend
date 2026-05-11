import React, { useState } from 'react';
import toast from 'react-hot-toast';
import '../style/AdminDashboard.css';

const ReportModal = ({ showReportModal, setShowReportModal, publicacionId, API_PUBLICATIONS }) => {
    const [reportType, setReportType] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const reportTypes = [
        { value: 'ABUSO', label: 'Abuso o acoso' },
        { value: 'IMAGENES_SENSIBLES', label: 'Imágenes sensibles' },
        { value: 'CONTENIDO_INAPROPIADO', label: 'Contenido inapropiado' },
        { value: 'INFORMACION_FALSA', label: 'Información falsa' },
        { value: 'OTRO', label: 'Otro' }
    ];

    const handleSubmitReport = async (e) => {
        e.preventDefault();

        if (!reportType) {
            toast.error('Debes seleccionar un tipo de reporte');
            return;
        }

        if (!description.trim()) {
            toast.error('La descripción es obligatoria');
            return;
        }

        if (reportType === 'OTRO' && !customReason.trim()) {
            toast.error('Debes especificar la razón del reporte');
            return;
        }

        setLoading(true);

        try {
            const reportData = {
                publicacionId: publicacionId,
                usuarioId: 1, // En futuro obtener del contexto de autenticación
                tipo: reportType,
                razon: reportType === 'OTRO' ? customReason : '',
                descripcion: description
            };

            const response = await fetch(`${API_PUBLICATIONS.replace('/api/publicaciones', '')}/api/reportes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            });

            if (!response.ok) throw new Error('Error al enviar reporte');

            toast.success('Reporte enviado correctamente');
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar el reporte');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowReportModal(false);
        setReportType('');
        setCustomReason('');
        setDescription('');
    };

    if (!showReportModal) return null;

    return (
        <div className="admin-dashboard-modal-backdrop">
            <div className="admin-dashboard-modal">
                <div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0">Reportar publicación</h5>
                        <small className="text-muted">Cuéntanos qué hay de malo con esta publicación.</small>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={handleCloseModal}
                    >
                        Cerrar
                    </button>
                </div>

                <div className="admin-dashboard-modal-body">
                    <form onSubmit={handleSubmitReport}>
                        {/* Tipo de reporte */}
                        <div className="mb-3">
                            <label className="form-label">Tipo de reporte</label>
                            <select
                                className="form-select"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una opción</option>
                                {reportTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo adicional si selecciona "OTRO" */}
                        {reportType === 'OTRO' && (
                            <div className="mb-3">
                                <label className="form-label">¿Cuál es la razón?</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Especifica la razón del reporte"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Descripción */}
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Proporciona detalles sobre por qué reportas esta publicación"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={handleCloseModal}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-danger"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Reportar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
