<template>
  <div>
    <div class="section-header mb-4">
      <div>
        <h2 class="section-title"><i class="bi bi-grid-fill me-2"></i>Catálogo de Libros</h2>
        <p class="text-secondary mb-0" style="font-size:12px;">Explora nuestra colección completa</p>
      </div>
    </div>
    <div class="filtros-bar mb-4">
      <div class="search-box flex-grow-1">
        <i class="bi bi-search"></i>
        <input v-model="busqueda" type="text" placeholder="Buscar por título o autor..." />
      </div>
      <div class="chips-row">
        <button
          v-for="cat in ['Todos', ...categorias]"
          :key="cat"
          class="chip"
          :class="{ 'chip--active': filtroCategoria === (cat === 'Todos' ? '' : cat) }"
          @click="filtroCategoria = cat === 'Todos' ? '' : cat"
        >{{ cat }}</button>
      </div>
    </div>
    <div v-if="librosFiltrados.length" class="books-grid">
      <ProductCardComponent
        v-for="(libro, i) in librosFiltrados"
        :key="libro.id"
        :producto="{ ...libro, badge: badges[i % badges.length], rating: (3.8 + (i * 0.15) % 1.2).toFixed(1) }"
        @verDetalle="verDetalle"
        @agregar="agregarAlCarrito"
      />
    </div>
    <div v-else class="empty-state">
      <i class="bi bi-search fs-1 mb-2 d-block" style="color:var(--text-muted)"></i>
      <p>No se encontraron libros con ese filtro.</p>
    </div>
    <div v-if="toast" class="ys-toast"><i class="bi bi-check-circle-fill text-success me-2"></i>{{ toast }}</div>
    <div v-if="libroSeleccionado" class="modal-overlay-ys" @click.self="cerrarDetalle">
      <div class="modal-ys">
        <button class="modal-x-btn" @click="cerrarDetalle"><i class="bi bi-x"></i></button>
        <div class="modal-cover">
          <img v-if="libroSeleccionado.image" :src="libroSeleccionado.image" :alt="libroSeleccionado.name" />
          <div v-else class="cover-fallback-modal">📚</div>
        </div>
        <div class="modal-info">
          <span class="modal-cat">{{ libroSeleccionado.category }}</span>
          <h3 class="modal-title">{{ libroSeleccionado.name }}</h3>
          <p class="modal-author">{{ libroSeleccionado.author }}</p>
          <p class="modal-desc">{{ libroSeleccionado.description }}</p>
          <p class="modal-price">${{ formatPrecio(libroSeleccionado.price) }}</p>
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

export default {
  name: 'CatalogoView',
  components: { ProductCardComponent },
  data() {
    return {
      productos: [],
      busqueda: this.$route?.query?.q || '',
      filtroCategoria: '',
      libroSeleccionado: null,
      toast: '',
      badges: ['ESPECIAL', null, 'POPULAR', null, null, null, 'ESPECIAL', null]
    }
  },
  computed: {
    categorias() { return [...new Set(this.productos.map(p => p.category))].sort() },
    librosFiltrados() {
      let lista = this.productos
      if (this.busqueda) { const q = this.busqueda.toLowerCase(); lista = lista.filter(p => p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)) }
      if (this.filtroCategoria) { lista = lista.filter(p => p.category === this.filtroCategoria) }
      return lista
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
    formatPrecio(price) { return Number(price).toLocaleString('es-CO') }
  }
}
</script>

<style scoped>
.section-header { display: flex; align-items: flex-start; justify-content: space-between; }
.section-title { font-family: var(--font-d); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.filtros-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 30px; padding: 9px 16px; transition: border-color .2s; }
.search-box:focus-within { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,58,237,.15); }
.search-box i { color: var(--text-muted); }
.search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; width: 100%; font-family: inherit; }
.search-box input::placeholder { color: var(--text-muted); }
.chips-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; transition: all .2s; font-family: inherit; }
.chip:hover, .chip--active { background: rgba(124,58,237,.15); border-color: var(--violet); color: var(--violet-lt); }
.books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 14px; }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.ys-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-elevated); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md); z-index: 9999; white-space: nowrap; display: flex; align-items: center; }
.modal-overlay-ys { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(3px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-ys { background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: var(--r-lg); width: 100%; max-width: 440px; overflow: hidden; position: relative; }
.modal-x-btn { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; font-size: 16px; transition: all .2s; }
.modal-x-btn:hover { border-color: var(--violet); color: var(--text-primary); }
.modal-cover { height: 220px; background: var(--bg-elevated); position: relative; overflow: hidden; }
.modal-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-fallback-modal { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.modal-info { padding: 20px; }
.modal-cat { font-size: 10px; color: var(--violet-lt); text-transform: uppercase; font-weight: 700; letter-spacing: .5px; }
.modal-title { font-family: var(--font-d); font-size: 20px; color: var(--text-primary); margin: 4px 0; }
.modal-author { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
.modal-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px; }
.modal-price { font-size: 22px; font-weight: 800; color: var(--violet-lt); margin-bottom: 14px; }
.modal-actions { display: flex; gap: 10px; }
.btn-modal-cart { background: var(--grad-main); color: white; padding: 10px 20px; border-radius: var(--r-sm); border: none; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; flex: 1; transition: opacity .2s; }
.btn-modal-cart:hover { opacity: .9; }
.btn-modal-ghost { background: transparent; color: var(--text-secondary); padding: 10px 16px; border-radius: var(--r-sm); border: 1px solid var(--border-color); font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: all .2s; }
.btn-modal-ghost:hover { border-color: var(--violet); color: var(--text-primary); }
</style>