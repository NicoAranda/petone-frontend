import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Post = () => {
  return (
    
    <div className="card mb-4 mx-auto shadow-sm" style={{ maxWidth: '470px', backgroundColor: '#ffffff', borderColor: '#e0e0e0', borderRadius: '12px' }}>
      
      {/*Cabecera del Post*/}
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center gap-2">
          <img 
            src="https://ui-avatars.com/api/?name=MP&background=198754&color=fff" 
            alt="Perfil" 
            className="rounded-circle" 
            style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
          />
          <div className="d-flex flex-column lh-1">
            <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>MascotasPerdidasCDMX</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>Parque Chapultepec, CDMX</span>
          </div>
        </div>
        <button className="btn btn-link text-dark p-0">
          <i className="bi bi-three-dots"></i>
        </button>
      </div>

      {/*Imagen Principal*/}
      <img 
        src="https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-golden-retriever-dog-pictures-png-image_15147078.png" 
        className="card-img-top rounded-0" 
        alt="Publicación de mascota" 
        style={{ borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}
      />

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

        <p className="fw-bold mb-1" style={{ fontSize: '14px' }}>2,500 Me gusta</p>

        <p className="mb-1" style={{ fontSize: '14px' }}>
          <span className="fw-bold me-2 cursor-pointer">MascotasPerdidasCDMX</span>
          ¡Ayúdanos a encontrar a Boby! Se perdió cerca del parque central. Lleva collar azul.
        </p>

        <p className="mb-2 fw-semibold" style={{ color: '#198754', fontSize: '14px' }}>
          #Boby #PerroPerdido #BusquedaMascotas
        </p>

        <a href="#!" className="text-muted text-decoration-none d-block mb-1" style={{ fontSize: '14px' }}>
          Ver los 320 comentarios
        </a>
        <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
          HACE 2 HORAS
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

    </div>
  );
};

export default Post;