import React, { useState } from "react";
import "./Stories.css";

const stories = [
  { id: 1, name: "Nico", img: "https://i.pravatar.cc/100?img=1", status: "new" },
  { id: 2, name: "Vale", img: "https://i.pravatar.cc/100?img=2", status: "viewed" },
  { id: 3, name: "Juan", img: "https://i.pravatar.cc/100?img=3", status: "new" },
  { id: 4, name: "Sofi", img: "https://i.pravatar.cc/100?img=4", status: "viewed" },
  { id: 5, name: "Luis", img: "https://i.pravatar.cc/100?img=5", status: "new" },
  { id: 6, name: "Ana", img: "https://i.pravatar.cc/100?img=6", status: "new" },
  { id: 7, name: "Diego", img: "https://i.pravatar.cc/100?img=7", status: "viewed" },
  { id: 8, name: "Camila", img: "https://i.pravatar.cc/100?img=8", status: "new" },
];

export const Stories = () => {
  const [index, setIndex] = useState(0);

  const maxVisible = 6;
  const step = 4;

  // 🔹 Ordenar: nuevas primero
  const sortedStories = [...stories].sort((a, b) => {
    if (a.status === "viewed" && b.status !== "viewed") return 1;
    if (a.status !== "viewed" && b.status === "viewed") return -1;
    return 0;
  });

  // 🔹 🔥 CLAVE: límite correcto para evitar espacios vacíos
  const maxIndex = Math.max(0, sortedStories.length - maxVisible);

  const next = () => {
    setIndex((prev) => Math.min(prev + step, maxIndex));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - step, 0));
  };

  return (
    <div className="container mt-3 d-flex justify-content-center align-items-center gap-2">

      {/* ← */}
      <button
        className="btn btn-light rounded-circle shadow-sm"
        onClick={prev}
        disabled={index === 0}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* VIEWPORT */}
      <div className="stories-viewport ml-5">

        {/* TRACK */}
        <div
          className="stories-track"
          style={{
            transform: `translateX(-${index * (100 / maxVisible)}%)`
          }}
        >
          {sortedStories.map((story) => (
            <div key={story.id} className="story-item text-center">
              <div className={`story-border ${story.status === "new" ? "new" : "viewed"}`}>
                <img
                  src={story.img}
                  alt={story.name}
                  className="story-img"
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* → */}
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