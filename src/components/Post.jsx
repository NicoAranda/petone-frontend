import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportModal from './ReportModal';

const Post = ({ post = {} }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const fotos = post.fotos && post.fotos.length > 0 ? post.fotos : ['https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-golden-retriever-dog-pictures-png-image_15147078.png'];
    const location = post.ubicacion || 'Ubicación desconocida';
    const title = post.nombre || 'Usuario';
    const description = post.descripcion || '';
    const tags = post.especie ? `#${post.especie}` : '';
    const API_PUBLICATIONS = 'http://localhost:8080/api/publicaciones';

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

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === fotos.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        // 1. Agregamos width: '100%' al contenedor principal para forzar el ancho
        <div className="card mb-4 mx-auto shadow-sm" style={{ width: '100%', maxWidth: '470px', backgroundColor: 'var(--color-surface)', borderColor: '#cbd9cd', borderRadius: '12px' }}>
            
            {/*Cabecera del Post*/}
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center gap-2">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=198754&color=fff`} 
                        alt="Perfil" 
                        className="rounded-circle" 
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                    />
                    <div className="d-flex flex-column lh-1">
                        <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>{title}</span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>{location}</span>
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
                <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex gap-3">
                        <i className="bi bi-heart fs-5 text-success hover-effect" style={{ cursor: 'pointer' }}></i>
                        <i className="bi bi-chat fs-5 hover-effect" style={{ cursor: 'pointer' }}></i>
                        <i className="bi bi-send fs-5 hover-effect" style={{ cursor: 'pointer' }}></i>
                    </div>
                    <div>
                        <i className="bi bi-bookmark fs-5 hover-effect" style={{ cursor: 'pointer' }}></i>
                    </div>
                </div>

                <p className="fw-bold mb-1" style={{ fontSize: '14px' }}>{post.likes || '0'} Me gusta</p>

                <p className="mb-1" style={{ fontSize: '14px' }}>
                    <span className="fw-bold me-2 cursor-pointer">{title}</span>
                    {description}
                </p>

                {tags && (
                    <p className="mb-2 fw-semibold" style={{ color: 'var(--color-primary)', fontSize: '14px' }}>
                        {tags}
                    </p>
                )}

                <a href="#!" className="text-muted text-decoration-none d-block mb-1" style={{ fontSize: '14px' }}>
                    Ver los 320 comentarios
                </a>
                <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
                    {timeAgo(post.fechaPublicacion)}
                </p>
            </div>

            {/*Agregar Comentario*/}
            <div className="card-footer bg-transparent d-flex align-items-center py-3 border-0" style={{ borderTop: '1px solid #e0e0e0 !important' }}>
                <i className="bi bi-emoji-smile fs-5 me-2 text-muted"></i>
                <input 
                    type="text" 
                    className="form-control bg-transparent border-0 text-dark shadow-none px-2" 
                    placeholder="Agrega un comentario..." 
                    style={{ fontSize: '14px' }} 
                />

                <button className="btn btn-link text-decoration-none fw-bold p-0 text-success" style={{ fontSize: '14px' }}>
                    Publicar
                </button>
            </div>

            {/* Modal de Reporte */}
            <ReportModal 
                showReportModal={showReportModal} 
                setShowReportModal={setShowReportModal} 
                publicacionId={post.id}
                API_PUBLICATIONS={API_PUBLICATIONS}
            />

        </div>
    );
};

export default Post;