<template>
  <div class="dashboard-wrapper">
    <NavbarComponent :nombreUsuario="nombreUsuario" :role="rolUsuario" @logout="cerrarSesion" />
    <div class="dashboard-body">
      <SidebarComponent :role="rolUsuario" />
      <main class="dashboard-main">
        <router-view />
        <FooterComponent />
      </main>

      <aside class="right-panel d-none d-xl-flex">
        <!-- Recomendados para ti -->
        <section class="rp-section rp-section--tight">
          <div class="panel-header">
            <h3>Recomendados para ti</h3>
            <router-link to="/dashboard/catalogo" class="ver-todos-btn">Ver todos</router-link>
          </div>
          <div class="recomendados-list">
            <router-link
              v-for="(libro, i) in recomendados"
              :key="libro.id"
              :to="{ path: '/dashboard/catalogo', query: { q: libro.name } }"
              class="rec-item"
              title="Abrir en catálogo"
            >
              <div class="rec-cover">
                <img :src="libro.image" :alt="libro.name" loading="lazy" referrerpolicy="no-referrer" @error="onImgError" />
              </div>
              <div class="rec-info">
                <p class="rec-title">{{ libro.name }}</p>
                <p class="rec-author">{{ libro.author }}</p>
                <p class="rec-price">${{ formatPrecio(libro.price) }}</p>
              </div>
              <div class="rec-right">
                <button class="rec-heart" @click.prevent.stop title="Favorito"><i class="bi bi-heart"></i></button>
                <span class="rec-rating"><i class="bi bi-star-fill"></i> {{ recRatings[i] }}</span>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Categorías -->
        <section class="rp-section">
          <div class="panel-header">
            <h3>Explorar por categoría</h3>
            <router-link to="/dashboard/catalogo" class="ver-todos-btn">Abrir catálogo</router-link>
          </div>
          <div class="cat-grid">
            <router-link
              v-for="cat in categoriasPanel"
              :key="cat.nombre"
              :to="{ path: '/dashboard/catalogo', query: { category: cat.nombre } }"
              class="cat-chip"
              :title="'Ver libros de ' + cat.nombre"
            >
              <span class="cat-icon-box" aria-hidden="true">
                <svg
                  v-if="cat.nombre === 'Psicología'"
                  class="cat-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 8.5C8 6.015 10.015 4 12.5 4C14.985 4 17 6.015 17 8.5C17 10.022 16.242 11.366 15.084 12.185C16.226 12.998 17 14.344 17 15.875C17 18.36 14.985 20.375 12.5 20.375C10.015 20.375 8 18.36 8 15.875C8 14.344 8.774 12.998 9.916 12.185C8.758 11.366 8 10.022 8 8.5Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                  <path
                    d="M10 8.7C10 7.236 11.193 6.05 12.667 6.05C14.141 6.05 15.333 7.236 15.333 8.7C15.333 9.606 14.85 10.395 14.13 10.855C14.847 11.32 15.333 12.104 15.333 13C15.333 14.465 14.141 15.65 12.667 15.65C11.193 15.65 10 14.465 10 13C10 12.104 10.487 11.32 11.203 10.855C10.483 10.395 10 9.606 10 8.7Z"
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
                <i v-else :class="cat.icon" class="cat-icon"></i>
              </span>
              <span class="cat-label">{{ cat.nombre }}</span>
            </router-link>
          </div>
        </section>

        <!-- Autores destacados -->
        <section class="rp-section rp-section--authors">
          <div class="panel-header">
            <h3>Autores destacados</h3>
            <router-link to="/dashboard/autores" class="ver-todos-btn">Ver todos</router-link>
          </div>
          <div class="authors-list">
            <router-link
              v-for="autor in autoresDestacados"
              :key="autor.nombre"
              :to="{ path: '/dashboard/catalogo', query: { author: autor.nombre } }"
              class="author-item"
              :title="'Ver libros de ' + autor.nombre"
            >
              <img :src="autor.foto" :alt="autor.nombre" class="author-avatar" loading="lazy" referrerpolicy="no-referrer" @error="onAuthorError($event, autor.nombre)" />
              <div class="author-info">
                <p class="author-name">{{ autor.nombre }}</p>
                <span class="author-books">{{ autor.libros }} libros · {{ autor.categoria }}</span>
              </div>
              <i class="bi bi-chevron-right author-arrow"></i>
            </router-link>
          </div>
        </section>

        <!-- Pedidos pendientes -->
        <section v-if="esAdmin" class="rp-section rp-section--orders">
          <div class="panel-header">
            <h3>Pedidos pendientes</h3>
            <router-link to="/dashboard/pedidos" class="ver-todos-btn">Gestionar</router-link>
          </div>
          <div v-if="pedidosPendientes.length" class="orders-mini-list">
            <article v-for="pedido in pedidosPendientes" :key="pedido.id" class="order-mini">
              <div>
                <p class="order-mini__code">Pedido #{{ pedido.id }}</p>
                <p class="order-mini__meta">{{ pedido.usuarioNombre }} · {{ formatPrecio(pedido.total) }}</p>
              </div>
              <div class="order-mini-actions">
                <button type="button" class="btn-action btn-action--info" title="Aprobar" @click="validarPedido(pedido.id)"><i class="bi bi-check2"></i></button>
                <button type="button" class="btn-action btn-action--delete" title="Rechazar" @click="rechazarPedido(pedido.id)"><i class="bi bi-x-lg"></i></button>
              </div>
            </article>
          </div>
          <div v-else class="panel-empty">No hay pedidos pendientes.</div>
        </section>

        <!-- Oferta del día -->
        <section class="rp-section oferta-dia-box">
          <div class="oferta-header">
            <span class="oferta-label">Oferta del día</span>
            <span class="oferta-timer">{{ timerStr }}</span>
          </div>
          <div v-if="ofertaDia" class="oferta-content" @click="abrirLibro(ofertaDia)">
            <div class="oferta-cover">
              <img :src="ofertaDia.image" :alt="ofertaDia.name" loading="lazy" referrerpolicy="no-referrer" @error="onImgError" />
            </div>
            <div class="oferta-info">
              <p class="oferta-title">{{ ofertaDia.name }}</p>
              <p class="oferta-author">{{ ofertaDia.author }}</p>
              <div class="oferta-prices">
                <span class="oferta-new">${{ formatPrecio(Math.round(ofertaDia.price * 0.8)) }}</span>
                <div class="oferta-old-wrap">
                  <span class="oferta-old">${{ formatPrecio(ofertaDia.price) }}</span>
                  <span class="oferta-badge">-20%</span>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/dashboard/ofertas" class="ver-oferta-btn">
            Ver oferta <i class="bi bi-chevron-right ms-1"></i>
          </router-link>
        </section>
      </aside>
    </div>
    <!-- Cart Drawer global -->
    <CartDrawer />
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CartDrawer from '../components/CartDrawer.vue'
import { cerrarSesion as logoutSvc, obtenerNombreUsuario, obtenerRolActual } from '../services/authService.js'
import { obtenerProductos } from '../services/productService.js'
import { obtenerPedidos, actualizarEstadoPedido, cargarPedidosIniciales, etiquetaEstadoPedido, ESTADOS_PEDIDO } from '../services/orderService.js'


