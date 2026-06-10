import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../public/css/StoryView.css';

export const StoryViewPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const stories = location.state?.stories || [];

  const initialIndex =
    location.state?.initialStoryIndex ?? 0;

  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {

    if (!stories.length) return;

    const timer = setTimeout(() => {

      if (current < stories.length - 1) {
        setCurrent(current + 1);
      } else {
        navigate('/HomePage');
      }

    }, 5000);

    return () => clearTimeout(timer);

  }, [current, stories, navigate]);

  if (!stories.length) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        No hay historias disponibles
      </div>
    );
  }

  const prevStory = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const nextStory = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
    }
  };

  const closeStory = () => {
    navigate('/HomePage');
  };

  return (
    <div className="story-view-wrapper">

      <button
        onClick={closeStory}
        className="story-close-btn position-absolute top-0 end-0 p-4 z-3 bg-transparent border-0"
      >
        ×
      </button>

      <div className="story-view-viewport">

        <div
          className="story-view-track"
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
        >

          {stories.map((story, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={story.id}
                className={`story-view-item ${isActive ? 'active' : ''}`}
              >
                <div className="story-main-card">
                  <div className="position-absolute top-0 start-0 w-100 p-3 z-2">
                    <div className="story-progress-bar">
                      <div className="story-progress-fill"></div>
                    </div>
                  </div>

                  <div className="position-absolute top-0 start-0 d-flex align-items-center gap-2 p-3 mt-3 z-2 w-100 text-white">
                    <img
                      src={story.avatar}
                      alt="avatar"
                      className="rounded-circle object-fit-cover border border-2 border-white"
                      style={{
                        width: '38px',
                        height: '38px'
                      }}
                    />
                    <div
                      className="d-flex flex-column"
                      style={{
                        textShadow:
                          '1px 1px 3px rgba(0,0,0,0.8)'
                      }}
                    >
                      <span className="fw-bold">
                        {story.name}
                      </span>

                      <small>
                        🐾 {story.post.nombre}
                      </small>
                    </div>
                  </div>

                  <img
                    src={story.img}
                    alt="Historia"
                    className="w-100 h-100 object-fit-cover"
                  />

                  <div
                    className="story-repost-container position-absolute top-50 start-50 translate-middle"
                    style={{
                      width: '85%',
                      maxWidth: '350px'
                    }}
                  >

                    {/* Blur detrás del repost */}
                    <div className="story-repost-blur" />

                    {/* Repost */}
                    <div
                      className="story-repost-card bg-white rounded-4 overflow-hidden shadow-lg"
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        navigate('/post/' + story.post.id, {
                          state: {
                            post: story.post
                          }
                        });
                      }}
                    >

                      <div className="p-3 border-bottom">
                        <strong>
                          {story.name}
                        </strong>
                      </div>

                      <img
                        src={story.img}
                        alt=""
                        className="w-100"
                        style={{
                          aspectRatio: '1/1',
                          objectFit: 'cover'
                        }}
                      />

                      <div className="p-3">

                        <h6 className="fw-bold">
                          {story.post.nombre}
                        </h6>

                        <small className="text-muted">
                          Toca para ver la publicación
                        </small>

                      </div>

                    </div>

                  </div>

                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-4 text-white"
                    style={{
                      background:
                        'linear-gradient(transparent, rgba(0,0,0,.8))'
                    }}
                  >
                  </div>

                </div>

              </div>

            );

          })}

        </div>

        <button
          className="story-arrow-btn prev"
          onClick={prevStory}
          disabled={current === 0}
        >
          ❮
        </button>

        <button
          className="story-arrow-btn next"
          onClick={nextStory}
          disabled={current === stories.length - 1}
        >
          ❯
        </button>

      </div>

    </div>
  );
};