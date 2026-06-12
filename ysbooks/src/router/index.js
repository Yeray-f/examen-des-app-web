// router/index.js — YS Books
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InicioView from '../views/InicioView.vue'
import ProductView from '../views/ProductView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import OfertasView from '../views/OfertasView.vue'
import ClientesView from '../views/ClientesView.vue'
import AutoresView from '../views/AutoresView.vue'
import PerfilView from '../views/PerfilView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import PedidosView from '../views/PedidosView.vue'
import { cerrarSesion, obtenerSesion, obtenerRolActual, obtenerNombreUsuario } from '../services/authService.js'
import { ROLES, normalizeRole } from '../utils/roles.js'

function defaultRouteForRole(role) {
  return normalizeRole(role) === ROLES.ADMIN ? '/dashboard/inicio' : '/dashboard/catalogo'
}

function isAuthenticated() {
  return Boolean(obtenerSesion())
}

const routes = [
  {
    path: '/',
    redirect: () => (isAuthenticated() ? defaultRouteForRole(obtenerRolActual()) : '/login')
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: () => defaultRouteForRole(obtenerRolActual()) },
      { path: 'inicio', name: 'Inicio', component: InicioView, meta: { requiresAuth: true, roles: [ROLES.ADMIN] } },
      { path: 'catalogo', name: 'Catalogo', component: CatalogoView, meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.CLIENTE] } },
      { path: 'ofertas', name: 'Ofertas', component: OfertasView, meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.CLIENTE] } },
      { path: 'perfil', name: 'Perfil', component: PerfilView, meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.CLIENTE] } },
      { path: 'pedidos', name: 'Pedidos', component: PedidosView, meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.CLIENTE] } },
      { path: 'productos', name: 'Productos', component: ProductView, meta: { requiresAuth: true, roles: [ROLES.ADMIN] } },
      { path: 'usuarios', name: 'Usuarios', component: UsuariosView, meta: { requiresAuth: true, roles: [ROLES.ADMIN] } },
      { path: 'clientes', name: 'Clientes', component: ClientesView, meta: { requiresAuth: true, roles: [ROLES.ADMIN] } },
      { path: 'autores', name: 'Autores', component: AutoresView, meta: { requiresAuth: true, roles: [ROLES.ADMIN] } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: () => (isAuthenticated() ? defaultRouteForRole(obtenerRolActual()) : '/login') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const session = obtenerSesion()
  const role = session?.user?.role || null

  if (to.meta.guestOnly && session) {
    next(defaultRouteForRole(role))
    return
  }

  if (to.meta.requiresAuth && !session) {
    next('/login')
    return
  }

  const allowedRoles = to.meta.roles
  if (Array.isArray(allowedRoles) && allowedRoles.length && session && !allowedRoles.includes(role)) {
    next(defaultRouteForRole(role))
    return
  }

  if (!to.meta.requiresAuth && to.path === '/login' && session) {
    next(defaultRouteForRole(role))
    return
  }

  next()
})

export default router
