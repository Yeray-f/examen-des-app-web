import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Error de conexión'
    return Promise.reject(new Error(message))
  }
)

export function hasMockApi() {
  return Boolean(BASE_URL)
}

async function unwrap(promise) {
  const { data } = await promise
  return data
}

export const getCollection = (resource) => unwrap(api.get(`/${resource}`))
export const getItem = (resource, id) => unwrap(api.get(`/${resource}/${id}`))
export const createItem = (resource, payload) => unwrap(api.post(`/${resource}`, payload))
export const updateItem = (resource, id, payload) => unwrap(api.put(`/${resource}/${id}`, payload))
export const patchItem = (resource, id, payload) => unwrap(api.patch(`/${resource}/${id}`, payload))
export const deleteItem = (resource, id) => unwrap(api.delete(`/${resource}/${id}`))
export default api