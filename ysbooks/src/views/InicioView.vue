<template>
  <div class="inicio-wrap">

    <!-- Hero / Bienvenida con stats -->
    <div class="hero-banner mb-4">
      <div class="hero-icon me-3">
        <i class="bi bi-house-door-fill fs-4"></i>
      </div>
      <div>
        <h2 class="hero-title">Bienvenido a YS Books</h2>
        <p class="hero-sub">Gestiona tu librería desde aquí.</p>
      </div>
      <div class="stats-row ms-auto d-none d-lg-flex">
        <div class="stat-pill" style="--c:rgba(124,58,237,.2);--ct:#9d6ef5">
          <i class="bi bi-book-fill"></i>
          <div><span class="stat-val">{{ totalProductos }}</span><span class="stat-lbl">Total Libros</span></div>
        </div>
        <div class="stat-pill" style="--c:rgba(37,99,235,.2);--ct:#60a5fa">
          <i class="bi bi-tags-fill"></i>
          <div><span class="stat-val">{{ totalCategorias }}</span><span class="stat-lbl">Categorías</span></div>
        </div>
        <div class="stat-pill" style="--c:rgba(245,158,11,.2);--ct:#fbbf24">
          <i class="bi bi-currency-dollar"></i>
          <div><span class="stat-val">${{ precioPromedio }}</span><span class="stat-lbl">Precio Promedio</span></div>
        </div>
        <div class="stat-pill" style="--c:rgba(16,185,129,.2);--ct:#34d399">
          <i class="bi bi-people-fill"></i>
          <div><span class="stat-val">{{ totalAutores }}</span><span class="stat-lbl">Autores</span></div>
        </div>
      </div>
    </div>

    <!-- Stats cards para mobile -->
    <div class="row g-3 mb-4 d-lg-none">
      <div class="col-6 col-sm-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(124,58,237,.2);color:#9d6ef5"><i class="bi bi-book-fill fs-5"></i></div>
          <div><p class="stat-card__label">Total Libros</p><h4 class="stat-card__value">{{ totalProductos }}</h4></div>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(37,99,235,.2);color:#60a5fa"><i class="bi bi-tags-fill fs-5"></i></div>
          <div><p class="stat-card__label">Categorías</p><h4 class="stat-card__value">{{ totalCategorias }}</h4></div>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,.2);color:#fbbf24"><i class="bi bi-currency-dollar fs-5"></i></div>
          <div><p class="stat-card__label">Precio Promedio</p><h4 class="stat-card__value">${{ precioPromedio }}</h4></div>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(16,185,129,.2);color:#34d399"><i class="bi bi-people-fill fs-5"></i></div>
          <div><p class="stat-card__label">Autores</p><h4 class="stat-card__value">{{ totalAutores }}</h4></div>
        </div>
      </div>
    </div>

    <!-- Sección: Nuevos libros -->
    <section class="section mb-4">
      <div class="section-header mb-3">
        <h2 class="section-title">Nuevos libros</h2>
        <router-link to="/dashboard/catalogo" class="ver-todos-btn">Ver todos →</router-link>
      </div>
      <div class="books-row">
        <ProductCardComponent
          v-for="libro in nuevosLibros"
          :key="libro.id"
          :producto="libro"
          @verDetalle="verDetalle"
          @agregar="agregarAlCarrito"
        />
      </div>
    </section>

    <!-- Sección: Ofertas especiales -->
    <section class="section mb-4">
      <div class="section-header mb-3">
        <h2 class="section-title">🏷️ Ofertas especiales</h2>
        <router-link to="/dashboard/ofertas" class="ver-todos-btn">Ver todos →</router-link>
      </div>
      <div class="offers-grid">
        <div v-for="oferta in ofertasEspeciales" :key="oferta.id" class="offer-card">
          <div class="offer-cover">
            <span class="offer-discount">-{{ oferta.descuento }}%</span>
            <img v-if="oferta.image" :src="oferta.image" :alt="oferta.name" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" @error="e => { e.target.onerror = null; e.target.src = '/assets/covers/cover-fallback.svg' }" />
            <div v-else class="cover-fallback-of" :style="{ background: colorOf(oferta.id) }">
              <i class="bi bi-book-fill text-white fs-2 opacity-75"></i>
            </div>
          </div>
          <div class="offer-info">
            <p class="offer-title">{{ oferta.name }}</p>
            <p class="offer-author">{{ oferta.author }}</p>
            <div class="offer-prices">
              <span class="offer-new-price">${{ formatPrecio(oferta.precioOferta) }}</span>
              <span class="offer-old-price">${{ formatPrecio(oferta.price) }}</span>
            </div>
            <button class="offer-add-btn" @click="agregarAlCarrito(oferta)">
              <i class="bi bi-bag-plus me-1"></i>Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast -->
    <div v-if="toast" class="ys-toast show">
      <i class="bi bi-check-circle-fill text-success me-2"></i>{{ toast }}
    </div>

    <!-- Modal detalle del libro -->
    <div v-if="libroSeleccionado" class="modal-overlay-ys" @click.self="cerrarDetalle">
      <div class="modal-ys">
        <button class="modal-x-btn" @click="cerrarDetalle"><i class="bi bi-x"></i></button>
        <div class="modal-cover">
          <img v-if="libroSeleccionado.image" :src="libroSeleccionado.image" :alt="libroSeleccionado.name" @error="e => { e.target.onerror = null; e.target.src = '/assets/covers/cover-fallback.svg' }" />
          <div v-else class="cover-fallback-modal">📚</div>
          <span v-if="libroSeleccionado.badge" class="book-badge-modal">{{ libroSeleccionado.badge }}</span>
        </div>
        <div class="modal-info">
          <span class="modal-cat">{{ libroSeleccionado.category }}</span>
          <h3 class="modal-title">{{ libroSeleccionado.name }}</h3>
          <p class="modal-author">{{ libroSeleccionado.author }}</p>
          <div class="modal-rating">
            <span class="stars">★★★★☆</span>
            <span class="rating-num">{{ libroSeleccionado.rating || '4.2' }}</span>
          </div>
          <p class="modal-desc">{{ libroSeleccionado.description }}</p>
          <div class="modal-price-row">
            <span class="modal-price">${{ formatPrecio(libroSeleccionado.price) }}</span>
          </div>
          <div class="modal-actions">
            <button class="btn-modal-cart" @click="agregarAlCarrito(libroSeleccionado); cerrarDetalle()">
              <i class="bi bi-bag-plus me-2"></i>Agregar al carrito
            </button>
            <button class="btn-modal-ghost" @click="cerrarDetalle">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { obtenerProductos } from '../services/productService.js'
