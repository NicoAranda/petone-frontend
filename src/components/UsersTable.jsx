import React, { useState } from 'react';

const UsersTable = ({ usuarios = [], fetchUsuarios, API_USERS, loading }) => {
    const [userForm, setUserForm] = useState({ id: null, nombre: '', email: '' });
    const [showEditModal, setShowEditModal] = useState(false);

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
            handleCloseModal();
        } catch (error) {
            console.error('Error updating usuario:', error);
            alert('Error al actualizar usuario');
        }
    };

    const handleEditUser = (user) => {
        setUserForm(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Eliminar este usuario?')) return;
        try {
            const response = await fetch(`${API_USERS}/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            await fetchUsuarios();
        } catch (error) {
            console.error('Error deleting usuario:', error);
            alert('Error al eliminar usuario');
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setUserForm({ id: null, nombre: '', email: '' });
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                <h2 className="h6 mb-0">Usuarios</h2>
                <button className="btn btn-outline-primary" onClick={fetchUsuarios} disabled={loading}>
                    {loading ? 'Cargando...' : 'Actualizar Usuarios'}
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* VALIDACIÓN DE SEGURIDAD AQUÍ */}
                        {usuarios?.length > 0 ? (
                            usuarios.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.email}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditUser(user)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    {loading ? 'Cargando usuarios...' : 'No se encontraron usuarios.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL USUARIO */}
            {showEditModal && (
                <div className="admin-dashboard-modal-backdrop">
                    <div className="admin-dashboard-modal">
                        <div className="admin-dashboard-modal-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">Editar usuario</h5>
                                <small className="text-muted">Actualiza el nombre y correo de este usuario.</small>
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
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar cambios
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

export default UsersTable;