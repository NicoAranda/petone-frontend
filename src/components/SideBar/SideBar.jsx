import React, { useState, useEffect } from 'react'
import logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router-dom'
import './SideBar.css'

// 1. Recibimos la función onOpenModal
export const SideBar = ({ onOpenModal }) => {

  const [hover, setHover] = useState(false)

  useEffect(() => {
    // set default sidebar width CSS variable
    try {
      document.documentElement.style.setProperty('--sidebar-width', '80px')
    } catch (e) {}
  }, [])

  // 2. Modificamos los items. A "Crear publicación" le quitamos el "path" y le agregamos "action"
  const menuItems = [
    { icon: "bi-house-fill", label: "Inicio", path: "/" },
    { icon: "bi-play-btn", label: "Videos", path: "/videos" },
    { icon: "bi-plus-circle-fill", label: "Crear publicación", action: onOpenModal }, // <-- Cambio aquí
    { icon: "bi-chat-fill", label: "Mensajes", path: "/mensajes" },
    { icon: "bi-search", label: "Buscar", path: "/buscar" },
  ]

  return (
    <>
      <div
        onMouseEnter={() => { setHover(true); try { document.documentElement.style.setProperty('--sidebar-width', '220px') } catch(e){} }}
        onMouseLeave={() => { setHover(false); try { document.documentElement.style.setProperty('--sidebar-width', '80px') } catch(e){} }}
        className="d-flex flex-column justify-content-between position-fixed top-0 start-0 vh-100 py-3 sidebar"
      >
        {/* Logo */}
        <div className="d-flex align-items-left">
          <img
            src={logo}
            alt="logo"
            className="logo-img"
          />
        </div>

        {/* Menú */}
        <div className="d-flex flex-column gap-4 flex-grow-1 justify-content-center">
          {menuItems.map((item, index) => {
            
            // 3. Si el item tiene un "action" (como nuestro botón de crear), renderizamos un div clickeable
            if (item.action) {
              return (
                <div
                  key={index}
                  onClick={item.action}
                  className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none fw-bold text-dark"
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
                </div>
              )
            }

            // 4. Si no tiene "action", renderizamos el NavLink normal para navegar
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `d-flex align-items-center gap-3 px-3 py-2 text-decoration-none fw-bold text-dark ${isActive ? 'active' : ''}`}
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
            )
          })}
        </div>

        {/* Parte inferior */}
        <div className="d-flex flex-column gap-4 px-3">
          <div className="d-flex align-items-center gap-3" style={{ cursor: "pointer" }}>
            <i className="bi bi-list fs-4 fw-bold text-dark"></i>
            <span className="fw-bold text-dark" style={{ opacity: hover ? 1 : 0, transition: "0.2s" }}>Menú</span>
          </div>
        </div>
      </div>
    </>
  )
}