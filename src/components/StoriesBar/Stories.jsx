import React, { useState } from "react";
import "./Stories.css";
import { NavLink } from "react-router-dom";

const stories = [
  { id: 1, name: "Nico", time: "2 h", avatar: "https://i.pravatar.cc/100?img=1", status: "new", img: "https://picsum.photos/400/700?random=1" },
  { id: 2, name: "Vale", time: "5 h", avatar: "https://i.pravatar.cc/100?img=2", status: "viewed", img: "https://picsum.photos/400/700?random=2" },
  { id: 3, name: "Juan", time: "8 h", avatar: "https://i.pravatar.cc/100?img=3", status: "new", img: "https://picsum.photos/400/700?random=3" },
  { id: 4, name: "Sofi", time: "10 h", avatar: "https://i.pravatar.cc/100?img=4", status: "viewed", img: "https://picsum.photos/400/700?random=4" },
  { id: 5, name: "Luis", time: "12 h", avatar: "https://i.pravatar.cc/100?img=5", status: "new", img: "https://picsum.photos/400/700?random=5" },
  { id: 6, name: "Ana", time: "15 h", avatar: "https://i.pravatar.cc/100?img=6", status: "new", img: "https://picsum.photos/400/700?random=6" },
  { id: 7, name: "Diego", time: "18 h", avatar: "https://i.pravatar.cc/100?img=7", status: "viewed", img: "https://picsum.photos/400/700?random=7" },
  { id: 8, name: "Camila", time: "20 h", avatar: "https://i.pravatar.cc/100?img=8", status: "new", img: "https://picsum.photos/400/700?random=8" },
];

export const Stories = () => {
  const [index, setIndex] = useState(0);

  const maxVisible = 6;
  const step = 4;

  const sortedStories = [...stories].sort((a, b) => {
    if (a.status === "viewed" && b.status !== "viewed") return 1;
    if (a.status !== "viewed" && b.status === "viewed") return -1;
    return 0;
  });

  const maxIndex = Math.max(0, sortedStories.length - maxVisible);

  const next = () => {
    setIndex((prev) => Math.min(prev + step, maxIndex));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - step, 0));
  };

  return (
    <div className="container mt-3 d-flex justify-content-center align-items-center gap-2">

      <button
        className="btn btn-light rounded-circle shadow-sm"
        onClick={prev}
        disabled={index === 0}
        aria-label="chevron-left"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="stories-viewport ml-5">
        <div
          className="stories-track"
          style={{
            transform: `translateX(-${index * (100 / maxVisible)}%)`
          }}
        >
          {sortedStories.map((story, mappedIndex) => (
            <NavLink 
              to={'/StoryView'}
              state={{ initialStoryIndex: mappedIndex }}
              key={story.id} 
              className="story-item text-center">
              <div className={`story-border ${story.status === "new" ? "new" : "viewed"}`}>
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
        aria-label="chevron-right"
      >
        <i className="bi bi-chevron-right"></i>
      </button>

    </div>
  );
};