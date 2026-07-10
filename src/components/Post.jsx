import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportModal from './ReportModal';
import toast from 'react-hot-toast';
import { API } from '../lib/api';

const Post = ({ post = {} }) => {
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const fotos = post.fotos && post.fotos.length > 0 ? post.fotos : ['https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-golden-retriever-dog-pictures-png-image_15147078.png'];
    const location = post.ubicacion || 'Ubicación desconocida';

    const authorName = post.usuario
        ? `${post.usuario.nombre} ${post.usuario.apellido}`
        : 'Usuario';
    const authorId = post.usuario?.id ?? post.userId ?? post.usuarioId ?? null;

    const petName = post.nombre || 'Mascota sin nombre';

    const description = post.descripcion || '';
    const tags = post.especie ? `#${post.especie}` : '';

    // Función para decodificar JWT y obtener el nombre y apellido
    const extraerDatosUsuarioDelToken = (token) => {
        try {
            const payloadBase64 = token.split('.')[1];
            if (!payloadBase64) {
                console.error('No se pudo extraer payload del token');
                return null;
            }
            const decodedPayload = JSON.parse(atob(payloadBase64));
            
            console.log('Token decodificado:', decodedPayload);
            console.log('Nombre:', decodedPayload.nombre);
            console.log('Apellido:', decodedPayload.apellido);
            
            // Verificar que al menos uno de los dos tenga valor
            const nombre = decodedPayload.nombre ? decodedPayload.nombre.trim() : '';
            const apellido = decodedPayload.apellido ? decodedPayload.apellido.trim() : '';
            
            if (nombre || apellido) {
                return {
                    nombre: nombre,
                    apellido: apellido,
                    id: decodedPayload.id
                };
            }
            
            console.warn('Token no contiene nombre ni apellido');
            return null;
        } catch (error) {
            console.error('Error decodificando token:', error);
            return null;
        }
    };

    useEffect(() => {
        cargarComentarios();
    }, [post.id]);

    const cargarComentarios = async () => {
        try {
            setLoadingComentarios(true);
            // Avoid fetching when post.id is not provided in tests or placeholders
            if (!post || !post.id) {
                setComentarios([])
                return
            }
            const response = await fetch(`${API}/publicaciones/${post.id}/comentarios`);
            if (response.ok) {
                const data = await response.json();
                setComentarios(data);
            }
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        } finally {
            setLoadingComentarios(false);
        }
    };

    const handlePublicarComentario = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            toast.error('Debes estar logeado para comentar');
            return;
        }

        if (!nuevoComentario.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        // Extraer datos del usuario del token
        const datosUsuario = extraerDatosUsuarioDelToken(token);
        let nombreCompleto = 'Usuario';
        
        if (datosUsuario && (datosUsuario.nombre || datosUsuario.apellido)) {
            nombreCompleto = `${datosUsuario.nombre} ${datosUsuario.apellido}`.trim();
            if (!nombreCompleto) {
                nombreCompleto = 'Usuario';
            }
        }
        
        console.log('Nombre completo a enviar:', nombreCompleto);

        try {
            const response = await fetch(`${API}/publicaciones/${post.id}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    contenido: nuevoComentario,
                    usuarioNombre: nombreCompleto
                })
            });

            if (response.ok) {
                const nuevoComentarioData = await response.json();
                setComentarios([...comentarios, nuevoComentarioData]);
                setNuevoComentario('');
                toast.success('Comentario publicado');
            } else {
                toast.error('Error al publicar comentario');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al publicar comentario');
        }
    };

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `HACE ${interval} AÑOS`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `HACE ${interval} MESES`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `HACE ${interval} DÍAS`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `HACE ${interval} HORAS`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `HACE ${interval} MINUTOS`;
        return `HACE ${seconds} SEGUNDOS`;
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? fotos.length - 1 : prevIndex - 1));
    };

    const handleAuthorClick = () => {
        if (authorId) {
            navigate(`/perfil/${authorId}`);
        }
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === fotos.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        // 1. Agregamos width: '100%' al contenedor principal para forzar el ancho
        <div className="card mb-4 mx-auto shadow-sm" style={{ width: '100%', maxWidth: '470px', backgroundColor: 'var(--color-surface)', borderColor: '#cbd9cd', borderRadius: '12px' }}>

            {/*Cabecera del Post*/}
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3" style={{ gap: '8px' }}>
                <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=198754&color=fff`}
                        alt="Perfil"
                        className="rounded-circle flex-shrink-0"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <div className="d-flex flex-column lh-1 align-items-start" style={{ lineHeight: 1.1 }}>
                        <button
                            type="button"
                            className="btn btn-link p-0 fw-bold text-dark text-decoration-none"
                            style={{ fontSize: '14px', lineHeight: 1.1 }}
                            onClick={handleAuthorClick}
                            disabled={!authorId}
                        >
                            {authorName}
                        </button>
                        <span className="text-muted" style={{ fontSize: '12px', lineHeight: 1.1 }}>{location}</span>
                    </div>
                </div>
                <div className="dropdown">
                    <button
                        className="btn btn-link text-dark p-0"
                        type="button"
                        id={`dropdownMenu-${post.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenu-${post.id}`}>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#!"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowReportModal(true);
                                }}
                            >
                                <i className="bi bi-flag me-2"></i>
                                Reportar publicación
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/*Imagen Principal o Carrusel*/}
            {fotos.length === 1 ? (
                <img
                    src={fotos[0]}
                    className="card-img-top rounded-0"
                    alt="Publicación de mascota"
                    style={{
                        borderTop: '1px solid #e0e0e0',
                        borderBottom: '1px solid #e0e0e0',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <div id={`carousel-${post.id}`} className="carousel slide" style={{ borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                    <div className="carousel-inner">
                        {fotos.map((foto, index) => (
                            <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                                <img
                                    src={foto}
                                    className="d-block w-100"
                                    alt={`Imagen ${index + 1} de la publicación`}
                                    style={{
                                        aspectRatio: '1 / 1',
                                        objectFit: 'cover',
                                        height: '470px'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" onClick={handlePrev}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" onClick={handleNext}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    <div className="carousel-indicators position-absolute bottom-0 mb-2">
                        {fotos.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`bg-white ${index === activeIndex ? 'active' : ''}`}
                                style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', margin: '0 2px' }}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            )}

            {/*Botones de Interacción*/}
            <div className="card-body p-3 pb-0 text-dark">
                <div className="d-flex justify-content-start mb-3">
                    <div className="d-flex gap-2">
                        <i className="bi bi-chat fs-5 hover-effect text-success" style={{ cursor: 'pointer' }} title="Comentarios"></i>
                    </div>
                </div>

                <p className="mb-1" style={{ fontSize: '14px' }}>
                    <span className="fw-bold me-2 cursor-pointer">{authorName}</span>
                    {description}
                </p>
                <p className="mb-1" style={{ fontSize: '14px' }}>
                   Nombre de la mascota: <span className="fw-bold me-2 cursor-pointer">{petName}</span>
                </p>

                {tags && (
                    <p className="mb-2 fw-semibold" style={{ color: 'var(--color-primary)', fontSize: '14px' }}>
                        {tags}
                    </p>
                )}

                <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                    {timeAgo(post.fechaPublicacion)}
                </p>

                {/* Sección de Comentarios */}
                <div className="mb-3 border-top pt-2">
                    <p className="fw-bold mb-2" style={{ fontSize: '14px' }}>
                        {comentarios.length} comentario{comentarios.length !== 1 ? 's' : ''}
                    </p>
                    
                    {loadingComentarios ? (
                        <p className="text-muted" style={{ fontSize: '12px' }}>Cargando comentarios...</p>
                    ) : comentarios.length > 0 ? (
                        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                            {comentarios.map((comentario, index) => (
                                <div key={index} className="mb-2 pb-2 border-bottom" style={{ fontSize: '13px' }}>
                                    <span className="fw-bold me-1">{comentario.usuarioNombre || 'Usuario'}:</span>
                                    <span className="text-dark">{comentario.contenido}</span>
                                    <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>
                                        {timeAgo(comentario.fechaCreacion)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted" style={{ fontSize: '12px' }}>Sin comentarios aún</p>
                    )}
                </div>
            </div>

            {/*Agregar Comentario*/}
            <div className="card-footer bg-transparent d-flex align-items-center py-3 border-0" style={{ borderTop: '1px solid #e0e0e0 !important' }}>
                <i className="bi bi-emoji-smile fs-5 me-2 text-muted"></i>
                <input
                    type="text"
                    className="form-control bg-transparent border-0 text-dark shadow-none px-2"
                    placeholder="Agrega un comentario..."
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handlePublicarComentario();
                        }
                    }}
                    style={{ fontSize: '14px' }}
                />

                <button 
                    className="btn btn-link text-decoration-none fw-bold p-0 text-success" 
                    style={{ fontSize: '14px' }}
                    onClick={handlePublicarComentario}
                >
                    Publicar
                </button>
            </div>

            {/* Modal de Reporte */}
            <ReportModal
                showReportModal={showReportModal}
                setShowReportModal={setShowReportModal}
                publicacionId={post.id}
            />

        </div>
    );
};

export default Post;