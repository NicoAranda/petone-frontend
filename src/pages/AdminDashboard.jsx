import React, { useEffect, useState, useRef } from 'react'
import './AdminDashboard.css'

const AdminDashboard = () => {
    const [publicaciones, setPublicaciones] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [userForm, setUserForm] = useState({ id: null, nombre: '', email: '' })
    const [pubForm, setPubForm] = useState({ id: null, nombre: '', ubicacion: '', especie: '', sexo: '', estado: '', descripcion: '' })
    const [showEditModal, setShowEditModal] = useState(false)
    const [showEditPubModal, setShowEditPubModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const isFetchedRef = useRef(false)

    const API_BASE = 'http://localhost:8080/api/publicaciones'

    useEffect(() => {
        if (isFetchedRef.current) return
        isFetchedRef.current = true

        fetchPublicaciones()
        // Mantener usuarios mock por ahora, o integrar ms-users si es necesario
        setUsuarios([
            { id: 1, nombre: 'Carlos', email: 'carlos@petone.com' },
            { id: 2, nombre: 'Andrea', email: 'andrea@petone.com' },
        ])
    }, [])

    const fetchPublicaciones = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_BASE)
            if (!response.ok) throw new Error('Error al cargar publicaciones')
            const data = await response.json()
            const sortedData = Array.isArray(data)
                ? data.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                : []
            setPublicaciones(sortedData)
        } catch (error) {
            console.error('Error fetching publicaciones:', error)
            alert('Error al cargar publicaciones')
        } finally {
            setLoading(false)
        }
    }

    const handlePubSubmit = async (event) => {
        event.preventDefault()
        if (!pubForm.id) return
        try {
            const response = await fetch(`${API_BASE}/${pubForm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pubForm)
            })
            if (!response.ok) throw new Error('Error al actualizar publicación')
            await fetchPublicaciones() // Refrescar lista
            handleClosePubModal()
        } catch (error) {
            console.error('Error updating publicación:', error)
            alert('Error al actualizar publicación')
        }
    }

    const handleEditPub = (pub) => {
        setPubForm(pub)
        setShowEditPubModal(true)
    }

    const handleDeletePub = async (id) => {
        if (!window.confirm('¿Eliminar esta publicación?')) return
        try {
            const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Error al eliminar publicación')
            await fetchPublicaciones() // Refrescar lista
        } catch (error) {
            console.error('Error deleting publicación:', error)
            alert('Error al eliminar publicación')
        }
    }

    const handleClosePubModal = () => {
        setShowEditPubModal(false)
        setPubForm({ id: null, nombre: '', ubicacion: '', especie: '', sexo: '', estado: '', descripcion: '' })
    }

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
                        </div>
                    </div>
                </div>


                <div className="col-12">
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
                                <button className="btn btn-outline-primary" onClick={fetchPublicaciones} disabled={loading}>
                                    {loading ? 'Cargando...' : 'Actualizar tabla'}
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
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={pubForm.nombre}
                                            onChange={(e) => setPubForm({ ...pubForm, nombre: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Ubicación</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={pubForm.ubicacion}
                                            onChange={(e) => setPubForm({ ...pubForm, ubicacion: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Especie</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={pubForm.especie}
                                            onChange={(e) => setPubForm({ ...pubForm, especie: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Sexo</label>
                                        <select
                                            className="form-control"
                                            value={pubForm.sexo}
                                            onChange={(e) => setPubForm({ ...pubForm, sexo: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Estado</label>
                                        <select
                                            className="form-control"
                                            value={pubForm.estado}
                                            onChange={(e) => setPubForm({ ...pubForm, estado: e.target.value })}
                                            required
                                        >
                                            <option value="ACTIVA">ACTIVA</option>
                                            <option value="RESUELTA">RESUELTA</option>
                                            <option value="CANCELADA">CANCELADA</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={pubForm.descripcion}
                                        onChange={(e) => setPubForm({ ...pubForm, descripcion: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={handleClosePubModal}>
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
    )
}

export default AdminDashboard
