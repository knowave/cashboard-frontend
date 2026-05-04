import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed', error)
    return Promise.reject(error)
  },
)
