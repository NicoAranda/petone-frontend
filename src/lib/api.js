export const API = import.meta.env.VITE_BFF_URL || '/bff'

export const buildApi = (path = '') => {
  if (!path) return API
  return path.startsWith('/') ? `${API}${path}` : `${API}/${path}`
}

export default API
