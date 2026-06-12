import { createItem, deleteItem, getCollection, hasMockApi, patchItem, updateItem } from './apiClient.js'
import axios from 'axios'
import { readJsonStorage, writeJsonStorage } from '../utils/storage.js'

const STORAGE_KEY = 'ysbooks_products'
const ORIGINAL_KEY = 'ysbooks_products_original'
const RESOURCE_PATH = import.meta.env.VITE_MOCKAPI_PRODUCTS_PATH || 'productos'
const PRODUCTS_SEED_URL = '/products.json'

function normalizeProduct(producto) {
  return {
    id: Number(producto.id),
    name: String(producto.name || '').trim(),
    author: String(producto.author || '').trim(),
    category: String(producto.category || '').trim(),
    price: Number(producto.price || 0),
    stock: Number(producto.stock || 0),
    image: String(producto.image || '').trim(),
    description: String(producto.description || '').trim(),
    badge: producto.badge || '',
    rating: producto.rating || '',
    precioOferta: producto.precioOferta !== undefined ? Number(producto.precioOferta) : undefined,
    activo: producto.activo !== false
  }
}

function getLocalProducts() {
  return readJsonStorage(STORAGE_KEY, [])
}

function setLocalProducts(productos) {
  writeJsonStorage(STORAGE_KEY, productos.map(normalizeProduct))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ysbooks-updated'))
  }
}

function setOriginalProducts(productos) {
  writeJsonStorage(ORIGINAL_KEY, productos.map(normalizeProduct))
}

async function fetchSeedProducts() {
  const response = await axios.get('/products.json')
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
    console.warn('[MockAPI productos] sincronización omitida:', error.message)
    return null
  }
}

export async function cargarProductosIniciales() {
  try {
    const remote = hasMockApi() ? await getCollection(RESOURCE_PATH) : null
    const data = Array.isArray(remote) && remote.length ? remote : await fetchSeedProducts()
    const normalized = data.map(normalizeProduct)
    setOriginalProducts(normalized)
    if (getLocalProducts().length === 0) {
      setLocalProducts(normalized)
    }
    return normalized
  } catch (error) {
    console.warn('Usando productos locales por fallback:', error.message)
    const seed = await fetchSeedProducts()
    const normalized = seed.map(normalizeProduct)
    setOriginalProducts(normalized)
    if (getLocalProducts().length === 0) {
      setLocalProducts(normalized)
    }
    return normalized
  }
}

export function inicializarProductos(productosJson) {
  const normalized = (productosJson || []).map(normalizeProduct)
  setOriginalProducts(normalized)
  if (!getLocalProducts().length) {
    setLocalProducts(normalized)
  }
}

export function forzarInicializacion(productosJson) {
  const normalized = (productosJson || []).map(normalizeProduct)
  setOriginalProducts(normalized)
  const actuales = getLocalProducts()
  const imagenesActuales = {}
  actuales.forEach(producto => {
    if (producto.image) imagenesActuales[producto.id] = producto.image
  })
  const restaurados = normalized.map(producto => ({
    ...producto,
    image: imagenesActuales[producto.id] || producto.image
  }))
  setLocalProducts(restaurados)
}

export function obtenerProductos() {
  return getLocalProducts().map(normalizeProduct)
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find(producto => Number(producto.id) === Number(id)) || null
}

export async function agregarProducto(producto) {
  const productos = obtenerProductos()
  const nextId = productos.length ? Math.max(...productos.map(p => Number(p.id))) + 1 : 1
  const nuevo = normalizeProduct({ ...producto, id: nextId })
  productos.push(nuevo)
  setLocalProducts(productos)
  await syncRemote('create', nuevo)
  return nuevo
}

export async function editarProducto(productoEditado) {
  const productos = obtenerProductos()
  const index = productos.findIndex(producto => Number(producto.id) === Number(productoEditado.id))
  if (index === -1) return null
  const actualizado = normalizeProduct({ ...productos[index], ...productoEditado, id: productos[index].id })
  productos[index] = actualizado
  setLocalProducts(productos)
  await syncRemote('update', actualizado, actualizado.id)
  return actualizado
}

export async function eliminarProducto(id) {
  const productos = obtenerProductos()
  const filtrados = productos.filter(producto => Number(producto.id) !== Number(id))
  setLocalProducts(filtrados)
  await syncRemote('delete', null, id)
  return filtrados
}

export function reiniciarProductos() {
  const original = readJsonStorage(ORIGINAL_KEY, [])
  if (!Array.isArray(original) || original.length === 0) return false
  const actuales = getLocalProducts()
  const imagenesActuales = {}
  actuales.forEach(producto => {
    if (producto.image) imagenesActuales[producto.id] = producto.image
  })
  const restaurados = original.map(producto => ({
    ...normalizeProduct(producto),
    image: imagenesActuales[producto.id] || producto.image
  }))
  setLocalProducts(restaurados)
  return true
}

export function actualizarImagenes(productosJson) {
  const productosActuales = obtenerProductos()
  const referencias = new Map((productosJson || []).map(producto => [Number(producto.id), producto.image || '']))
  const actualizados = productosActuales.map(producto => ({
    ...producto,
    image: referencias.get(Number(producto.id)) || producto.image
  }))
  setLocalProducts(actualizados)
}

export function buscarProductosPorTexto(texto = '') {
  const q = String(texto).trim().toLowerCase()
  if (!q) return obtenerProductos()
  return obtenerProductos().filter(producto =>
    producto.name.toLowerCase().includes(q) ||
    producto.author.toLowerCase().includes(q) ||
    producto.category.toLowerCase().includes(q)
  )
}