import { cartStore } from '../services/cartService.js'

const DESCUENTOS = [20, 15, 20, 15, 20, 10]
const PALETA_OF = ['#1a2235','#2a1a5e','#0f2a50','#1e3a3a','#3a1a1a','#1a3a1a']

export default {
  name: 'InicioView',
  components: { ProductCardComponent },
  data() {
    return {
      productos: [],
      libroSeleccionado: null,
      toast: ''
    }
  },
  computed: {
    totalProductos() { return this.productos.length },
    totalCategorias() { return new Set(this.productos.map(p => p.category)).size },
    totalAutores() { return new Set(this.productos.map(p => p.author)).size },
    precioPromedio() {
      if (!this.productos.length) return 0
      const s = this.productos.reduce((a, p) => a + p.price, 0)
      return Math.round(s / this.productos.length).toLocaleString('es-CO')
    },
    nuevosLibros() {
      const badges = ['ESPECIAL','POPULAR',null,null,'ESPECIAL','POPULAR',null,'TOP']
      return this.productos.slice(0, 8).map((p, i) => ({
        ...p,
        badge: badges[i] || null,
        rating: (3.8 + (i * 0.12)).toFixed(1)
      }))
    },
    ofertasEspeciales() {
      return this.productos.slice(0, 6).map((p, i) => ({
        ...p, descuento: DESCUENTOS[i], precioOferta: Math.round(p.price * (1 - DESCUENTOS[i] / 100))
      }))
    }
  },
  created() { this.productos = obtenerProductos() },
  methods: {
    verDetalle(libro) { this.libroSeleccionado = libro },
    cerrarDetalle() { this.libroSeleccionado = null },
    agregarAlCarrito(libro) {
      cartStore.agregar(libro)
      this.toast = `"${libro.name}" agregado al carrito`
      setTimeout(() => { this.toast = '' }, 2500)
    },
    formatPrecio(price) { return Number(price).toLocaleString('es-CO') },
    colorOf(id) { return PALETA_OF[id % PALETA_OF.length] }
  }
}
</script>

