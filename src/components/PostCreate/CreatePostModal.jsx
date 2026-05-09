import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [photos, setPhotos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [sexo, setSexo] = useState("Macho");
  const [estado, setEstado] = useState("Perdido");
  const [descripcion, setDescripcion] = useState("");

  const [loading, setLoading] = useState(false)

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

      setNombre("");
      setAddressQuery("");
      setEspecie("Perro");
      setSexo("Macho");
      setEstado("Perdido");
      setDescripcion("");

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
    setLoading(true)
    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("ubicacion", addressQuery);
    formData.append("especie", especie);
    formData.append("sexo", sexo);
    formData.append("estado", estado);
    formData.append("descripcion", descripcion);

    photos.forEach(photoObj => {
      formData.append("fotos", photoObj.file);
    });

    try {
      const API_ULR = "http://localhost:8080/api/publicaciones/con-imagenes"

      const response = await fetch(API_ULR, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("¡Publicación creada con éxito!");
        onClose();
      } else {
        toast.error("Hubo un problema al publicar la mascota.");
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
          <h5 className="m-0 fw-bold">Crear nueva publicación</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
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
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Firulais"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
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
              <select
                className="form-select"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold">Sexo</label>
              <select
                className="form-select"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
              >
                <option>Macho</option>
                <option>Hembra</option>
                <option>No sé</option>
              </select>
            </div>
            <div className="col-4">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className="form-select border-success text-success fw-bold"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option>Perdido</option>
                <option>Encontrado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Señas particulares, collar, color, etc..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            >
            </textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold rounded-pill py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' aria-hidden="true"></span>
                <span role='status'>Publicando...</span>
              </>
            ) : (
              "Publicar Mascota"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreatePostModal;