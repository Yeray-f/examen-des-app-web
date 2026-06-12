<template>
  <!-- OfertasView: vista dedicada a ofertas especiales -->
  <div>
    <div class="section-header mb-4">
      <div>
        <h2 class="section-title">🏷️ Ofertas Especiales</h2>
        <p class="text-secondary mb-0" style="font-size:12px;">Los mejores precios en libros seleccionados</p>
      </div>
      <div class="oferta-badge-header">
        <i class="bi bi-lightning-fill me-1"></i>
        {{ ofertasActivas }} ofertas activas
      </div>
    </div>

    <!-- Filtro de descuento -->
    <div class="chips-row mb-4">
      <button
        v-for="f in filtros"
        :key="f.val"
        class="chip"
        :class="{ 'chip--active': filtroActual === f.val }"
        @click="filtroActual = f.val"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Grid de ofertas -->
    <div class="offers-grid">
      <div
        v-for="oferta in ofertasFiltradas"
        :key="oferta.id"
        class="offer-card"
        @click="seleccionado = oferta"
      >
        <div class="offer-cover">
          <span class="offer-discount">-{{ oferta.descuento }}%</span>
          <img v-if="oferta.image" :src="oferta.image" :alt="oferta.name" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" @error="e => { e.target.onerror = null; e.target.src = $resolveCover(null, { title: 'Libro', id: 0 }) }" />
          <div v-else class="cover-fallback" :style="{ background: colorOf(oferta.id) }">
            <i class="bi bi-book-fill text-white fs-2 opacity-75"></i>
          </div>
        </div>
        <div class="offer-info">
          <span class="offer-cat">{{ oferta.category }}</span>
          <p class="offer-title">{{ oferta.name }}</p>
          <p class="offer-author">{{ oferta.author }}</p>
          <div class="offer-prices">
            <span class="offer-new-price">${{ formatPrecio(oferta.precioOferta) }}</span>
            <span class="offer-old-price">${{ formatPrecio(oferta.price) }}</span>
          </div>
          <button class="offer-add-btn" @click.stop="agregarAlCarrito(oferta)">
            <i class="bi bi-bag-plus me-1"></i>Agregar al carrito
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="ys-toast">
      <i class="bi bi-check-circle-fill text-success me-2"></i>{{ toast }}
    </div>

    <!-- Modal -->
    <div v-if="seleccionado" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" @click.self="seleccionado = null">
      <div class="modal-ys">
        <button class="modal-x-btn" @click="seleccionado = null"><i class="bi bi-x"></i></button>
        <div class="modal-cover">
          <img v-if="seleccionado.image" :src="seleccionado.image" :alt="seleccionado.name" @error="e => { e.target.onerror = null; e.target.src = $resolveCover(null, { title: 'Libro', id: 0 }) }" />
          <div v-else class="cover-fb">📚</div>
          <span class="offer-modal-badge">-{{ seleccionado.descuento }}%</span>
        </div>
        <div class="modal-info">
          <span class="modal-cat">{{ seleccionado.category }}</span>
          <h3 class="modal-title">{{ seleccionado.name }}</h3>
          <p class="modal-author">{{ seleccionado.author }}</p>
          <p class="modal-desc">{{ seleccionado.description }}</p>
          <div class="offer-prices mb-3">
            <span class="offer-new-price fs-5">${{ formatPrecio(seleccionado.precioOferta) }}</span>
            <span class="offer-old-price">${{ formatPrecio(seleccionado.price) }}</span>
            <span class="ahorro-badge">Ahorras ${{ formatPrecio(seleccionado.price - seleccionado.precioOferta) }}</span>
          </div>
          <div class="modal-actions">
            <button class="btn-modal-cart" @click="agregarAlCarrito(seleccionado); seleccionado = null">
              <i class="bi bi-bag-plus me-2"></i>Agregar al carrito
            </button>
            <button class="btn-modal-ghost" @click="seleccionado = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerProductos } from '../services/productService.js'
import { cartStore } from '../services/cartService.js'

const DESCUENTOS = [20, 15, 20, 15, 20, 10, 15, 20, 10, 25, 15, 20]
const PALETA = ['#1a2235','#2a1a5e','#0f2a50','#1e3a3a','#3a1a1a','#1a3a1a']

