// services/productService.js — YS Books
// Servicio para gestionar productos con LocalStorage (simulación de API/CRUD)
// Los datos iniciales vienen de products.json y se precargan en LocalStorage

const STORAGE_KEY = 'ysbooks_products'

/**
 * Inicializa el LocalStorage con los productos del JSON.
 * Solo lo hace si el localStorage está vacío (primera vez).
 * @param {Array} productosJson - Arreglo de productos del archivo JSON
 */
export function inicializarProductos(productosJson) {
  const existentes = localStorage.getItem(STORAGE_KEY)
  if (!existentes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productosJson))
  }
}

/**
 * Obtiene todos los productos del LocalStorage.
 * @returns {Array} Lista de productos
 */
export function obtenerProductos() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Guarda (reemplaza) todos los productos en LocalStorage.
 * @param {Array} productos
 */
function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos))
}

/**
 * Agrega un nuevo producto al LocalStorage.
 * @param {Object} producto - Objeto sin ID
 * @returns {Object} Producto con ID asignado
 */
export function agregarProducto(producto) {
  const productos = obtenerProductos()
  // Generamos un ID único basado en el mayor ID existente
  const maxId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) : 0
  const nuevoProducto = { ...producto, id: maxId + 1 }
  productos.push(nuevoProducto)
  guardarProductos(productos)
  return nuevoProducto
}

/**
 * Edita un producto existente en el LocalStorage.
 * @param {Object} productoEditado - Debe incluir el ID
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
 * Elimina un producto del LocalStorage por ID.
 * @param {number} id
 */
export function eliminarProducto(id) {
  const productos = obtenerProductos()
  const filtrados = productos.filter(p => p.id !== id)
  guardarProductos(filtrados)
}

/**
 * Reinicia el LocalStorage borrando todos los productos.
 * Útil para forzar que se recarguen desde el JSON.
 */
export function reiniciarProductos() {
  localStorage.removeItem(STORAGE_KEY)
}