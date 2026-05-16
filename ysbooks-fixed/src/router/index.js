// router/index.js — YS Books (Segundo Parcial + Portada)
// Configuración de rutas con vue-router 4

import { createRouter, createWebHashHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InicioView from '../views/InicioView.vue'
import ProductView from '../views/ProductView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import OfertasView from '../views/OfertasView.vue'
import ClientesView from '../views/ClientesView.vue'
import AutoresView from '../views/AutoresView.vue'

// Guard de autenticación: si no hay sesión, redirigir a login
function requireAuth(to, from, next) {
  const autenticado = sessionStorage.getItem('ysbooks_auth')
  if (!autenticado) {
    next('/login')
  } else {
    next()
  }
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    beforeEnter: requireAuth,
    children: [
      { path: '', name: 'Inicio', component: InicioView },
      { path: 'catalogo', name: 'Catalogo', component: CatalogoView },
      { path: 'ofertas', name: 'Ofertas', component: OfertasView },
      { path: 'productos', name: 'Productos', component: ProductView },
      { path: 'clientes', name: 'Clientes', component: ClientesView },
      { path: 'autores', name: 'Autores', component: AutoresView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