export default {
  name: 'DashboardView',
  components: { NavbarComponent, SidebarComponent, FooterComponent, CartDrawer },
  data() {
    return {
      nombreUsuario: obtenerNombreUsuario(),
      rolUsuario: obtenerRolActual(),
      recRatings: ['4.6', '4.4', '4.5', '4.3', '4.4', '4.6', '4.5', '4.3'],
      pedidos: [],
      categoriasPanel: [
        { nombre: 'Arte', icon: 'bi bi-palette-fill' },
        { nombre: 'Negocios', icon: 'bi bi-briefcase-fill' },
        { nombre: 'Detective', icon: 'bi bi-search' },
        { nombre: 'Desarrollo personal', icon: 'bi bi-stars' },
        { nombre: 'Novela', icon: 'bi bi-journal-bookmark-fill' },
        { nombre: 'Psicología', icon: 'bi bi-brain' },
      ],
      timerSeconds: 12 * 3600 + 45 * 60 + 30,
      timerInterval: null,
      autoresDestacados: [
        { nombre: 'Austin Kleon', iniciales: 'AK', foto: 'https://fundacionlasgracias.cl/wp-content/uploads/2022/03/austin_kleon.jpeg', libros: 6, categoria: 'Arte' },
        { nombre: 'Mark Manson', iniciales: 'MM', foto: 'https://cdn.prod.website-files.com/63b9c43cf803b0331540fa68/6700d4ccdb64bfceedea7786_Mark%20Manson.png', libros: 6, categoria: 'Psicología' },
        { nombre: 'Agatha Christie', iniciales: 'AC', foto: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/lanacionpy/wp-content/uploads/2017/11/13190753/AGATHA-CHRISTIE-RECUADRO.jpg', libros: 6, categoria: 'Misterio' },
        { nombre: 'Joseph Murphy', iniciales: 'JM', foto: 'https://images-na.ssl-images-amazon.com/images/I/41VDzk4kdML.jpg', libros: 6, categoria: 'Espiritualidad' },
        { nombre: 'Paulo Coelho', iniciales: 'PC', foto: 'https://imagessl.casadellibro.com/img/autores/34590.jpg', libros: 5, categoria: 'Novela' },
        { nombre: 'Yuval Noah Harari', iniciales: 'YH', foto: 'https://imagessl.casadellibro.com/img/autores/w/Harari.webp', libros: 5, categoria: 'Historia' },
        { nombre: 'Arthur Conan Doyle', iniciales: 'AD', foto: 'https://anikaentrelibros.com/media/154222/arthur-conan-doyle.jpg', libros: 6, categoria: 'Detective' },
        { nombre: 'Phil Knight', iniciales: 'PK', foto: 'https://cdn.britannica.com/18/250018-050-F2A4DFC5/Phil-Knight-Nike-2017.jpg', libros: 6, categoria: 'Negocios' },
      ],
    }
  },
  computed: {
    pedidosPendientes() {
      return this.pedidos.filter(pedido => pedido.estado === ESTADOS_PEDIDO.PENDIENTE).slice(0, 3)
    },
    recomendados() {
      return obtenerProductos().slice(0, 8)
    },
    ofertaDia() {
      const prods = obtenerProductos()
      return prods.find(p => p.id === 13) || prods[0]
    },
    timerStr() {
      const h = Math.floor(this.timerSeconds / 3600)
      const m = Math.floor((this.timerSeconds % 3600) / 60)
      const s = this.timerSeconds % 60
      return `${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s`
    }
  },
  async mounted() {
    this.rolUsuario = obtenerRolActual()
    await this.cargarPedidos()
    window.addEventListener('ysbooks-orders-updated', this.cargarPedidos)
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) this.timerSeconds--
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timerInterval)
    window.removeEventListener('ysbooks-orders-updated', this.cargarPedidos)
  },
  methods: {
    cerrarSesion() {
      logoutSvc()
      this.$router.push('/login')
    },
    abrirLibro(libro) {
      this.$router.push({ path: '/dashboard/catalogo', query: { q: libro.name } })
    },
    formatPrecio(p) { return Number(p).toLocaleString('es-CO') },
    onImgError(e) {
      const src = this.$resolveCover(null, { title: 'Libro', id: 0 })
      if (e?.target) {
        e.target.onerror = null
        e.target.src = src
      }
    },
    onAuthorError(e) {
      const src = '/assets/authors/avatar-fallback.svg'
      if (e?.target) {
        e.target.onerror = null
        e.target.src = src
      }
    },
    async cargarPedidos() {
      await cargarPedidosIniciales()
      this.pedidos = obtenerPedidos()
    },
    validarPedido(id) {
      const pedido = actualizarEstadoPedido(id, ESTADOS_PEDIDO.APROBADO, 'Validado desde el panel principal')
      if (pedido) this.pedidos = obtenerPedidos()
    },
    rechazarPedido(id) {
      const pedido = actualizarEstadoPedido(id, ESTADOS_PEDIDO.RECHAZADO, 'Rechazado desde el panel principal')
      if (pedido) this.pedidos = obtenerPedidos()
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; min-height: 100vh; background: var(--bg-darkest); }
.dashboard-body { display: flex; flex: 1; overflow: visible; align-items: stretch; }
.dashboard-main { flex: 1; overflow: visible; padding: 24px; background: var(--bg-darkest); min-height: 0; display: flex; flex-direction: column; }

.right-panel {
  width: 352px;
  min-width: 352px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #0f1526 0%, #0b1020 100%);
  border-left: none;
  box-shadow: inset 1px 0 0 rgba(124,58,237,.08);
  overflow: visible;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rp-section--orders { padding-bottom: 14px; }
.orders-mini-list { display: flex; flex-direction: column; gap: 10px; }
.order-mini { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(255,255,255,.03); border: 1px solid rgba(124,58,237,.08); border-radius: 14px; padding: 10px 12px; }
.order-mini__code { margin: 0; font-size: 12px; font-weight: 800; color: var(--text-primary); }
.order-mini__meta { margin: 0; font-size: 11px; color: var(--text-secondary); }
.order-mini-actions { display: flex; gap: 6px; }
.panel-empty { padding: 12px 0 2px; color: var(--text-muted); font-size: 12px; }

.rp-section {
  background: rgba(17,24,39,.82);
  border: 1px solid rgba(124,58,237,.12);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 28px rgba(0,0,0,.16);
}
.rp-section--tight { padding-bottom: 14px; }
.rp-section--authors { padding-bottom: 12px; }

.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.panel-header h3, .rp-section-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin: 0; }
.ver-todos-btn {
  font-size: 11px; color: var(--violet-lt); font-weight: 600;
  background: rgba(124,58,237,.1); border: 1px solid rgba(124,58,237,.2);
  padding: 4px 10px; border-radius: 20px; text-decoration: none; transition: all .2s;
}
.ver-todos-btn:hover { background: rgba(124,58,237,.18); transform: translateY(-1px); }

.recomendados-list { display: flex; flex-direction: column; gap: 10px; }
.rec-item {
  display: flex; align-items: center; gap: 10px; cursor: pointer; width: 100%;
  padding: 8px; border-radius: 14px; transition: background .2s, transform .2s;
  text-decoration: none; color: inherit;
}
.rec-item:hover { background: rgba(124,58,237,.08); transform: translateY(-1px); }
.rec-cover {
  width: 44px; height: 62px; border-radius: 10px; overflow: hidden;
  flex-shrink: 0; background: var(--bg-elevated); border: 1px solid var(--border-color);
  box-shadow: 0 6px 18px rgba(0,0,0,.22);
}
.rec-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rec-info { flex: 1; min-width: 0; }
.rec-title { font-size: 11px; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rec-author { font-size: 10px; color: var(--text-secondary); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rec-price { font-size: 12px; font-weight: 800; color: var(--accent); margin: 0; }
.rec-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.rec-heart { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; font-size: 13px; transition: color .2s; }
.rec-heart:hover { color: #f87171; }
.rec-rating { font-size: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 3px; }
.rec-rating i { color: var(--accent); font-size: 9px; }

.cat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.cat-chip {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 12px 8px; background: var(--bg-elevated);
  border: 1px solid var(--border-color); border-radius: 14px;
  cursor: pointer; transition: all .2s; text-decoration: none;
  color: var(--text-secondary); min-height: 92px; text-align: center;
}
.cat-chip:hover { border-color: rgba(124,58,237,.5); color: var(--violet-lt); background: rgba(124,58,237,.1); transform: translateY(-1px); }
.cat-icon-box {
  width: 40px; height: 40px; border-radius: 14px;
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(124,58,237,.12); color: var(--violet-lt);
  flex-shrink: 0;
}
.cat-icon { font-size: 1.05rem; line-height: 1; }
.cat-svg { width: 1.15rem; height: 1.15rem; display: block; color: currentColor; }
.cat-label { font-size: 9.5px; font-weight: 700; text-align: center; line-height: 1.15; min-height: 22px; display: flex; align-items: center; justify-content: center; }

.authors-list { display: flex; flex-direction: column; gap: 10px; }
.author-item {
  display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;
  padding: 10px 10px; border-radius: 16px; background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.04); transition: all .2s;
}
.author-item:hover { background: rgba(124,58,237,.08); border-color: rgba(124,58,237,.22); transform: translateY(-1px); }
.author-avatar {
  width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  object-fit: cover;
  background: linear-gradient(135deg, rgba(124,58,237,.95), rgba(37,99,235,.95));
  display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 13px;
  box-shadow: 0 0 18px rgba(124,58,237,.25);
  border: 1px solid rgba(255,255,255,.12);
}
.author-info { flex: 1; min-width: 0; }
.author-name { margin: 0; color: var(--text-primary); font-weight: 700; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.author-books { font-size: 10px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.author-arrow { color: var(--text-muted); font-size: 11px; }

.oferta-dia-box { background: rgba(124,58,237,.06); border-radius: 20px; padding: 16px; border: 1px solid rgba(124,58,237,.15); }
.oferta-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.oferta-label { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.oferta-timer { font-size: 10px; font-weight: 700; color: var(--violet-lt); background: rgba(124,58,237,.15); padding: 3px 8px; border-radius: 20px; font-variant-numeric: tabular-nums; }
.oferta-content { display: flex; gap: 12px; cursor: pointer; margin-bottom: 12px; padding: 10px; background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border-color); transition: border-color .2s, transform .2s; }
.oferta-content:hover { border-color: rgba(124,58,237,.4); transform: translateY(-1px); }
.oferta-cover { width: 56px; height: 76px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: var(--bg-elevated); border: 1px solid var(--border-color); }
.oferta-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.oferta-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
.oferta-title { font-size: 11px; font-weight: 700; color: var(--text-primary); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.oferta-author { font-size: 10px; color: var(--text-secondary); margin: 0; }
.oferta-prices { display: flex; flex-direction: column; gap: 2px; }
.oferta-new { font-size: 14px; font-weight: 800; color: var(--accent); }
.oferta-old-wrap { display: flex; align-items: center; gap: 6px; }
.oferta-old { font-size: 10px; color: var(--text-muted); text-decoration: line-through; }
.oferta-badge { background: var(--accent); color: #000; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 10px; }
.ver-oferta-btn {
  display: flex; align-items: center; justify-content: center;
  background: rgba(124,58,237,.15); border: 1px solid rgba(124,58,237,.3);
  color: var(--violet-lt); font-size: 12px; font-weight: 600;
  padding: 8px; border-radius: 14px; text-decoration: none; transition: all .2s;
}
.ver-oferta-btn:hover { background: rgba(124,58,237,.3); }

@media (max-width: 1400px) { .right-panel { display: none !important; } }
</style>