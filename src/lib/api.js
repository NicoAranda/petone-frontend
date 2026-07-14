export const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8082/bff'

export const buildApi = (path = '') => {
  if (!path) return API
  return path.startsWith('/') ? `${API}${path}` : `${API}/${path}`
}

export default API