<style scoped>
.inicio-wrap { display: flex; flex-direction: column; gap: 0; flex: 1; }
.hero-banner { background: linear-gradient(160deg, #1e2d47 0%, #131d30 100%); border: 1px solid var(--border-color); border-radius: var(--r-lg); padding: 22px 24px; display: flex; align-items: center; gap: 12px; position: relative; overflow: hidden; }
.hero-banner::before { content: ''; position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(124,58,237,.15) 0%, transparent 70%); top: -100px; right: -80px; pointer-events: none; }
.hero-icon { width: 48px; height: 48px; background: rgba(124,58,237,.2); border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; color: var(--violet-lt); flex-shrink: 0; }
.hero-title { font-family: var(--font-d); font-size: 1.3rem; margin: 0; color: var(--text-primary); }
.hero-sub { margin: 0; color: var(--text-secondary); font-size: 13px; }
.stats-row { display: flex; gap: 10px; }
.stat-pill { background: var(--c, rgba(124,58,237,.15)); border: 1px solid var(--border-color); border-radius: var(--r-md); padding: 12px 16px; display: flex; align-items: center; gap: 10px; color: var(--ct, var(--violet-lt)); min-width: 120px; }
.stat-pill i { font-size: 1.2rem; flex-shrink: 0; }
.stat-val { display: block; font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
.stat-lbl { display: block; font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .4px; }
.stat-card { background: linear-gradient(160deg, #1e2d47 0%, #131d30 100%); border: 1px solid var(--border-color); border-radius: var(--r-md); padding: 14px; display: flex; align-items: center; gap: 12px; }
.stat-icon { width: 44px; height: 44px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { color: var(--text-muted); font-size: 10px; text-transform: uppercase; margin: 0; }
.stat-card__value { color: var(--text-primary); font-weight: 700; font-size: 1.2rem; margin: 0; }
.section { display: flex; flex-direction: column; }
.section-header { display: flex; align-items: center; justify-content: space-between; }
.section-title { font-family: var(--font-d); font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.ver-todos-btn { font-size: 12px; color: var(--violet-lt); font-weight: 600; cursor: pointer; background: rgba(124,58,237,.1); border: 1px solid rgba(124,58,237,.2); padding: 4px 12px; border-radius: 20px; text-decoration: none; transition: all .2s; }
.ver-todos-btn:hover { background: rgba(124,58,237,.2); border-color: var(--violet); }
.books-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 16px; align-items: stretch; }
.books-row::-webkit-scrollbar { height: 3px; }
@media (max-width: 576px) { .books-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } }
@media (max-width: 420px) { .books-row { grid-template-columns: 1fr; } }
.offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
.offer-card { background: var(--bg-card); border: 1px solid rgba(245,158,11,.2); border-radius: var(--r-md); overflow: hidden; cursor: pointer; transition: all .25s; position: relative; }
.offer-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(245,158,11,.15); border-color: var(--accent); }
.offer-cover { height: 185px; position: relative; overflow: hidden; background: var(--bg-elevated); }
.offer-discount { position: absolute; top: 9px; right: 9px; background: var(--accent); color: #000; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; z-index: 2; }
.cover-fallback-of { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.offer-info { padding: 12px; }
.offer-title { font-weight: 700; font-size: 12px; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--text-primary); }
.offer-author { font-size: 11px; color: var(--text-secondary); margin-bottom: 7px; }
.offer-prices { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.offer-new-price { font-size: 14px; font-weight: 800; color: var(--accent); }
.offer-old-price { font-size: 11px; color: var(--text-muted); text-decoration: line-through; }
.offer-add-btn { width: 100%; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25); color: var(--accent); padding: 7px; border-radius: var(--r-sm); font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
.offer-add-btn:hover { background: var(--accent); color: #000; }
.ys-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-elevated); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md); z-index: 9999; white-space: nowrap; display: flex; align-items: center; }
.modal-overlay-ys { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(3px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-ys { background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: var(--r-lg); width: 100%; max-width: 440px; overflow: hidden; position: relative; }
.modal-x-btn { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; font-size: 16px; transition: all .2s; }
.modal-x-btn:hover { border-color: var(--violet); color: var(--text-primary); }
.modal-cover { height: 220px; background: var(--bg-elevated); position: relative; overflow: hidden; }
.modal-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-fallback-modal { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.book-badge-modal { position: absolute; top: 10px; left: 10px; background: var(--grad-main); color: white; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.modal-info { padding: 20px; }
.modal-cat { font-size: 10px; color: var(--violet-lt); text-transform: uppercase; font-weight: 700; letter-spacing: .5px; }
.modal-title { font-family: var(--font-d); font-size: 20px; color: var(--text-primary); margin: 4px 0 4px; }
.modal-author { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
.modal-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.stars { color: var(--accent); font-size: 15px; }
.rating-num { font-size: 12px; color: var(--text-secondary); }
.modal-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px; }
.modal-price-row { margin-bottom: 14px; }
.modal-price { font-size: 22px; font-weight: 800; color: var(--violet-lt); }
.modal-actions { display: flex; gap: 10px; }
.btn-modal-cart { background: var(--grad-main); color: white; padding: 10px 20px; border-radius: var(--r-sm); border: none; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; flex: 1; transition: opacity .2s; }
.btn-modal-cart:hover { opacity: .9; }
.btn-modal-ghost { background: transparent; color: var(--text-secondary); padding: 10px 16px; border-radius: var(--r-sm); border: 1px solid var(--border-color); font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: all .2s; }
.btn-modal-ghost:hover { border-color: var(--violet); color: var(--text-primary); }
</style>
