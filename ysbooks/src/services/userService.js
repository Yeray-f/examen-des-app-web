import { createItem, deleteItem, getCollection, hasMockApi, patchItem, updateItem } from './apiClient.js'
import axios from 'axios'
import { readJsonStorage, writeJsonStorage } from '../utils/storage.js'
import { createPasswordRecord, isLegacyPasswordRecord } from '../utils/passwordHash.js'

const STORAGE_KEY = 'ysbooks_users'
const ORIGINAL_KEY = 'ysbooks_users_original'
const RESOURCE_PATH = import.meta.env.VITE_MOCKAPI_USERS_PATH || 'usuarios'
const USERS_SEED_URL = '/usuarios.json'

function normalizeUser(user) {
  return {
    id: Number(user.id),
    nombre: String(user.nombre || '').trim(),
    usuario: String(user.usuario || '').trim(),
    passwordHash: String(user.passwordHash || ''),
    passwordSalt: String(user.passwordSalt || ''),
    role: String(user.role || 'cliente').toLowerCase(),
    email: String(user.email || '').trim(),
    activo: user.activo !== false
  }
}

function stripSensitive(user) {
  const { password, ...rest } = user || {}
  return rest
}

function getLocalUsers() {
  return readJsonStorage(STORAGE_KEY, [])
}

function setLocalUsers(users) {
  writeJsonStorage(STORAGE_KEY, users.map(stripSensitive).map(normalizeUser))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ysbooks-users-updated'))
  }
}

function setOriginalUsers(users) {
  writeJsonStorage(ORIGINAL_KEY, users.map(stripSensitive).map(normalizeUser))
}

async function fetchSeedUsers() {
  const response = await axios.get(USERS_SEED_URL)
  return response.data
}

async function syncRemote(action, payload, id) {
  if (!hasMockApi()) return null
  try {
    if (action === 'create') return await createItem(RESOURCE_PATH, payload)
    if (action === 'update') return await updateItem(RESOURCE_PATH, id, payload)
    if (action === 'patch') return await patchItem(RESOURCE_PATH, id, payload)
    if (action === 'delete') return await deleteItem(RESOURCE_PATH, id)
    return null
  } catch (error) {
    console.warn('[MockAPI usuarios] sincronización omitida:', error.message)
    return null
  }
}

async function secureUsers(users = [], shouldSyncLegacy = false) {
  const secured = []

  for (const user of users) {
    const base = { ...user }

    if (isLegacyPasswordRecord(base)) {
      const secure = await createPasswordRecord(base.password)
      base.passwordHash = secure.passwordHash
      base.passwordSalt = secure.passwordSalt
      delete base.password

      if (shouldSyncLegacy && hasMockApi()) {
        try {
          await updateItem(RESOURCE_PATH, base.id, normalizeUser(base))
        } catch (error) {
          console.warn('[MockAPI usuarios] no fue posible migrar un usuario legado:', error.message)
        }
      }
    }

    secured.push(normalizeUser(base))
  }

  return secured
}

export async function cargarUsuariosIniciales() {
  try {
    const remote = hasMockApi() ? await getCollection(RESOURCE_PATH) : null
    const data = Array.isArray(remote) && remote.length ? remote : await fetchSeedUsers()
    const normalized = await secureUsers(data, Boolean(remote && remote.length))
    setOriginalUsers(normalized)
    if (getLocalUsers().length === 0) {
      setLocalUsers(normalized)
    }
    return normalized
  } catch (error) {
    console.warn('Usando usuarios locales por fallback:', error.message)
    const seed = await fetchSeedUsers()
    const normalized = await secureUsers(seed, false)
    setOriginalUsers(normalized)
    if (getLocalUsers().length === 0) {
      setLocalUsers(normalized)
    }
    return normalized
  }
}

export async function cargarUsuarios() {
  const cache = getLocalUsers()
  if (cache.length) return cache.map(normalizeUser)
  return cargarUsuariosIniciales()
}

export function obtenerUsuarios() {
  return getLocalUsers().map(normalizeUser)
}

export function obtenerUsuarioPorId(id) {
  return obtenerUsuarios().find(user => Number(user.id) === Number(id)) || null
}

export async function crearUsuario(usuario) {
  const usuarios = obtenerUsuarios()
  const nextId = usuarios.length ? Math.max(...usuarios.map(u => Number(u.id))) + 1 : 1

  const rawPassword = String(usuario.password || '').trim()
  if (!rawPassword) {
    throw new Error('La contraseña es obligatoria.')
  }

  const passwordData = await createPasswordRecord(rawPassword)
  const nuevo = normalizeUser({
    ...usuario,
    id: nextId,
    passwordHash: passwordData.passwordHash,
    passwordSalt: passwordData.passwordSalt
  })

  usuarios.push(nuevo)
  setLocalUsers(usuarios)
  await syncRemote('create', nuevo)
  return nuevo
}

export async function actualizarUsuario(usuario) {
  const usuarios = obtenerUsuarios()
  const index = usuarios.findIndex(u => Number(u.id) === Number(usuario.id))
  if (index === -1) return null

  const existente = usuarios[index]
  const rawPassword = String(usuario.password || '').trim()
  let secureFields = {
    passwordHash: existente.passwordHash,
    passwordSalt: existente.passwordSalt
  }

  if (rawPassword) {
    secureFields = await createPasswordRecord(rawPassword)
  }

  const actualizado = normalizeUser({
    ...existente,
    ...usuario,
    ...secureFields,
    id: existente.id
  })

  usuarios[index] = actualizado
  setLocalUsers(usuarios)
  await syncRemote('update', actualizado, actualizado.id)
  return actualizado
}

export async function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios()
  const filtrados = usuarios.filter(user => Number(user.id) !== Number(id))
  setLocalUsers(filtrados)
  await syncRemote('delete', null, id)
  return filtrados
}

export function reiniciarUsuarios() {
  const original = readJsonStorage(ORIGINAL_KEY, [])
  if (!Array.isArray(original) || original.length === 0) return false
  setLocalUsers(original.map(normalizeUser))
  return true
}

export function obtenerUsuarioSesion() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('ysbooks_session') || sessionStorage.getItem('ysbooks_session')
  if (!raw) return null

  try {
    const session = JSON.parse(raw)
    return session?.user || null
  } catch {
    return null
  }
}

export function obtenerRolUsuario() {
  return obtenerUsuarioSesion()?.role || 'cliente'
}
