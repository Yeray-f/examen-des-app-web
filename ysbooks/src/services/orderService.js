import { createItem, deleteItem, getCollection, hasMockApi, patchItem, updateItem } from './apiClient.js'
import axios from 'axios'
import { readJsonStorage, writeJsonStorage } from '../utils/storage.js'
import { normalizeRole } from '../utils/roles.js'
import { obtenerUsuarioActual } from './authService.js'

const STORAGE_KEY = 'ysbooks_orders'
const ORIGINAL_KEY = 'ysbooks_orders_original'
const RESOURCE_PATH = import.meta.env.VITE_MOCKAPI_ORDERS_PATH || 'pedidos'
const ORDERS_SEED_URL = '/pedidos.json'

export const ESTADOS_PEDIDO = Object.freeze({
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  PREPARANDO: 'preparando',
  ENTREGADO: 'entregado'
})

const ESTADO_META = Object.freeze({
  [ESTADOS_PEDIDO.PENDIENTE]: { label: 'Pendiente', className: 'pendiente' },
  [ESTADOS_PEDIDO.APROBADO]: { label: 'Aprobado', className: 'aprobado' },
  [ESTADOS_PEDIDO.RECHAZADO]: { label: 'Rechazado', className: 'rechazado' },
  [ESTADOS_PEDIDO.PREPARANDO]: { label: 'Preparando', className: 'preparando' },
  [ESTADOS_PEDIDO.ENTREGADO]: { label: 'Entregado', className: 'entregado' }
})

function dispatchUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ysbooks-orders-updated'))
  }
}

function normalizeItem(item = {}) {
  return {
    id: Number(item.id || 0),
    name: String(item.name || '').trim(),
    author: String(item.author || '').trim(),
    price: Number(item.price || 0),
    precioOferta: item.precioOferta !== undefined && item.precioOferta !== null ? Number(item.precioOferta) : undefined,
    cantidad: Number(item.cantidad || 1),
    image: String(item.image || '').trim()
  }
}

function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase()
  if (ESTADO_META[value]) return value
  return ESTADOS_PEDIDO.PENDIENTE
}

function normalizeOrder(order = {}) {
  const items = Array.isArray(order.items) ? order.items.map(normalizeItem) : []
  const subtotalBase = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.cantidad || 1), 0)
  const descuentoBase = items.reduce((sum, item) => {
    const oferta = item.precioOferta !== undefined ? Number(item.precioOferta) : null
    if (oferta === null || Number.isNaN(oferta)) return sum
    return sum + Math.max(0, (Number(item.price || 0) - oferta) * Number(item.cantidad || 1))
  }, 0)

  return {
    id: Number(order.id || 0),
    usuarioId: order.usuarioId !== undefined && order.usuarioId !== null ? Number(order.usuarioId) : null,
    usuario: String(order.usuario || '').trim(),
    usuarioNombre: String(order.usuarioNombre || order.nombreUsuario || order.customerName || 'Cliente').trim(),
    role: normalizeRole(order.role || 'cliente'),
    estado: normalizeStatus(order.estado),
    metodoPago: String(order.metodoPago || 'Tarjeta').trim(),
    notas: String(order.notas || '').trim(),
    direccion: String(order.direccion || '').trim(),
    telefono: String(order.telefono || '').trim(),
    items,
    subtotal: Number(order.subtotal ?? subtotalBase),
    descuento: Number(order.descuento ?? descuentoBase),
    total: Number(order.total ?? Math.max(0, subtotalBase - descuentoBase)),
    observacion: String(order.observacion || '').trim(),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString()
  }
}

function getLocalOrders() {
  return readJsonStorage(STORAGE_KEY, [])
}

function setLocalOrders(orders) {
  writeJsonStorage(STORAGE_KEY, orders.map(normalizeOrder))
  dispatchUpdate()
}

function setOriginalOrders(orders) {
  writeJsonStorage(ORIGINAL_KEY, orders.map(normalizeOrder))
}

async function fetchSeedOrders() {
  const response = await axios.get('/pedidos.json')
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
    console.warn('[MockAPI pedidos] sincronización omitida:', error.message)
    return null
  }
}

function getSeedSnapshot() {
  return readJsonStorage(ORIGINAL_KEY, [])
}

export async function cargarPedidosIniciales() {
  try {
    const remote = hasMockApi() ? await getCollection(RESOURCE_PATH) : null
    const data = Array.isArray(remote) && remote.length ? remote : await fetchSeedOrders()
    const normalized = data.map(normalizeOrder)
    setOriginalOrders(normalized)
    if (getLocalOrders().length === 0) {
      setLocalOrders(normalized)
    }
    return normalized
  } catch (error) {
    console.warn('Usando pedidos locales por fallback:', error.message)
    const seed = getSeedSnapshot()
    if (Array.isArray(seed) && seed.length) {
      if (getLocalOrders().length === 0) {
        setLocalOrders(seed.map(normalizeOrder))
      }
      return seed.map(normalizeOrder)
    }
    try {
      const localSeed = await fetchSeedOrders()
      const normalized = localSeed.map(normalizeOrder)
      setOriginalOrders(normalized)
      if (getLocalOrders().length === 0) {
        setLocalOrders(normalized)
      }
      return normalized
    } catch {
      if (getLocalOrders().length === 0) setLocalOrders([])
      return []
    }
  }
}

