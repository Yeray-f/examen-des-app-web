<template>
  <!-- SidebarComponent: menú lateral YS Books con carrito funcional -->
  <aside class="ys-sidebar d-flex flex-column align-items-center py-3">
    <div class="sidebar-logo mb-4">
      <svg viewBox="0 0 40 40" fill="none" width="30">
        <rect width="40" height="40" rx="10" fill="url(#sbGrad)" />
        <path d="M10 28V14a2 2 0 012-2h6v18H12a2 2 0 01-2-2z" fill="white" opacity=".9" />
        <path d="M20 12h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V12z" fill="white" opacity=".6" />
        <defs>
          <linearGradient id="sbGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#7C3AED" /><stop offset="1" stop-color="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <nav class="sidebar-nav d-flex flex-column align-items-center gap-1 w-100">
      <router-link to="/dashboard" exact class="sb-link" active-class="sb-link--active" title="Inicio">
        <i class="bi bi-house-door-fill"></i>
        <span class="sb-label">Inicio</span>
      </router-link>
      <router-link to="/dashboard/catalogo" class="sb-link" active-class="sb-link--active" title="Catálogo">
        <i class="bi bi-grid-fill"></i>
        <span class="sb-label">Libros</span>
      </router-link>
      <router-link to="/dashboard/productos" class="sb-link" active-class="sb-link--active" title="Gestión">
        <i class="bi bi-book-fill"></i>
        <span class="sb-label">Gestión</span>
      </router-link>
      <router-link to="/dashboard/clientes" class="sb-link" active-class="sb-link--active" title="Clientes">
        <i class="bi bi-people-fill"></i>
        <span class="sb-label">Clientes</span>
      </router-link>
      <router-link to="/dashboard/autores" class="sb-link" active-class="sb-link--active" title="Autores">
        <i class="bi bi-person-lines-fill"></i>
        <span class="sb-label">Autores</span>
      </router-link>
      <router-link to="/dashboard/ofertas" class="sb-link" active-class="sb-link--active" title="Ofertas">
        <i class="bi bi-tags-fill"></i>
        <span class="sb-label">Ofertas</span>
      </router-link>
    </nav>

    <div class="cart-fab mt-auto mb-2 position-relative" title="Carrito de compras" @click="cart.abrirCarrito()">
      <i class="bi bi-bag-fill"></i>
      <span v-if="cart.totalItems > 0" class="cart-count">{{ cart.totalItems > 99 ? '99+' : cart.totalItems }}</span>
    </div>
  </aside>
</template>

<script>
import { cartStore } from '../services/cartService.js'
export default {
  name: 'SidebarComponent',
  data() { return { cart: cartStore } }
}
</script>

<style scoped>
.ys-sidebar { width: 68px; min-height: 100%; background: var(--bg-dark); border-right: 1px solid var(--border-color); flex-shrink: 0; }
.sidebar-logo { padding: 4px; }
.sidebar-nav { flex: 1; }
.sb-link { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: var(--r-sm); color: var(--text-secondary); font-size: 1.15rem; transition: all .2s; text-decoration: none; position: relative; gap: 2px; }
.sb-link:hover { background: rgba(124,58,237,.15); color: var(--violet-lt); }
.sb-link--active { background: rgba(124,58,237,.2) !important; color: var(--violet-lt) !important; }
.sb-link--active::before { content: ''; position: absolute; left: -9px; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: var(--grad-main); border-radius: 0 3px 3px 0; }
.sb-label { font-size: 0.55rem; font-weight: 600; letter-spacing: .3px; }
.cart-fab { width: 44px; height: 44px; background: var(--grad-main); border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; box-shadow: var(--shadow-glow); cursor: pointer; transition: transform .2s, box-shadow .2s; }
.cart-fab:hover { transform: scale(1.08); box-shadow: 0 0 32px rgba(124,58,237,.55); }
.cart-count { position: absolute; top: -6px; right: -6px; background: var(--accent); color: #000; min-width: 18px; height: 18px; border-radius: 9px; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; padding: 0 4px; border: 2px solid var(--bg-darkest); animation: badgePop 0.25s ease; }
@keyframes badgePop { from { transform: scale(0.6); } to { transform: scale(1); } }
</style>
