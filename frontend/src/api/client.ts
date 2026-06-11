import axios from 'axios'

// Instance Axios centralisee. La base '/api' est redirigee vers le backend
// Spring Boot via le proxy Vite (cf. vite.config.ts).
const api = axios.create({
  baseURL: '/api',
})

// Intercepteur de requete : ajoute le token JWT s'il existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur de reponse : si 401, on deconnecte et on renvoie vers /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
