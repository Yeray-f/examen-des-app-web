import usuariosLocales from '../../public/usuarios.json'
import { getCollection, hasMockApi, updateItem } from './apiClient.js'
import { normalizeRole, roleLabel, ROLES } from '../utils/roles.js'
import { createPasswordRecord, isLegacyPasswordRecord, verifyPassword } from '../utils/passwordHash.js'
import { useAuthStore } from '../stores/authStore.js'

const RESOURCE_PATH = import.meta.env.VITE_MOCKAPI_USERS_PATH || 'usuarios'

function createToken(usuario) {
  const base = `${usuario.usuario || 'user'}-${Date.now()}`
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${base}-${crypto.randomUUID()}`
  }

  return `${base}-${Math.random().toString(36).slice(2, 10)}`
}

function persistSession(session) {
  if (typeof window === 'undefined') return
  const { setSession } = useAuthStore()
  setSession(session)
}

export async function cargarUsuariosAuth() {
  if (!hasMockApi()) {
    return usuariosLocales
  }

  return getCollection(RESOURCE_PATH).catch(()=>usuariosLocales)
}

export async function validarCredenciales(usuario, password) {
  const listado = await cargarUsuariosAuth()
  const username = String(usuario || '').trim().toLowerCase()
  const candidate = Array.isArray(listado)
    ? listado.find(item => String(item.usuario || '').trim().toLowerCase() === username && item.activo !== false)
    : null

  if (!candidate) return null

  if (await verifyPassword(password, candidate)) {
    return candidate
  }

  if (isLegacyPasswordRecord(candidate) && String(candidate.password) === String(password)) {
    try {
      const secure = await createPasswordRecord(password)
      await updateItem(RESOURCE_PATH, candidate.id, {
        ...candidate,
        ...secure,
        password: undefined
      })
    } catch {
      // La migración es opcional; no bloquea el acceso si la API no permite actualizar.
    }

    return candidate
  }

  return null
}

export async function iniciarSesion(usuario, password) {
  if (!hasMockApi()) {
    throw new Error('Servicio no disponible')
  }

  const identidad = String(usuario || '').trim()
  const clave = String(password || '')

  if (!identidad || !clave) {
    throw new Error('Completa usuario y contraseña.')
  }

  let encontrado = null

  try {
    encontrado = await validarCredenciales(identidad, clave)
  } catch (error) {
    throw new Error('Servicio no disponible')
  }

  if (!encontrado) {
    throw new Error('Usuario o contraseña incorrectos.')
  }

  const sesion = {
    token: createToken(encontrado),
    user: {
      id: encontrado.id,
      nombre: encontrado.nombre,
      usuario: encontrado.usuario,
      role: normalizeRole(encontrado.role),
      email: encontrado.email || ''
    },
    createdAt: new Date().toISOString()
  }

  persistSession(sesion)
  return sesion
}

export function guardarSesion(usuario) {
  const sesion = {
    token: createToken(usuario),
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      role: normalizeRole(usuario.role),
      email: usuario.email || ''
    },
    createdAt: new Date().toISOString()
  }
  persistSession(sesion)
  return sesion
}

export function cerrarSesion() {
  const { clearSession } = useAuthStore()
  clearSession()
}

export function obtenerSesion() {
  if (typeof window === 'undefined') return null
  const { syncFromStorage } = useAuthStore()
  const sesion = syncFromStorage()
  if (sesion?.user) {
    sesion.user.role = normalizeRole(sesion.user.role)
    return sesion
  }
  return null
}

export function isAuthenticated() {
  return Boolean(obtenerSesion())
}

export function obtenerUsuarioActual() {
  return obtenerSesion()?.user || null
}

export function obtenerNombreUsuario() {
  return obtenerUsuarioActual()?.nombre || 'Usuario'
}

export function obtenerRolActual() {
  return normalizeRole(obtenerUsuarioActual()?.role)
}

export function esAdministrador() {
  return obtenerRolActual() === ROLES.ADMIN
}

export function obtenerEtiquetaRol() {
  return roleLabel(obtenerRolActual())
}
