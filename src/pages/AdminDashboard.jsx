import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import '../style/AdminDashboard.css';

// Importamos los componentes hijos que acabamos de crear
import UsersTable from '../components/UsersTable';
import PublicationsTable from '../components/PublicationsTable';

const AdminDashboard = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFetchedRef = useRef(false);

    const API_PUBLICATIONS = 'http://localhost:8080/api/publicaciones';
    const API_USERS = 'http://localhost:8080/api/usuarios';

    useEffect(() => {
        if (isFetchedRef.current) return;
        isFetchedRef.current = true;

        fetchPublicaciones();
        fetchUsuarios();
    }, []);

    const fetchPublicaciones = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_PUBLICATIONS);
            if (!response.ok) throw new Error('Error al cargar publicaciones');
            const data = await response.json();
            const sortedData = Array.isArray(data)
                ? data.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                : [];
            setPublicaciones(sortedData);
        } catch (error) {
            console.error('Error fetching publicaciones:', error);
            toast.error("Error al actualizar publicaciones");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            // Supongamos que guardaste el token en localStorage al hacer login
            const token = localStorage.getItem('token');

            const response = await fetch(API_USERS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega esta línea si tu backend pide Bearer token
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            const sortedData = Array.isArray(data)
                ? data.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                : [];
            setUsuarios(sortedData);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard container-fluid py-5">
            <div className="row justify-content-center">

                {/* Header del Dashboard */}
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

                {/* Tabla de Usuarios (Componente) */}
                <div className="col-12">
                    <UsersTable
                        usuarios={usuarios}
                        fetchUsuarios={fetchUsuarios}
                        API_USERS={API_USERS}
                        loading={loading}
                    />
                </div>

                {/* Tabla de Publicaciones (Componente) */}
                <div className="col-12">
                    <PublicationsTable
                        publicaciones={publicaciones}
                        fetchPublicaciones={fetchPublicaciones}
                        API_PUBLICATIONS={API_PUBLICATIONS}
                        loading={loading}
                    />
                </div>

                {/* Resumen / Estadísticas */}
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
        </div>
    );
};

export default AdminDashboard;