import React, { useState, useEffect } from 'react'
import logo from '../../assets/images/logo.png' // Asegúrate de que la ruta sea correcta
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext' // <-- Importamos nuestro hook
import './SideBar.css'

export const SideBar = ({ onOpenModal }) => {
  const [hover, setHover] = useState(false)
  
  // Extraemos el estado y la función de logout del contexto
  const { isAuthenticated, logout, user } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--sidebar-width', '80px')
    } catch (e) { }
  }, [])

  const menuItems = [
    { icon: "bi-house-fill", label: "Inicio", path: "/HomePage" },
    { icon: "bi-info-circle-fill", label: "Sobre Nosotros", path: "/about" },
    { icon: "bi-plus-circle-fill", label: "Crear publicación", action: onOpenModal },
    ...(isAuthenticated && user?.rol === 'ADMIN' 
      ? [{ icon: "bi-shield-lock-fill", label: "Administración", path: "/admin" }] 
      : []
    ),
    { icon: "bi-chat-fill", label: "Mensajes", path: "/mensajes" },
    { icon: "bi-search", label: "Buscar", path: "/buscar" },
  ]

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login'); // Opcional: redirigir al login tras cerrar sesión
  }

  return (
    <>
      <div
        onMouseEnter={() => { setHover(true); try { document.documentElement.style.setProperty('--sidebar-width', '220px') } catch (e) { } }}
        onMouseLeave={() => { setHover(false); try { document.documentElement.style.setProperty('--sidebar-width', '80px') } catch (e) { } }}
        className="d-flex flex-column justify-content-between position-fixed top-0 start-0 vh-100 py-3 sidebar"
      >

        {/* Menú Superior */}
        <div className="d-flex flex-column gap-4 flex-grow-1 justify-content-center">
          {menuItems.map((item, index) => {
            if (item.action) {
              return (
                <div
                  key={index}
                  onClick={item.action}
                  className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none fw-bold text-dark"
                  style={{ cursor: "pointer" }}
                >
                  <i className={`bi ${item.icon} fs-4`}></i>
                  <span style={{ opacity: hover ? 1 : 0, transition: "0.2s", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                </div>
              )
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `d-flex align-items-center gap-3 px-3 py-2 text-decoration-none fw-bold text-dark ${isActive ? 'active' : ''}`}
                style={{ cursor: "pointer" }}
              >
                <i className={`bi ${item.icon} fs-4`}></i>
                <span style={{ opacity: hover ? 1 : 0, transition: "0.2s", whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>

        {/* ========================================== */}
        {/* Parte inferior: Renderizado Condicional    */}
        {/* ========================================== */}
        <div className="d-flex flex-column gap-3 px-3 mb-3">
          {isAuthenticated ? (
            <>
              {/* Botón Ver Perfil */}
              <NavLink to={'/perfil'} className="d-flex align-items-center gap-3 text-decoration-none" style={{ cursor: "pointer" }}>
                <i className="bi bi-person-fill fs-4 fw-bold text-dark"></i>
                <span className="fw-bold text-dark" style={{ opacity: hover ? 1 : 0, transition: "0.2s", whiteSpace: "nowrap" }}>
                  Ver Perfil
                </span>
              </NavLink>
              
              {/* Botón Cerrar Sesión */}
              <div onClick={handleLogout} className="d-flex align-items-center gap-3 text-decoration-none" style={{ cursor: "pointer" }}>
                <i className="bi bi-box-arrow-right fs-4 fw-bold text-danger"></i>
                <span className="fw-bold text-danger" style={{ opacity: hover ? 1 : 0, transition: "0.2s", whiteSpace: "nowrap" }}>
                  Cerrar Sesión
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Botón Iniciar Sesión */}
              <NavLink to={'/login'} className="d-flex align-items-center gap-3 text-decoration-none" style={{ cursor: "pointer" }}>
                <i className="bi bi-box-arrow-in-right fs-4 fw-bold text-dark"></i>
                <span className="fw-bold text-dark" style={{ opacity: hover ? 1 : 0, transition: "0.2s", whiteSpace: "nowrap" }}>
                  Iniciar Sesión
                </span>
              </NavLink>
            </>
          )}
        </div>

      </div>
    </>
  )
}