import React from 'react';
import { Stories } from '../components/StoriesBar/Stories';
import Post from '../components/Post';

export const HomePage = ({ posts = [], refreshPosts }) => {
  return (
    <>
      <div className="mb-4">
        <Stories />
      </div>
      <div className="d-flex justify-content-center w-100 pt-4 min-vh-100">

        <div style={{ maxWidth: '470px', width: '100%' }}>

          {/*Sección de Historias*/}

          {/*Sección de Publicaciones*/}
          <div className="d-flex flex-column gap-4">
            {posts.length === 0 ? (
              <div className="text-center text-muted">No hay publicaciones aún.</div>
            ) : (
              posts.map(p => (
                <Post key={p.id || Math.random()} post={p} />
              ))
            )}
          </div>

        </div>

      </div>

    </>
  );
};