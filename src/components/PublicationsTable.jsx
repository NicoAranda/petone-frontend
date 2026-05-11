import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const PublicationsTable = ({ publicaciones, fetchPublicaciones, API_PUBLICATIONS, loading }) => {
    const [pubForm, setPubForm] = useState({ id: null, nombre: '', ubicacion: '', especie: '', sexo: '', estado: '', descripcion: '' });
    const [showEditPubModal, setShowEditPubModal] = useState(false);

    // Nuevos estados para el modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pubToDelete, setPubToDelete] = useState(null);

    // Efecto para bloquear el scroll cuando un modal está abierto
    useEffect(() => {
        if (showEditPubModal || showDeleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Limpieza al desmontar el componente
        return () => { document.body.style.overflow = 'unset'; };
    }, [showEditPubModal, showDeleteModal]);

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
            toast.success("Publicación actualizada con éxito");
            handleClosePubModal();
        } catch (error) {
            console.error('Error updating publicación:', error);
            // Toast de error personalizado con fondo rojo
            toast.error("Error al actualizar publicaciones", {
                style: { background: '#d32f2f', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#d32f2f' }
            });
        }
    };

    const handleEditPub = (pub) => {
        setPubForm(pub);
        setShowEditPubModal(true);
    };

    // Función para abrir el modal de eliminación
    const handleDeleteClick = (id) => {
        setPubToDelete(id);
        setShowDeleteModal(true);
    };

    // Función que ejecuta la eliminación en la API
    const confirmDelete = async () => {
        if (!pubToDelete) return;
        try {
            const response = await fetch(`${API_PUBLICATIONS}/${pubToDelete}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar publicación');

            await fetchPublicaciones();
            toast.success("Publicación eliminada correctamente");
        } catch (error) {
            console.error('Error deleting publicación:', error);
            // Toast de error personalizado con fondo rojo
            toast.error("Error al eliminar publicación", {
                style: { background: '#d32f2f', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#d32f2f' }
            });
        } finally {
            setShowDeleteModal(false);
            setPubToDelete(null);
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
                    <button className="btn btn-outline-success" onClick={fetchPublicaciones} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Publicaciones'}
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table align-middle mb-0 custom-green-table">
                    <thead>
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
                                    {/* Aquí llamamos al nuevo manejador del modal en lugar del window.confirm */}
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(pub.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR PUBLICACIÓN */}
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
                                    <button type="submit" className="btn btn-success">Guardar cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CONFIRMAR ELIMINACIÓN */}
            {showDeleteModal && (
                <div className="admin-dashboard-modal-backdrop">
                    <div className="admin-dashboard-modal" style={{ maxWidth: '400px' }}>
                        <div
                            className="admin-dashboard-modal-header d-flex justify-content-between align-items-center"
                            style={{ backgroundColor: '#eef7ee', borderBottom: '1px solid #d1e7dd' }}
                        >
                            <h5 className="mb-0 text-success" style={{ color: 'var(--color-primary-dark)' }}>Confirmar Eliminación</h5>
                        </div>

                        <div className="admin-dashboard-modal-body text-center py-4" style={{ backgroundColor: '#f9fdf9' }}>
                            <div className="mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#d32f2f" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                            </div>
                            <p className="mb-0" style={{ color: '#2c3e2e' }}>
                                ¿Estás seguro de que deseas eliminar esta publicación? <br />
                                <strong>Esta acción no se puede deshacer.</strong>
                            </p>
                        </div>

                        <div className="d-flex justify-content-center gap-3 p-3" style={{ backgroundColor: '#f9fdf9', borderTop: '1px solid #e0ebe0' }}>
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-danger px-4" onClick={confirmDelete}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicationsTable;