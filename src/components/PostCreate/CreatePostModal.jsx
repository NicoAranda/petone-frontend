import React, { useState, useEffect, useRef } from 'react';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [photos, setPhotos] = useState([]);
  
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const MAPBOX_TOKEN = "pk.eyJ1IjoidHZiYWwyMjExIiwiYSI6ImNtb3cxbjg2NzAyb2YycnEzM2pwMXB5MXEifQ.qmFEvntjChjIxEfdfOfMww"; 

  const galleryRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setPhotos([]);
      setAddressQuery(""); 
      setSuggestions([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (addressQuery.length > 3 && MAPBOX_TOKEN !== "pk.AQUI_VA_TU_TOKEN_DE_MAPBOX") {
        
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressQuery)}.json?access_token=${MAPBOX_TOKEN}&country=cl&limit=5&language=es`;

        fetch(url)
          .then(res => res.json())
          .then(data => {
            setSuggestions(data.features || []);
            setShowSuggestions(true);
          })
          .catch(err => console.error("Error buscando dirección en Mapbox:", err));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [addressQuery]);

  const handleSelectAddress = (place) => {
    setAddressQuery(place.place_name); 
    setShowSuggestions(false);           
    console.log("Dirección Mapbox seleccionada:", place);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) {
      alert("Puedes subir un máximo de 10 imágenes.");
      return;
    }
    const newPhotosUrls = files.map(file => URL.createObjectURL(file));
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold">Crear nueva publicación</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold text-success d-flex justify-content-between">
              <span>Fotos de la mascota</span>
              <span className="text-muted small">{photos.length} / 10</span>
            </label>
            
            <div className="carousel-wrapper">
              {photos.length > 0 && (
                <button type="button" className="carousel-btn left" onClick={() => scrollGallery('left')}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              )}

              <div className="photo-gallery-container" ref={galleryRef}>
                {photos.map((photoUrl, index) => (
                  <div key={index} className="photo-preview-wrapper">
                    <img src={photoUrl} alt={`Vista previa ${index}`} className="preview-img-small" />
                    <button 
                      type="button" 
                      className="btn-remove-photo" 
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}

                {photos.length < 10 && (
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

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label fw-semibold">Nombre (Opcional)</label>
              <input type="text" className="form-control" placeholder="Ej: Firulais" />
            </div>
            
            <div className="col-6 position-relative">
              <label className="form-label fw-semibold">Ubicación</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: Costanera Center, Providencia" 
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                required 
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1060, maxHeight: '200px', overflowY: 'auto' }}>
                  {suggestions.map((place, index) => (
                    <li 
                      key={index} 
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectAddress(place)}
                      style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <i className="bi bi-geo-alt-fill text-success me-2"></i>
                      {place.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label fw-semibold">Especie</label>
              <select className="form-select">
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold">Sexo</label>
              <select className="form-select">
                <option>Macho</option>
                <option>Hembra</option>
                <option>No sé</option>
              </select>
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold">Estado</label>
              <select className="form-select border-success text-success fw-bold">
                <option>Perdido</option>
                <option>Encontrado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea className="form-control" rows="3" placeholder="Señas particulares, collar, color, etc..."></textarea>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill py-2">
            Publicar Mascota
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreatePostModal;