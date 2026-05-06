import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../public/css/StoryView.css';

const rawStories = [
  { id: 1, name: "Nico", time: "2 h", avatar: "https://i.pravatar.cc/100?img=1", status: "new", img: "https://picsum.photos/400/700?random=1" },
  { id: 2, name: "Vale", time: "5 h", avatar: "https://i.pravatar.cc/100?img=2", status: "viewed", img: "https://picsum.photos/400/700?random=2" },
  { id: 3, name: "Juan", time: "8 h", avatar: "https://i.pravatar.cc/100?img=3", status: "new", img: "https://picsum.photos/400/700?random=3" },
  { id: 4, name: "Sofi", time: "10 h", avatar: "https://i.pravatar.cc/100?img=4", status: "viewed", img: "https://picsum.photos/400/700?random=4" },
  { id: 5, name: "Luis", time: "12 h", avatar: "https://i.pravatar.cc/100?img=5", status: "new", img: "https://picsum.photos/400/700?random=5" },
  { id: 6, name: "Ana", time: "15 h", avatar: "https://i.pravatar.cc/100?img=6", status: "new", img: "https://picsum.photos/400/700?random=6" },
  { id: 7, name: "Diego", time: "18 h", avatar: "https://i.pravatar.cc/100?img=7", status: "viewed", img: "https://picsum.photos/400/700?random=7" },
  { id: 8, name: "Camila", time: "20 h", avatar: "https://i.pravatar.cc/100?img=8", status: "new", img: "https://picsum.photos/400/700?random=8" },
];

const stories = [...rawStories].sort((a, b) => {
  if (a.status === "viewed" && b.status !== "viewed") return 1;
  if (a.status !== "viewed" && b.status === "viewed") return -1;
  return 0;
});

export const StoryViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialIndex = location.state?.initialStoryIndex || 0;
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current < stories.length - 1) {
        setCurrent(current + 1);
      } else {
        navigate('/HomePage');
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [current, navigate]);

  const prevStory = () => { if (current > 0) setCurrent(current - 1); };
  const nextStory = () => { if (current < stories.length - 1) setCurrent(current + 1); };
  const closeStory = () => { navigate('/HomePage'); };

  return (
    <div className="story-view-wrapper">
      
      <button onClick={closeStory} className="story-close-btn position-absolute top-0 end-0 p-4 z-3 bg-transparent border-0">
        ×
      </button>

      {/* Viewport: el área central */}
      <div className="story-view-viewport">
        
        {/* Track: Se desliza basándose en el índice actual */}
        <div 
          className="story-view-track" 
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {stories.map((story, index) => {
            const isActive = index === current;

            return (
              <div key={story.id} className={`story-view-item ${isActive ? 'active' : ''}`}>
                
                <div className="story-main-card">
                  
                  {/* Progreso */}
                  <div className="position-absolute top-0 start-0 w-100 p-3 z-2">
                    <div className="story-progress-bar">
                      {/* La animación ocurre por CSS gracias a la clase .active */}
                      <div className="story-progress-fill"></div>
                    </div>
                  </div>

                  {/* Info Usuario */}
                  <div className="position-absolute top-0 start-0 d-flex align-items-center gap-2 p-3 mt-3 z-2 w-100 text-white">
                    <img
                      src={story.avatar}
                      alt="avatar"
                      className="rounded-circle object-fit-cover border border-2 border-white"
                      style={{ width: '38px', height: '38px' }}
                    />
                    <div className="d-flex gap-2 align-items-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                      <span className="fw-bold">{story.name}</span>
                      <span className="text-white-50">{story.time}</span>
                    </div>
                  </div>

                  {/* Imagen */}
                  <img 
                    src={story.img} 
                    alt="Historia" 
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

              </div>
            );
          })}
        </div>

        {/* Botones de navegación (posicionados respecto al viewport) */}
        <button className="story-arrow-btn prev" onClick={prevStory} disabled={current === 0}>❮</button>
        <button className="story-arrow-btn next" onClick={nextStory} disabled={current === stories.length - 1}>❯</button>

      </div>
    </div>
  );
};