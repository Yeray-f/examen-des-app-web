// services/productService.js — YS Books
// Servicio para gestionar productos con LocalStorage (simulación de API/CRUD)

const STORAGE_KEY = 'ysbooks_products'
const ORIGINAL_KEY = 'ysbooks_products_original'

/**
 * Inicializa el LocalStorage con los productos del JSON.
 * Solo lo hace si el localStorage está vacío (primera vez).
 * TAMBIÉN guarda una copia "original" para el reinicio.
 */
export function inicializarProductos(productosJson) {
  // Siempre actualizamos el backup original
  localStorage.setItem(ORIGINAL_KEY, JSON.stringify(productosJson))
  const existentes = localStorage.getItem(STORAGE_KEY)
  if (!existentes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productosJson))
  }
}

/**
 * Fuerza la inicialización aunque ya existan datos,
 * PRESERVANDO las imágenes actuales de cada producto.
 */
export function forzarInicializacion(productosJson) {
  localStorage.setItem(ORIGINAL_KEY, JSON.stringify(productosJson))
  // Preservar imágenes actuales
  const actuales = obtenerProductos()
  const imagenesActuales = {}
  actuales.forEach(p => {
    if (p.image) imagenesActuales[p.id] = p.image
  })
  const restaurados = productosJson.map(p => ({
    ...p,
    image: imagenesActuales[p.id] || p.image
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurados))
  window.dispatchEvent(new CustomEvent('ysbooks-updated'))
}

/**
 * Obtiene todos los productos del LocalStorage.
 */
export function obtenerProductos() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Guarda (reemplaza) todos los productos en LocalStorage.
 */
function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
  // Disparar evento para que otros componentes se enteren (misma pestaña)
  window.dispatchEvent(new CustomEvent('ysbooks-updated'))
}

/**
 * Agrega un nuevo producto.
 */
export function agregarProducto(producto) {
  const productos = obtenerProductos()
  const maxId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) : 0
  const nuevoProducto = { ...producto, id: maxId + 1 }
  productos.push(nuevoProducto)
  guardarProductos(productos)
  return nuevoProducto
}

/**
 * Edita un producto existente.
 */
export function editarProducto(productoEditado) {
  const productos = obtenerProductos()
  const index = productos.findIndex(p => p.id === productoEditado.id)
  if (index !== -1) {
    productos[index] = productoEditado
    guardarProductos(productos)
  }
}

/**
 * Elimina UN producto del LocalStorage por ID.
 * Solo elimina ese libro específico, NO todos los del autor.
 */
export function eliminarProducto(id) {
  const productos = obtenerProductos()
  const filtrados = productos.filter(p => p.id !== id)
  guardarProductos(filtrados)
}

/**
 * Reinicia los productos desde el backup original guardado,
 * PRESERVANDO las imágenes (URLs de portada) que tenga cada producto actualmente.
 * Si no hay backup, retorna false.
 */
export function reiniciarProductos() {
  const original = localStorage.getItem(ORIGINAL_KEY)
  if (original) {
    const originales = JSON.parse(original)
    // Obtener imágenes actuales para no perderlas
    const actuales = obtenerProductos()
    const imagenesActuales = {}
    actuales.forEach(p => {
      if (p.image) imagenesActuales[p.id] = p.image
    })
    // Restaurar datos originales pero manteniendo las imágenes actuales
    const restaurados = originales.map(p => ({
      ...p,
      image: imagenesActuales[p.id] || p.image
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurados))
    window.dispatchEvent(new CustomEvent('ysbooks-updated'))
    return true
  }
  return false
}

/**
 * Actualiza SOLO las URLs de imagen de los productos en localStorage
 * usando el JSON como fuente de verdad.
 * No toca ningún otro campo (precio, stock, nombre, etc.)
 * Esto resuelve el problema de imágenes rotas al actualizar el JSON.
 */
export function actualizarImagenes(productosJson) {
  const actuales = obtenerProductos()
  if (!actuales.length) return
  const mapaJson = {}
  productosJson.forEach(p => { mapaJson[p.id] = p.image })
  const actualizados = actuales.map(p => ({
    ...p,
    image: mapaJson[p.id] || p.image
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados))
  // También actualizar el backup original con las nuevas imágenes
  const originalData = localStorage.getItem(ORIGINAL_KEY)
  if (originalData) {
    const originales = JSON.parse(originalData)
    const originalesActualizados = originales.map(p => ({
      ...p,
      image: mapaJson[p.id] || p.image
    }))
    localStorage.setItem(ORIGINAL_KEY, JSON.stringify(originalesActualizados))
  }
}
