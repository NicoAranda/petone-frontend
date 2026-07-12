import React, { useEffect, useState } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SideBar.css';

export const SideBar = ({
  onOpenModal,
  onOpenSearch
}) => {
  const [hover, setHover] = useState(false);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.matchMedia('(min-width: 992px)').matches;
  });

  const { isAuthenticated, logout, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin =
    user?.rol?.toUpperCase() === 'ADMIN';

  const menuItems = [
    {
      icon: 'bi-house-fill',
      label: 'Inicio',
      path: '/HomePage'
    },
    {
      icon: 'bi-info-circle-fill',
      label: 'Sobre Nosotros',
      path: '/about'
    },
    {
      icon: 'bi-plus-circle-fill',
      label: 'Crear publicación',
      action: onOpenModal
    },
    ...(isAuthenticated && isAdmin
      ? [
        {
          icon: 'bi-shield-lock-fill',
          label: 'Administración',
          path: '/admin'
        }
      ]
      : []),
    {
      icon: 'bi-chat-fill',
      label: 'Mensajes',
      path: '/mensajes'
    },
    {
      icon: 'bi-search',
      label: 'Buscar',
      action: onOpenSearch
    }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width: 992px)'
    );

    const updateSidebarWidth = (desktop) => {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        desktop ? '80px' : '0px'
      );
    };

    const handleScreenChange = (event) => {
      setIsDesktop(event.matches);
      setHover(false);
      updateSidebarWidth(event.matches);

      if (event.matches) {
        closeMobileMenu();
      }
    };

    setIsDesktop(mediaQuery.matches);
    updateSidebarWidth(mediaQuery.matches);

    mediaQuery.addEventListener(
      'change',
      handleScreenChange
    );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleScreenChange
      );
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isDesktop) {
      return;
    }

    setHover(true);

    document.documentElement.style.setProperty(
      '--sidebar-width',
      '220px'
    );
  };

  const handleMouseLeave = () => {
    if (!isDesktop) {
      return;
    }

    setHover(false);

    document.documentElement.style.setProperty(
      '--sidebar-width',
      '80px'
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    const offcanvasElement = document.getElementById("mobileSidebar");

    if (!offcanvasElement || !window.bootstrap) return;

    const offcanvas =
      window.bootstrap.Offcanvas.getInstance(offcanvasElement) ||
      window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);

    offcanvas.hide();
  };

  const handleMobileNavigation = (path) => {
    closeMobileMenu();

    window.setTimeout(() => {
      navigate(path);
    }, 200);
  };

  const handleMobileAction = (action) => {
    closeMobileMenu();

    window.setTimeout(() => {
      if (typeof action === 'function') {
        action();
      }
    }, 250);
  };

  const handleMobileLogout = () => {
    closeMobileMenu();

    window.setTimeout(() => {
      logout();
      navigate('/login');
    }, 200);
  };

  const isMobileRouteActive = (path) => {
    if (!path) {
      return false;
    }

    return location.pathname === path;
  };

  const renderDesktopMenuItem = (
    item,
    index
  ) => {
    if (item.action) {
      return (
        <button
          key={`${item.label}-${index}`}
          type="button"
          onClick={item.action}
          className="
            sidebar-item
            d-flex
            align-items-center
            gap-3
            px-3
            py-2
            border-0
            bg-transparent
            fw-bold
            text-dark
            w-100
          "
        >
          <i
            className={`bi ${item.icon} fs-4`}
          />

          <span
            className="sidebar-label"
            style={{
              opacity: hover ? 1 : 0
            }}
          >
            {item.label}
          </span>
        </button>
      );
    }

    return (
      <NavLink
        key={`${item.label}-${index}`}
        to={item.path}
        className={({ isActive }) =>
          `
            sidebar-item
            d-flex
            align-items-center
            gap-3
            px-3
            py-2
            text-decoration-none
            fw-bold
            text-dark
            ${isActive ? 'active' : ''}
          `
        }
      >
        <i
          className={`bi ${item.icon} fs-4`}
        />

        <span
          className="sidebar-label"
          style={{
            opacity: hover ? 1 : 0
          }}
        >
          {item.label}
        </span>
      </NavLink>
    );
  };

  const renderMobileMenuItem = (
    item,
    index
  ) => {
    if (item.action) {
      return (
        <button
          key={`${item.label}-${index}`}
          type="button"
          onClick={() =>
            handleMobileAction(item.action)
          }
          className=" mobile-menu-item d-flex align-items-center gap-3 px-3 py-3 border-0 bg-transparent text-dark fw-bold w-100"
        >
          <i
            className={`bi ${item.icon} fs-4`}
          />

          <span>{item.label}</span>
        </button>
      );
    }

    const active = isMobileRouteActive(
      item.path
    );

    return (
      <button
        key={`${item.label}-${index}`}
        type="button"
        onClick={() =>
          handleMobileNavigation(item.path)
        }
        className={`
          mobile-menu-item
          d-flex
          align-items-center
          gap-3
          px-3
          py-3
          border-0
          bg-transparent
          text-dark
          fw-bold
          w-100
          ${active ? 'active' : ''}
        `}
      >
        <i
          className={`bi ${item.icon} fs-4`}
        />

        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Navbar móvil */}
      <nav
        className="
          navbar
          mobile-navbar
          fixed-top
          d-lg-none
          shadow-sm
        "
      >
        <div className="container-fluid">
          <button
            type="button"
            className="
              navbar-brand
              border-0
              bg-transparent
              fw-bold
              text-dark
              d-flex
              align-items-center
              gap-2
            "
            onClick={() =>
              handleMobileNavigation(
                '/HomePage'
              )
            }
          >
            <i className="bi bi-heart-pulse-fill text-success" />

            <span>PetOne</span>
          </button>

          <button
            className="
              navbar-toggler
              border-0
              shadow-none
            "
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
            aria-label="Abrir menú de navegación"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>

      {/* Evita que el navbar fijo tape el contenido */}
      <div className="mobile-navbar-spacer d-lg-none" />

      {/* Menú móvil */}
      <div
        className="
          offcanvas
          offcanvas-start
          mobile-offcanvas
        "
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header border-bottom">
          <div>
            <h5
              className="offcanvas-title fw-bold"
              id="mobileSidebarLabel"
            >
              PetOne
            </h5>

            {isAuthenticated && (
              <small className="text-muted">
                {user?.nombre
                  ? `${user.nombre} ${user?.apellido || ''
                    }`.trim()
                  : 'Usuario autenticado'}
              </small>
            )}
          </div>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar menú"
          />
        </div>

        <div className="offcanvas-body d-flex flex-column p-0">
          <div className="flex-grow-1 py-3">
            {menuItems.map(
              renderMobileMenuItem
            )}
          </div>

          <div className="border-top p-3">
            {isAuthenticated ? (
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleMobileNavigation(
                      '/perfil'
                    )
                  }
                  className={`
                    mobile-menu-item
                    d-flex
                    align-items-center
                    gap-3
                    px-3
                    py-3
                    border-0
                    bg-transparent
                    fw-bold
                    text-dark
                    w-100
                    rounded-3
                    ${isMobileRouteActive(
                    '/perfil'
                  )
                      ? 'active'
                      : ''
                    }
                  `}
                >
                  <i className="bi bi-person-fill fs-4" />

                  <span>Ver Perfil</span>
                </button>

                <button
                  type="button"
                  onClick={handleMobileLogout}
                  className="
                    mobile-menu-item
                    d-flex
                    align-items-center
                    gap-3
                    px-3
                    py-3
                    border-0
                    bg-transparent
                    fw-bold
                    text-danger
                    w-100
                    rounded-3
                  "
                >
                  <i className="bi bi-box-arrow-right fs-4" />

                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleMobileNavigation(
                    '/login'
                  )
                }
                className={`
                  mobile-menu-item
                  d-flex
                  align-items-center
                  gap-3
                  px-3
                  py-3
                  border-0
                  bg-transparent
                  fw-bold
                  text-dark
                  w-100
                  rounded-3
                  ${isMobileRouteActive(
                  '/login'
                )
                    ? 'active'
                    : ''
                  }
                `}
              >
                <i className="bi bi-box-arrow-in-right fs-4" />

                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar de escritorio */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="
          sidebar
          d-none
          d-lg-flex
          flex-column
          justify-content-between
          position-fixed
          top-0
          start-0
          vh-100
          py-3
        "
      >
        <div className="d-flex flex-column gap-4 flex-grow-1 justify-content-center">
          {menuItems.map(
            renderDesktopMenuItem
          )}
        </div>

        <div className="d-flex flex-column gap-3 px-3 mb-3">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  `
                    sidebar-item
                    d-flex
                    align-items-center
                    gap-3
                    text-decoration-none
                    ${isActive ? 'active' : ''}
                  `
                }
              >
                <i className="bi bi-person-fill fs-4 fw-bold text-dark" />

                <span
                  className="
                    sidebar-label
                    fw-bold
                    text-dark
                  "
                  style={{
                    opacity: hover ? 1 : 0
                  }}
                >
                  Ver Perfil
                </span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  sidebar-item
                  d-flex
                  align-items-center
                  gap-3
                  border-0
                  bg-transparent
                  p-0
                  w-100
                "
              >
                <i className="bi bi-box-arrow-right fs-4 fw-bold text-danger" />

                <span
                  className="
                    sidebar-label
                    fw-bold
                    text-danger
                  "
                  style={{
                    opacity: hover ? 1 : 0
                  }}
                >
                  Cerrar Sesión
                </span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `
                  sidebar-item
                  d-flex
                  align-items-center
                  gap-3
                  text-decoration-none
                  ${isActive ? 'active' : ''}
                `
              }
            >
              <i className="bi bi-box-arrow-in-right fs-4 fw-bold text-dark" />

              <span
                className="
                  sidebar-label
                  fw-bold
                  text-dark
                "
                style={{
                  opacity: hover ? 1 : 0
                }}
              >
                Iniciar Sesión
              </span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};