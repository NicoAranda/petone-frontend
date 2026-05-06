import React from 'react';
import { Stories } from '../components/StoriesBar/Stories';
import Post from '../components/Post';

export const HomePage = () => {
  return (
    <div className="d-flex justify-content-center w-100 pt-4 min-vh-100">
      
      <div style={{ maxWidth: '470px', width: '100%' }}>
        
        {/*Sección de Historias*/}
        <div className="mb-4">
          <Stories />
        </div>

        {/*Botón para crear publicación*/}
        <div className="mb-4 px-2 px-sm-0">
          <button 
            className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2 shadow-sm"
            style={{ borderRadius: '20px', padding: '10px 0' }}
          >
            <i className="bi bi-plus-circle-fill fs-5"></i>
            <span className="fw-semibold" style={{ fontSize: '15px' }}>Crear publicación</span>
          </button>
        </div>

        {/*Sección de Publicaciones*/}
        <div className="d-flex flex-column gap-4">
          <Post />
          <Post />
        </div>

      </div>

    </div>
  );
};