export default {
  name: 'OfertasView',
  data() {
    return {
      productos: [],
      filtroActual: '',
      seleccionado: null,
      toast: '',
      filtros: [
        { val: '', label: 'Todos' },
        { val: 10, label: '-10%' },
        { val: 15, label: '-15%' },
        { val: 20, label: '-20%' },
        { val: 25, label: '-25%' }
      ]
    }
  },
  computed: {
    ofertas() {
      return this.productos.map((p, i) => ({
        ...p,
        descuento: DESCUENTOS[i % DESCUENTOS.length],
        precioOferta: Math.round(p.price * (1 - DESCUENTOS[i % DESCUENTOS.length] / 100))
      }))
    },
    ofertasFiltradas() {
      if (!this.filtroActual) return this.ofertas
      return this.ofertas.filter(o => o.descuento === this.filtroActual)
    },
    ofertasActivas() { return this.ofertas.length }
  },
  created() {
    this.productos = obtenerProductos()
  },
  methods: {
    agregarAlCarrito(libro) {
      cartStore.agregar(libro)
      this.toast = `"${libro.name}" agregado al carrito`
      setTimeout(() => { this.toast = '' }, 2500)
    },
    formatPrecio(price) { return Number(price).toLocaleString('es-CO') },
    colorOf(id) { return PALETA[id % PALETA.length] }
  }
}
</script>

<style scoped>
.section-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.section-title { font-family: var(--font-d); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.oferta-badge-header { background: rgba(245,158,11,.15); border: 1px solid rgba(245,158,11,.3); color: var(--accent); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.chips-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; font-family: inherit; transition: all .2s; }
.chip:hover, .chip--active { background: rgba(124,58,237,.15); border-color: var(--violet); color: var(--violet-lt); }
.offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(195px, 1fr)); gap: 14px; }
.offer-card { background: var(--bg-card); border: 1px solid rgba(245,158,11,.2); border-radius: var(--r-md); overflow: hidden; cursor: pointer; transition: all .25s; position: relative; }
.offer-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(245,158,11,.15); border-color: var(--accent); }
.offer-cover { height: 185px; position: relative; overflow: hidden; background: var(--bg-elevated); }
.offer-discount { position: absolute; top: 9px; right: 9px; background: var(--accent); color: #000; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; z-index: 2; }
.cover-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.offer-info { padding: 12px; }
.offer-cat { font-size: 9px; color: var(--violet-lt); text-transform: uppercase; font-weight: 700; letter-spacing: .5px; }
.offer-title { font-weight: 700; font-size: 12px; margin: 3px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--text-primary); }
.offer-author { font-size: 11px; color: var(--text-secondary); margin-bottom: 7px; }
.offer-prices { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
.offer-new-price { font-size: 14px; font-weight: 800; color: var(--accent); }
.offer-old-price { font-size: 11px; color: var(--text-muted); text-decoration: line-through; }
.ahorro-badge { font-size: 10px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.3); color: #34d399; padding: 2px 7px; border-radius: 10px; font-weight: 600; }
.offer-add-btn { width: 100%; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25); color: var(--accent); padding: 7px; border-radius: var(--r-sm); font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
.offer-add-btn:hover { background: var(--accent); color: #000; }
.ys-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-elevated); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 500; box-shadow: var(--shadow-md); z-index: 9999; white-space: nowrap; display: flex; align-items: center; }
.modal-ys { background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: var(--r-lg); width: 100%; max-width: 440px; overflow: hidden; position: relative; }
.modal-x-btn { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; font-size: 16px; transition: all .2s; }
.modal-x-btn:hover { border-color: var(--violet); color: var(--text-primary); }
.modal-cover { height: 220px; background: var(--bg-elevated); position: relative; overflow: hidden; }
.modal-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-fb { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.offer-modal-badge { position: absolute; top: 10px; right: 10px; background: var(--accent); color: #000; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; z-index: 2; }
.modal-info { padding: 20px; }
.modal-cat { font-size: 10px; color: var(--violet-lt); text-transform: uppercase; font-weight: 700; letter-spacing: .5px; }
.modal-title { font-family: var(--font-d); font-size: 20px; color: var(--text-primary); margin: 4px 0; }
.modal-author { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
.modal-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px; }
.modal-actions { display: flex; gap: 10px; }
.btn-modal-cart { background: var(--grad-main); color: white; padding: 10px 20px; border-radius: var(--r-sm); border: none; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; flex: 1; transition: opacity .2s; }
.btn-modal-cart:hover { opacity: .9; }
.btn-modal-ghost { background: transparent; color: var(--text-secondary); padding: 10px 16px; border-radius: var(--r-sm); border: 1px solid var(--border-color); font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: all .2s; }
.btn-modal-ghost:hover { border-color: var(--violet); color: var(--text-primary); }
</style>
