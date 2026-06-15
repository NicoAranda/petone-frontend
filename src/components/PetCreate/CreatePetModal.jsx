import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import '../PostCreate/CreatePostModal.css';
import { API } from '../../lib/api'

const CreatePetModal = ({ isOpen, onClose, onCreated }) => {
  const [photos, setPhotos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [tamano, setTamano] = useState("Medio");
  const [estado, setEstado] = useState("Activo");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const galleryRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setPhotos([]);
      setNombre("");
      setRaza("");
      setColor("");
      setTamano("Medio");
      setEstado("Activo");
      setDescripcion("");
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("Puedes subir un máximo de 5 imágenes.");
      return;
    }
    const newPhotosUrls = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotosUrls]);
    e.target.value = null;
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 120;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      toast.error("El nombre de la mascota es requerido");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Extraer userId del token
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        userId = decodedPayload.id;
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    formData.append("nombre", nombre);
    formData.append("raza", raza || "No especificada");
    formData.append("color", color || "No especificado");
    formData.append("tamano", tamano);
    formData.append("estado", estado);
    formData.append("descripcion", descripcion);
    if (userId) {
      formData.append("usuarioId", userId);
    }

    photos.forEach(photoObj => {
      formData.append("fotos", photoObj.file);
    });

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API}/mascotas`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("¡Mascota creada con éxito!");
        onClose();
        // Refetch después de cerrar el modal
        if (onCreated) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Pequeño delay
          await onCreated(data);
        }
      } else {
        console.error('Error creating pet:', response.status);
        toast.error("Hubo un problema al crear la mascota.");
      }
    } catch (error) {
      console.error("Error de conexión: ", error);
      toast.error("Error de red al intentar conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold">Registrar nueva mascota</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-success d-flex justify-content-between">
              <span>Fotos de la mascota <span className="text-muted small">(opcional)</span></span>
              <span className="text-muted small">{photos.length} / 5</span>
            </label>

            <div className="carousel-wrapper">
              {photos.length > 0 && (
                <button type="button" className="carousel-btn left" onClick={() => scrollGallery('left')}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              )}

              <div className="photo-gallery-container" ref={galleryRef}>
                {photos.map((photoObj, index) => (
                  <div key={index} className="photo-preview-wrapper">
                    <img src={photoObj.preview} alt={`Vista previa ${index}`} className="preview-img-small" />
                    <button
                      type="button"
                      className="btn-remove-photo"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}

                {photos.length < 5 && (
                  <div className="photo-upload-box small-box">
                    <i className="bi bi-camera fs-3 text-muted"></i>
                    <input
                      type="file"
                      className="file-input"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                    />
                  </div>
                )}
              </div>

              {photos.length > 0 && (
                <button type="button" className="carousel-btn right" onClick={() => scrollGallery('right')}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Firulais"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold">Raza</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Golden Retriever"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold">Color</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Marrón"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold">Tamaño</label>
              <select
                className="form-select"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
              >
                <option>Pequeño</option>
                <option>Medio</option>
                <option>Grande</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option>Activo</option>
                <option>Reportado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Características especiales, collar, manchas, etc..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold rounded-pill py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' aria-hidden="true"></span>
                <span role='status'>Creando...</span>
              </>
            ) : (
              "Crear Mascota"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetModal;
