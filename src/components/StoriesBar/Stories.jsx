import React, { useState } from "react";
import "./Stories.css";
import { NavLink } from "react-router-dom";

export const Stories = ({ posts = [] }) => {

  const [index, setIndex] = useState(0);

  const stories = posts
    .filter(post => post.fotos?.length > 0)
    .map(post => ({
      id: post.id,

      name: post.usuario
        ? `${post.usuario.nombre} ${post.usuario.apellido}`
        : "Usuario",

      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        post.usuario
          ? `${post.usuario.nombre} ${post.usuario.apellido}`
          : "Usuario"
      )}&background=198754&color=fff`,

      img: post.fotos[0],

      fechaPublicacion: post.fechaPublicacion,

      post
    }));

  const maxVisible = 6;
  const step = 4;

  const maxIndex = Math.max(0, stories.length - maxVisible);

  const next = () => {
    setIndex(prev => Math.min(prev + step, maxIndex));
  };

  const prev = () => {
    setIndex(prev => Math.max(prev - step, 0));
  };

  return (
    <div className="container mt-3 d-flex justify-content-center align-items-center gap-2">

      <button
        className="btn btn-light rounded-circle shadow-sm"
        onClick={prev}
        disabled={index === 0}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="stories-viewport">

        <div
          className="stories-track"
          style={{
            transform: `translateX(-${index * (100 / maxVisible)}%)`
          }}
        >

          {stories.map((story, mappedIndex) => (

            <NavLink
              key={story.id}
              to="/StoryView"
              state={{
                initialStoryIndex: mappedIndex,
                stories
              }}
              className="story-item text-center"
            >

              <div className="story-border new">

                <img
                  src={story.avatar}
                  alt={story.name}
                  className="story-img"
                />

              </div>

            </NavLink>

          ))}

        </div>

      </div>

      <button
        className="btn btn-light rounded-circle shadow-sm"
        onClick={next}
        disabled={index >= maxIndex}
      >
        <i className="bi bi-chevron-right"></i>
      </button>

    </div>
  );
};