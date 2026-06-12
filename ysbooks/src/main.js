// main.js — YS Books
import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import router from './router/index.js'
import { cargarProductosIniciales, actualizarImagenes } from './services/productService.js'
import { cargarUsuariosIniciales } from './services/userService.js'
import { cargarPedidosIniciales } from './services/orderService.js'
import { resolveBookCover } from './utils/bookCover.js'

const SEED_VERSION = '7'

async function bootstrap() {
  try {
    const storedVersion = localStorage.getItem('ysbooks_seed_version')
    if (storedVersion !== SEED_VERSION) {
      ;[
        'ysbooks_products',
        'ysbooks_products_original',
        'ysbooks_users',
        'ysbooks_users_original',
        'ysbooks_orders',
        'ysbooks_orders_original',
        'ysbooks_session',
        'ysbooks_auth',
        'ysbooks_usuario'
      ].forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
      localStorage.setItem('ysbooks_seed_version', SEED_VERSION)
    }

    const [productos] = await Promise.all([
      cargarProductosIniciales(),
      cargarUsuariosIniciales(),
      cargarPedidosIniciales()
    ])
    actualizarImagenes(productos)
  } catch (error) {
    console.warn('Bootstrap incompleto, se usará el estado local disponible:', error)
  }

  const app = createApp(App)
  app.config.globalProperties.$resolveCover = (image, meta = {}) => resolveBookCover(image, meta?.title || 'Libro', meta?.id || 0)
  app.use(router)
  app.mount('#app')
}

bootstrap()
