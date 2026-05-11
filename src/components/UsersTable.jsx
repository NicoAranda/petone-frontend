import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../style/TablesStyle.css';

const UsersTable = ({ usuarios = [], fetchUsuarios, API_USERS, loading }) => {
    const [userForm, setUserForm] = useState({ id: null, nombre: '', email: '', rol: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Nuevos estados para el modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Efecto para bloquear el scroll cuando un modal está abierto
    useEffect(() => {
        if (showEditModal || showDeleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Limpieza al desmontar el componente
        return () => { document.body.style.overflow = 'unset'; };
    }, [showEditModal, showDeleteModal]);

    const handleUserSubmit = async (event) => {
        event.preventDefault();
        if (!userForm.id) return;
        try {
            const response = await fetch(`${API_USERS}/${userForm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm)
            });
            if (!response.ok) throw new Error('Error al actualizar usuario');
            await fetchUsuarios();
            toast.success("Usuario actualizado con éxito");
            handleCloseModal();
        } catch (error) {
            console.error('Error updating usuario:', error);
            // Toast de error personalizado
            toast.error("Error al actualizar usuario", {
                style: { background: '#d32f2f', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#d32f2f' }
            });
        }
    };

    const handleEditUser = (user) => {
        // Asegurarnos de que el rol se asigne o tenga un string vacío para el select
        setUserForm({ ...user, rol: user.rol || '' });
        setShowEditModal(true);
    };

    // Función para abrir el modal de eliminación
    const handleDeleteClick = (id) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    // Función que ejecuta la eliminación en la API
    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            const response = await fetch(`${API_USERS}/${userToDelete}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            
            await fetchUsuarios();
            toast.success("Usuario eliminado correctamente");
        } catch (error) {
            console.error('Error deleting usuario:', error);
            // Toast de error personalizado
            toast.error("Error al eliminar usuario", {
                style: { background: '#d32f2f', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#d32f2f' }
            });
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setUserForm({ id: null, nombre: '', email: '', rol: '' });
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                <h2 className="h6 mb-0">Usuarios</h2>
                <button className="btn btn-outline-success" onClick={fetchUsuarios} disabled={loading}>
                    {loading ? 'Cargando...' : 'Actualizar Usuarios'}
                </button>
            </div>
            
            <div className="table-responsive">
                <table className="table align-middle mb-0 custom-green-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios?.length > 0 ? (
                            usuarios.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.rol === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditUser(user)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(user.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted" style={{ backgroundColor: '#f9fdf9' }}>
                                    {loading ? 'Cargando usuarios...' : 'No se encontraron usuarios.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR USUARIO */}
            {showEditModal && (
                <div className="admin-dashboard-modal-backdrop">
                    <div className="admin-dashboard-modal">
                        <div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Editar usuario</h5>
                                <small className="text-muted">Actualiza los detalles de este usuario.</small>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCloseModal}>
                                Cerrar
                            </button>
                        </div>
                        <div className="admin-dashboard-modal-body">
                            <form onSubmit={handleUserSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userForm.nombre}
                                        onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                {/* NUEVO CAMPO ROL */}
                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        className="form-select"
                                        value={userForm.rol}
                                        onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option value="CLIENTE">CLIENTE</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Guardar cambios
                                    </button>
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
                            <h5 className="mb-0 text-success" style={{ color: '#0f5132' }}>Confirmar Eliminación</h5>
                        </div>
                        
                        <div className="admin-dashboard-modal-body text-center py-4" style={{ backgroundColor: '#f9fdf9' }}>
                            <div className="mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#d32f2f" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                            </div>
                            <p className="mb-0" style={{ color: '#2c3e2e' }}>
                                ¿Estás seguro de que deseas eliminar este usuario? <br/>
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

export default UsersTable;