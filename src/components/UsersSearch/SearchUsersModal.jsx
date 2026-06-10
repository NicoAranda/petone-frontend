import React, { useEffect } from 'react'
import SearchUsers from './SearchUsers'
import '../PostCreate/CreatePostModal.css'

export const SearchUsersModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="m-0 fw-bold">Buscar usuarios</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Escribe al menos 2 caracteres para encontrar usuarios.
            </p>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <SearchUsers maxWidth={700} />
      </div>
    </div>
  )
}

export default SearchUsersModal
