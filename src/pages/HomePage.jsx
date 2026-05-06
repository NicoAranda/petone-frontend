import React from 'react';
import { Stories } from '../components/StoriesBar/Stories';
import Post from '../components/Post';

export const HomePage = () => {
  return (
    <>
      <div className="mb-4">
        <Stories />
      </div>
      <div className="d-flex justify-content-center w-100 pt-4 min-vh-100">

        <div style={{ maxWidth: '470px', width: '100%' }}>

          {/*Sección de Historias*/}

          {/*Botón para crear publicación moved to sidebar*/}

          {/*Sección de Publicaciones*/}
          <div className="d-flex flex-column gap-4">
            <Post />
            <Post />
          </div>

        </div>

      </div>

    </>
  );
};