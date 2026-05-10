import React, { useState } from 'react';

const PublicationsTable = ({ publicaciones, fetchPublicaciones, API_PUBLICATIONS, loading }) => {
    const [pubForm, setPubForm] = useState({ id: null, nombre: '', ubicacion: '', especie: '', sexo: '', estado: '', descripcion: '' });
    const [showEditPubModal, setShowEditPubModal] = useState(false);

    const handlePubSubmit = async (event) => {
        event.preventDefault();
        if (!pubForm.id) return;
        try {
            const response = await fetch(`${API_PUBLICATIONS}/${pubForm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pubForm)
            });
            if (!response.ok) throw new Error('Error al actualizar publicación');
            await fetchPublicaciones(); 
            handleClosePubModal();
        } catch (error) {
            console.error('Error updating publicación:', error);
            alert('Error al actualizar publicación');
        }
    };

    const handleEditPub = (pub) => {
        setPubForm(pub);
        setShowEditPubModal(true);
    };

    const handleDeletePub = async (id) => {
        if (!window.confirm('¿Eliminar esta publicación?')) return;
        try {
            const response = await fetch(`${API_PUBLICATIONS}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar publicación');
            await fetchPublicaciones();
        } catch (error) {
            console.error('Error deleting publicación:', error);
            alert('Error al eliminar publicación');
        }
    };

    const handleClosePubModal = () => {
        setShowEditPubModal(false);
        setPubForm({ id: null, nombre: '', ubicacion: '', especie: '', sexo: '', estado: '', descripcion: '' });
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 py-3">
                <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                    <div>
                        <h2 className="h6 mb-1">Publicaciones</h2>
                        <small className="text-muted">Lista de publicaciones registradas en el sistema.</small>
                    </div>
                    <button className="btn btn-outline-primary" onClick={fetchPublicaciones} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Publicaciones'}
                    </button>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Mascota</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publicaciones.map((pub) => (
                            <tr key={pub.id}>
                                <td>{pub.id}</td>
                                <td>{pub.nombre}</td>
                                <td>{pub.ubicacion}</td>
                                <td>
                                    <span className={`badge ${pub.estado === 'ACTIVA' ? 'bg-success' : 'bg-secondary'}`}>
                                        {pub.estado}
                                    </span>
                                </td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditPub(pub)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePub(pub.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL PUBLICACIÓN */}
            {showEditPubModal && (
                <div className="admin-dashboard-modal-backdrop">
                    <div className="admin-dashboard-modal">
                        <div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Editar publicación</h5>
                                <small className="text-muted">Actualiza los detalles de esta publicación.</small>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleClosePubModal}>
                                Cerrar
                            </button>
                        </div>
                        <div className="admin-dashboard-modal-body">
                            <form onSubmit={handlePubSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" value={pubForm.nombre} onChange={(e) => setPubForm({ ...pubForm, nombre: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Ubicación</label>
                                        <input type="text" className="form-control" value={pubForm.ubicacion} onChange={(e) => setPubForm({ ...pubForm, ubicacion: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Especie</label>
                                        <input type="text" className="form-control" value={pubForm.especie} onChange={(e) => setPubForm({ ...pubForm, especie: e.target.value })} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Sexo</label>
                                        <select className="form-control" value={pubForm.sexo} onChange={(e) => setPubForm({ ...pubForm, sexo: e.target.value })} required>
                                            <option value="">Seleccionar</option>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Estado</label>
                                        <select className="form-control" value={pubForm.estado} onChange={(e) => setPubForm({ ...pubForm, estado: e.target.value })} required>
                                            <option value="ACTIVA">ACTIVA</option>
                                            <option value="RESUELTA">RESUELTA</option>
                                            <option value="CANCELADA">CANCELADA</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea className="form-control" rows="3" value={pubForm.descripcion} onChange={(e) => setPubForm({ ...pubForm, descripcion: e.target.value })} required></textarea>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={handleClosePubModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicationsTable;