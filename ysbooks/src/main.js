// main.js — YS Books
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { inicializarProductos, actualizarImagenes } from './services/productService.js'

// Incrementar esta versión cada vez que se actualicen imágenes en products.json
// Esto fuerza la sincronización aunque el usuario tenga datos viejos en localStorage
const IMAGES_VERSION = '3'

async function bootstrap() {
  try {
    const response = await fetch('/products.json')
    const data = await response.json()

    // Si la versión de imágenes cambió, limpiar el localStorage para forzar recarga limpia
    const storedVersion = localStorage.getItem('ysbooks_images_version')
    if (storedVersion !== IMAGES_VERSION) {
      localStorage.removeItem('ysbooks_products')
      localStorage.removeItem('ysbooks_products_original')
      localStorage.setItem('ysbooks_images_version', IMAGES_VERSION)
    }

    inicializarProductos(data)
    actualizarImagenes(data) // Siempre sincroniza las URLs de imagen desde el JSON
  } catch {
    // Si falla la carga, la app igual arranca con lo que exista en localStorage
  }

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

bootstrap()
