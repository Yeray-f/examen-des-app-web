// main.js — YS Books
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { inicializarProductos } from './services/productService.js'

// Cargar productos iniciales desde JSON si no están en localStorage
fetch('/products.json')
  .then(r => r.json())
  .then(data => inicializarProductos(data))
  .catch(() => {})

const app = createApp(App)
app.use(router)
app.mount('#app')