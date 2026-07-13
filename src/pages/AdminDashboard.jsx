import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import '../style/AdminDashboard.css';

import UsersTable from '../components/UsersTable';
import PublicationsTable from '../components/PublicationsTable';
import ReportsTable from '../components/ReportsTable';
import { RequestTable } from '../components/RequestTable';
import { API } from '../lib/api';

const AdminDashboard = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const [loadingPublicaciones, setLoadingPublicaciones] = useState(false);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);

    const isFetchedRef = useRef(false);

    const API_PUBLICATIONS = `${API}/publicaciones`;
    const API_USERS = `${API}/usuarios`;
    const API_REPORTS = `${API}/reportes`;

    useEffect(() => {
        if (isFetchedRef.current) return;

        isFetchedRef.current = true;

        fetchPublicaciones();
        fetchUsuarios();
    }, []);

    const fetchPublicaciones = async () => {
        setLoadingPublicaciones(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(API_PUBLICATIONS, {
                method: 'GET',
                headers: token
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {}
            });

            if (!response.ok) {
                throw new Error(
                    `Error al cargar publicaciones: ${response.status}`
                );
            }

            const data = await response.json();

            const sortedData = Array.isArray(data)
                ? [...data].sort(
                    (a, b) => (a.id ?? 0) - (b.id ?? 0)
                )
                : [];

            setPublicaciones(sortedData);
        } catch (error) {
            console.error(
                'Error fetching publicaciones:',
                error
            );

            toast.error('Error al actualizar publicaciones');
        } finally {
            setLoadingPublicaciones(false);
        }
    };

    const fetchUsuarios = async () => {
        setLoadingUsuarios(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error(
                    'No existe una sesión iniciada.'
                );
            }

            const response = await fetch(API_USERS, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(
                    `Error al cargar usuarios: ${response.status}`
                );
            }

            const data = await response.json();

            const sortedData = Array.isArray(data)
                ? [...data].sort(
                    (a, b) => (a.id ?? 0) - (b.id ?? 0)
                )
                : [];

            setUsuarios(sortedData);
        } catch (error) {
            console.error(
                'Error fetching usuarios:',
                error
            );

            toast.error('Error al cargar usuarios');
        } finally {
            setLoadingUsuarios(false);
        }
    };

    return (
        <main className="admin-dashboard container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-5 overflow-hidden">
            <div className="row justify-content-center g-4">

                {/* Encabezado */}
                <div className="col-12 mb-4 pt-4 pt-lg-0">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-3 p-md-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div>
                                    <h1 className="h4 h-md-3 mb-2 fw-bold">
                                        Panel de Administración
                                    </h1>

                                    <p className="text-muted mb-0">
                                        Gestiona publicaciones, usuarios,
                                        reportes y solicitudes desde un solo
                                        lugar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usuarios */}
                <div className="col-12">
                    <UsersTable
                        usuarios={usuarios}
                        fetchUsuarios={fetchUsuarios}
                        API_USERS={API_USERS}
                        loading={loadingUsuarios}
                    />
                </div>

                {/* Publicaciones */}
                <div className="col-12">
                    <PublicationsTable
                        publicaciones={publicaciones}
                        fetchPublicaciones={fetchPublicaciones}
                        API_PUBLICATIONS={API_PUBLICATIONS}
                        loading={loadingPublicaciones}
                    />
                </div>

                {/* Reportes */}
                <div className="col-12">
                    <ReportsTable
                        fetchReports={() => { }}
                        API_REPORTS={API_REPORTS}
                    />
                </div>

                {/* Solicitudes de organización */}
                <div className="col-12">
                    <RequestTable />
                </div>

                {/* Resumen */}
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom-0 py-3 px-3 px-md-4">
                            <h2 className="h6 mb-0">
                                Resumen
                            </h2>
                        </div>

                        <div className="card-body p-3 p-md-4">
                            <div className="row g-3 text-center text-md-start">
                                <div className="col-12 col-sm-6 col-lg-4">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">
                                            Publicaciones
                                        </p>

                                        <h3 className="mb-0">
                                            {publicaciones.length}
                                        </h3>
                                    </div>
                                </div>

                                <div className="col-12 col-sm-6 col-lg-4">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">
                                            Usuarios
                                        </p>

                                        <h3 className="mb-0">
                                            {usuarios.length}
                                        </h3>
                                    </div>
                                </div>

                                <div className="col-12 col-sm-6 col-lg-4">
                                    <div className="dashboard-stat bg-light rounded-3 p-3 h-100">
                                        <p className="mb-1 text-uppercase text-muted small">
                                            Acciones recientes
                                        </p>

                                        <h3 className="mb-0">
                                            3
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default AdminDashboard;