export function obtenerPedidos() {
  const cache = getLocalOrders()
  if (Array.isArray(cache) && cache.length) return cache.map(normalizeOrder)
  const snapshot = getSeedSnapshot()
  if (Array.isArray(snapshot) && snapshot.length) {
    setLocalOrders(snapshot)
    return snapshot.map(normalizeOrder)
  }
  return []
}

export function obtenerPedidoPorId(id) {
  return obtenerPedidos().find(pedido => Number(pedido.id) === Number(id)) || null
}

export function obtenerPedidosPorUsuario(usuario) {
  const pedidos = obtenerPedidos()
  const usuarioId = usuario?.id !== undefined && usuario?.id !== null ? Number(usuario.id) : null
  const usuarioNombre = String(usuario?.nombre || usuario?.usuario || usuario || '').trim().toLowerCase()

  return pedidos.filter(pedido => {
    const coincideId = usuarioId !== null && Number(pedido.usuarioId) === usuarioId
    const coincideNombre = usuarioNombre && (
      String(pedido.usuarioNombre || '').trim().toLowerCase() === usuarioNombre ||
      String(pedido.usuario || '').trim().toLowerCase() === usuarioNombre
    )
    return coincideId || coincideNombre
  })
}

export function crearPedido({ user, items, metodoPago = 'Tarjeta', notas = '', direccion = '', telefono = '' } = {}) {
  const carrito = Array.isArray(items) ? items.map(normalizeItem).filter(item => item.id) : []
  if (!carrito.length) {
    throw new Error('El carrito está vacío.')
  }

  const usuario = user || obtenerUsuarioActual()
  if (!usuario) {
    throw new Error('Debes iniciar sesión para realizar compras.')
  }

  const pedidos = obtenerPedidos()
  const nextId = pedidos.length ? Math.max(...pedidos.map(pedido => Number(pedido.id) || 0)) + 1 : 1
  const subtotal = carrito.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.cantidad || 1), 0)
  const descuento = carrito.reduce((sum, item) => {
    if (item.precioOferta === undefined || item.precioOferta === null) return sum
    return sum + Math.max(0, (Number(item.price || 0) - Number(item.precioOferta || 0)) * Number(item.cantidad || 1))
  }, 0)

  const pedido = normalizeOrder({
    id: nextId,
    usuarioId: usuario.id ?? null,
    usuario: usuario.usuario || '',
    usuarioNombre: usuario.nombre || 'Cliente',
    role: usuario.role || 'cliente',
    estado: ESTADOS_PEDIDO.PENDIENTE,
    metodoPago,
    notas,
    direccion,
    telefono,
    items: carrito,
    subtotal,
    descuento,
    total: Math.max(0, subtotal - descuento),
    observacion: 'Pendiente de validación',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  pedidos.push(pedido)
  setLocalOrders(pedidos)
  void syncRemote('create', pedido)
  return pedido
}

export function actualizarEstadoPedido(id, estado, observacion = '') {
  const pedidos = obtenerPedidos()
  const index = pedidos.findIndex(pedido => Number(pedido.id) === Number(id))
  if (index === -1) return null

  const actualizado = normalizeOrder({
    ...pedidos[index],
    estado: normalizeStatus(estado),
    observacion: observacion || pedidos[index].observacion || '',
    updatedAt: new Date().toISOString()
  })

  pedidos[index] = actualizado
  setLocalOrders(pedidos)
  void syncRemote('update', actualizado, actualizado.id)
  return actualizado
}

export function eliminarPedido(id) {
  const pedidos = obtenerPedidos()
  const filtrados = pedidos.filter(pedido => Number(pedido.id) !== Number(id))
  setLocalOrders(filtrados)
  void syncRemote('delete', null, id)
  return filtrados
}

export function reiniciarPedidos() {
  const original = readJsonStorage(ORIGINAL_KEY, [])
  if (!Array.isArray(original) || original.length === 0) return false
  setLocalOrders(original.map(normalizeOrder))
  return true
}

export function resumenPedidos() {
  const pedidos = obtenerPedidos()
  const pendientes = pedidos.filter(pedido => pedido.estado === ESTADOS_PEDIDO.PENDIENTE).length
  const aprobados = pedidos.filter(pedido => pedido.estado === ESTADOS_PEDIDO.APROBADO || pedido.estado === ESTADOS_PEDIDO.PREPARANDO || pedido.estado === ESTADOS_PEDIDO.ENTREGADO).length
  const rechazados = pedidos.filter(pedido => pedido.estado === ESTADOS_PEDIDO.RECHAZADO).length
  const totalVentas = pedidos.reduce((sum, pedido) => sum + Number(pedido.total || 0), 0)
  return { total: pedidos.length, pendientes, aprobados, rechazados, totalVentas }
}

export function etiquetaEstadoPedido(estado) {
  return ESTADO_META[normalizeStatus(estado)]?.label || 'Pendiente'
}

export function claseEstadoPedido(estado) {
  return ESTADO_META[normalizeStatus(estado)]?.className || 'pendiente'
}

export function puedeValidarPedido(estado) {
  return [ESTADOS_PEDIDO.PENDIENTE, ESTADOS_PEDIDO.APROBADO, ESTADOS_PEDIDO.PREPARANDO].includes(normalizeStatus(estado))
}
