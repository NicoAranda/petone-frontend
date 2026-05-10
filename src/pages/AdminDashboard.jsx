import React, { useEffect, useState } from 'react'
import CreatePostModal from '../components/PostCreate/CreatePostModal'
import './AdminDashboard.css'

const AdminDashboard = () => {
    const [publicaciones, setPublicaciones] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [userForm, setUserForm] = useState({ id: null, nombre: '', email: '' })
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        setPublicaciones([
            { id: 1, nombre: 'Mishi', ubicacion: 'Santiago', estado: 'ACTIVA' },
            { id: 2, nombre: 'Firulais', ubicacion: 'Concepción', estado: 'RESUELTA' },
        ])

        setUsuarios([
            { id: 1, nombre: 'Carlos', email: 'carlos@petone.com' },
            { id: 2, nombre: 'Andrea', email: 'andrea@petone.com' },
        ])
    }, [])

    const handleUserSubmit = (event) => {
        event.preventDefault()
        if (!userForm.id) return
        if (!userForm.nombre || !userForm.email) return

        setUsuarios((prev) => prev.map((user) => user.id === userForm.id ? userForm : user))
        handleCloseModal()
    }

    const handleEditUser = (user) => {
        setUserForm(user)
        setShowEditModal(true)
    }

    const handleCloseModal = () => {
        setShowEditModal(false)
        setUserForm({ id: null, nombre: '', email: '' })
    }

    const handleDeleteUser = (userId) => {
        if (!window.confirm('¿Eliminar este usuario?')) return
        setUsuarios((prev) => prev.filter((user) => user.id !== userId))
    }

    return (
        <div className="admin-dashboard container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                            <div>
                                <h1 className="h3 mb-2">Panel de Administración</h1>
                                <p className="text-muted mb-0">Gestiona publicaciones y usuarios desde un solo lugar.</p>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={() => setShowCreateModal(true)}>Nueva publicación</button>
                        </div>
                    </div>
                </div>


                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white border-bottom-0 py-3">
                            <h2 className="h6 mb-0">Usuarios</h2>
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
                                    {usuarios.map((user) => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom-0 py-3">
                            <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                                <div>
                                    <h2 className="h6 mb-1">Publicaciones</h2>
                                    <small className="text-muted">Lista de publicaciones registradas en el sistema.</small>
                                </div>
                                <button className="btn btn-outline-primary">Actualizar tabla</button>
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
                                                <button className="btn btn-sm btn-outline-secondary">Editar</button>
                                                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-header bg-white border-bottom-0 py-3">
                            <h2 className="h6 mb-0">Resumen</h2>
                        </div>
                        <div className="card-body">
                            <div className="row text-center text-md-start">
                                <div className="col-12 col-md-4 mb-3 mb-md-0">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">Publicaciones</p>
                                        <h3 className="mb-0">{publicaciones.length}</h3>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 mb-3 mb-md-0">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">Usuarios</p>
                                        <h3 className="mb-0">{usuarios.length}</h3>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">Acciones recientes</p>
                                        <h3 className="mb-0">3</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        </div>
    )
}

export default AdminDashboard
