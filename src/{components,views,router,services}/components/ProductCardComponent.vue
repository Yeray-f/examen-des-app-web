<template>
  <!-- ProductCardComponent: tarjeta individual de libro, estilo YS Books Portada -->
  <div class="book-card" @click="$emit('verDetalle', producto)">
    <!-- Portada del libro -->
    <div class="book-cover">
      <!-- Badge especial/popular -->
      <span v-if="producto.badge" class="book-badge">{{ producto.badge }}</span>
      <!-- Botón wishlist -->
      <button class="wish-btn" :class="{ wished: esFavorito }" @click.stop="toggleFav" title="Favorito">
        <i :class="esFavorito ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
      </button>
      <!-- Imagen de portada -->
      <img
        v-if="producto.image"
        :src="producto.image"
        :alt="producto.name"
        class="cover-real"
        @error="imgError = true"
        :style="imgError ? 'display:none' : ''"
      />
      <!-- Fallback si no hay imagen -->
      <div class="cover-fallback" :style="{ background: colorFallback }">
        <i class="bi bi-book-fill text-white fs-3 opacity-75"></i>
        <span class="cover-fallback-title">{{ producto.name }}</span>
      </div>
      <!-- Botón agregar al carrito (aparece en hover) -->
      <button class="add-to-cart-btn" @click.stop="$emit('agregar', producto)">
        <i class="bi bi-bag-plus me-1"></i>Agregar al carrito
      </button>
    </div>

    <!-- Info del libro -->
    <div class="book-info">
      <p class="book-title">{{ producto.name }}</p>
      <p class="book-author">{{ producto.author }}</p>
      <div class="book-meta">
        <span class="book-price">${{ formatPrecio(producto.price) }}</span>
        <span class="book-rating">
          <span>★</span> {{ producto.rating || '4.2' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
const PALETA = ['#1e2d47','#2a1a5e','#0f2a50','#1e3a3a','#3a1a1a','#1a3a1a']

export default {
  name: 'ProductCardComponent',
  props: {
    producto: { type: Object, required: true }
  },
  emits: ['verDetalle', 'agregar'],
  data() {
    return {
      esFavorito: false,
      imgError: false
    }
  },
  computed: {
    colorFallback() {
      const idx = (this.producto.id || 0) % PALETA.length
      return PALETA[idx]
    }
  },
  methods: {
    toggleFav(e) {
      e.stopPropagation()
      this.esFavorito = !this.esFavorito
    },
    formatPrecio(price) {
      return Number(price).toLocaleString('es-CO')
    }
  }
}
</script>

<style scoped>
.book-card {
  flex-shrink: 0;
  width: 148px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform .25s, box-shadow .25s, border-color .25s;
  position: relative;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: rgba(124,58,237,.4);
}

.book-cover {
  height: 170px;
  position: relative;
  overflow: hidden;
  background: var(--bg-elevated);
}

.cover-real {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
}

.cover-fallback-title {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,.85);
  text-align: center;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-badge {
  position: absolute;
  top: 7px;
  left: 7px;
  background: var(--grad-main);
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  text-transform: uppercase;
  z-index: 2;
}

.wish-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  z-index: 2;
  transition: transform .2s;
  cursor: pointer;
  border: none;
  color: white;
}

.wish-btn:hover { transform: scale(1.2); }
.wish-btn.wished { background: rgba(239,68,68,.35); }

.add-to-cart-btn {
  position: absolute;
  bottom: -38px;
  left: 0;
  right: 0;
  background: var(--grad-main);
  color: white;
  padding: 8px;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  transition: bottom .25s;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.book-card:hover .add-to-cart-btn { bottom: 0; }

.book-info { padding: 9px 9px 11px; }

.book-title {
  font-weight: 600;
  font-size: 11px;
  line-height: 1.4;
  margin-bottom: 3px;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: 7px;
}

.book-meta { display: flex; align-items: center; justify-content: space-between; }

.book-price { font-size: 12px; font-weight: 700; color: var(--violet-lt); }

.book-rating { font-size: 9px; color: var(--text-muted); }
.book-rating span { color: var(--accent); }
</style>