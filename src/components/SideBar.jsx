import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { NavLink } from 'react-router-dom'

export const SideBar = () => {

  const [hover, setHover] = useState(false)

  const menuItems = [
    { icon: "bi-house-fill", label: "Inicio", path: "/" },
    { icon: "bi-play-btn", label: "Videos", path: "/videos" },
    { icon: "bi-chat-fill", label: "Comentarios", path: "/comentarios" },
    { icon: "bi-search", label: "Buscar", path: "/buscar" },
  ]

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="d-flex flex-column justify-content-between position-fixed top-0 start-0 vh-100 py-3"
        style={{
          width: hover ? "220px" : "80px",
          transition: "0.3s",
          overflow: "hidden"
        }}
      >
        {/* Logo */}
        <div className="d-flex align-items-left">
          <img
            src={logo}
            alt="logo"
            style={{ width: "100px" }}
          />
        </div>

        {/* Menú */}
        <div className="d-flex flex-column gap-4 flex-grow-1 justify-content-center">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 px-3 py-2 text-decoration-none fw-bold text-black
                }`
              }
              style={{ cursor: "pointer" }}
            >
              <i className={`bi ${item.icon} fs-4`}></i>

              <span
                style={{
                  opacity: hover ? 1 : 0,
                  transition: "0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Parte inferior */}
        <div className="d-flex flex-column gap-4 px-3">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-list fs-4"></i>
            <span style={{ opacity: hover ? 1 : 0 }}>Menú</span>
          </div>
        </div>
      </div>
    </>
  )
}